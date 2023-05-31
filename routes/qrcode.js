var express = require("express");
var router = express.Router();
// uuid
const { v4: uuidv4 } = require("uuid");
const qrCode = require("./utils/qrCode");
// gcs
const gcs = require("./utils/cloudbucket");

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
  let generateqrId = uuidv4();
  //// QR CODE DATA -> qr img link (to cloud bucket), status, total trash, points, id, userId
  gcs.uploadBucket(generateqrId);
  let bucketName = "codeqr_image";
  let imgLink = `https://storage.googleapis.com/${bucketName}/${generateqrId}.png`;
  // CREATE QRCODE, UPLOAD TO ID TO DATABASE (FOR APPROVE LINK)
  const result = Math.random() * (9999 - 1000) + 1000;
  const authCode = Math.floor(result);
  let qrData = {
    qrcodeId: generateqrId,
    status: "pending",
    userId: id,
    username,
    est_points,
    total_trash,
    imgLink,
  };
  qrCode.createQr({ ...qrData, authCode });
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
  qrCode.findQrWeb(qrId, res);
});

router.post("/approve/:id", function (req, res, next) {
  let { id: qrId } = req.params;
  let { code } = req.body;
  // FIND :id IN QR CODE DATABASE
  qrCode.updateStatus(qrId, code, res);
});

router.post("/reqauth/:id?", function (req, res, next) {
  qrCode.findQrDataForMail(req.params.id, res);
});

module.exports = router;
