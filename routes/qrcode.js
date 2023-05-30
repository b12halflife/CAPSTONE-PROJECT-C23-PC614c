var express = require("express");
var router = express.Router();
// uuid
const { v4: uuidv4 } = require("uuid");
var qrCode = require("./utils/qrCode");
// gcs
var gcs = require("./utils/cloudbucket");

router.get("/display/:id", function (req, res, next) {
  let { id: qrId } = req.params;
  console.log(qrId);
  // Find QR ID in Database
  qrCode.findQr(qrId, res);
});

/* GET // POST create QRCODE. */
router.post("/create", function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  // REQ BODY = Est. Points, Total Trash
  let { id, username } = req.session.user;
  const { trash_name, amount, est_trash_points } = req.body;
  let data = [];
  for (let key in trash_name) {
    data = [
      ...data,
      {
        name: trash_name[key],
        est_trash_points: parseInt(est_trash_points[key]),
        amount: parseInt(amount[key]),
      },
    ];
  }
  // FINAL DATA
  let trash_data = data;
  let est_points = 0;
  let total_trash = 0;
  for (let key in trash_data) {
    est_points =
      est_points + trash_data[key].est_trash_points * trash_data[key].amount;
    total_trash = total_trash + trash_data[key].amount;
  }
  console.log(total_trash);
  let generateqrId = uuidv4();
  //// QR CODE DATA -> qr img link (to cloud bucket), status, total trash, points, id, userId
  gcs.uploadBucket(generateqrId);
  let bucketName = "qrcode_image";
  let imgLink = `https://storage.googleapis.com/${bucketName}/${generateqrId}.png`;
  // CREATE QRCODE, UPLOAD TO ID TO DATABASE (FOR APPROVE LINK)
  let qrData = {
    qrcodeId: generateqrId,
    status: "pending",
    userId: id,
    username,
    est_points,
    total_trash,
    imgLink,
  };
  qrCode.createQr(qrData);
  res.send({
    status: "success",
    message: `Successfuly created QR Code (${generateqrId})`,
    data: {
      ...qrData,
      qrLink: `localhost:3000/qrcode/display/${generateqrId}`,
    },
  });
  // Redirect to QR Display
  // res.redirect(`/qrcode/display/${generateqrId}`);
});

router.get("/approve/:id", function (req, res, next) {
  let { id: qrId } = req.params;
  // FIND :id IN QR CODE DATABASE
  qrCode.updateStatus(qrId, res);
});

module.exports = router;
