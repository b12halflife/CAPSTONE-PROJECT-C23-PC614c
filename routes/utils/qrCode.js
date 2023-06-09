const db = require("../../bin/dbconnection");
// mailer
const mail = require("./mail");

const createQr = ({
  qrcodeId,
  status,
  userId,
  username,
  est_points,
  total_trash,
  imgLink,
  authCode,
}) =>
  db.connect((err) => {
    if (err) throw err;
    let query = `INSERT INTO qrcode(qrcodeId, status, userId, username, est_points, total_trash, imgLink, code) VALUES ('${qrcodeId}', '${status}', '${userId}', '${username}', '${est_points}', '${total_trash}', '${imgLink}', '${authCode}')`;
    db.query(query, (err, result) => {
      if (err) throw err;
    });
    let query2 = `UPDATE users SET trash_temp = '' WHERE id = '${userId}'`;
    db.query(query2, (err, result) => {
      if (err) throw err;
    });
  });

const findQrDataForMail = (qrId, res) => {
  db.connect((err) => {
    if (err) throw err;
    let query = `SELECT * FROM qrcode WHERE qrcodeId = '${qrId}'`;
    db.query(query, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        mail.sendMail(result[0]);
        res.send({ status: "success", message: "Authentication Message Sent" });
      } else {
        res.send({ status: "failed", message: "Invalid QR ID" });
      }
    });
  });
};

const findQr = (qrId, res) =>
  db.connect((err) => {
    if (err) throw err;
    let query = `SELECT * FROM qrcode WHERE qrcodeId = '${qrId}'`;
    db.query(query, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        let {
          qrcodeId,
          status,
          userId,
          username,
          est_points,
          total_trash,
          imgLink,
        } = result[0];
        let newqrData = {
          qrcodeId,
          status,
          userId,
          username,
          est_points,
          total_trash,
          imgLink,
        };
        res.send({
          status: "success",
          message: "QR Code Found",
          data: newqrData,
        });
      } else {
        res.send({
          status: "failed",
          message: "Invalid QR Code ID",
        });
      }
    });
  });

const findQrWeb = (qrId, res) =>
  db.connect((err) => {
    if (err) throw err;
    let query = `SELECT * FROM qrcode WHERE qrcodeId = '${qrId}'`;
    db.query(query, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        let { qrcodeId, status, userId, username, est_points, total_trash } =
          result[0];
        let qrData = {
          qrcodeId,
          status,
          userId,
          username,
          est_points,
          total_trash,
        };
        res.render("approve", { result: qrData, error: false, message: null });
      } else {
        res.locals.error = "Invalid QR ID";
        res.render("approve");
      }
    });
  });

const updateStatus = (qrId, code, res) => {
  db.connect((err) => {
    if (err) throw err;
    let query = `UPDATE qrcode SET status = 'approved' WHERE qrcodeId = '${qrId}'`;
    let query2 = `SELECT * FROM qrcode WHERE qrcodeId = '${qrId}' AND code = '${code}'`;
    db.query(query2, (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.redirect(`/qrcode/approve/${qrId}`);
      }
      if (result[0].status === "approved") {
        return res.redirect(`/qrcode/approve/${qrId}`);
      }
      if (result.length > 0) {
        // UPDATE USER POINTS
        let { qrcodeId, userId, username, est_points, total_trash } = result[0];
        let qrData = {
          qrcodeId,
          status: "approved",
          userId,
          username,
          est_points,
          total_trash,
        };
        let queryUser = `SELECT * FROM users WHERE id = ${result[0].userId}`;
        db.query(queryUser, (err, resultUser) => {
          if (err) throw err;
          if (resultUser.length > 0) {
            let total_points = resultUser[0].points + result[0].est_points;
            let queryUpdate = `UPDATE users SET points = '${total_points}' WHERE id = '${result[0].userId}'`;
            db.query(query, (err, result) => {
              if (err) throw err;
              console.log(`Updated QR ${qrId} status to approved`);
            });
            db.query(queryUpdate, (err, result) => {
              if (err) throw err;
              res.render("approve", {
                result: qrData,
                error: false,
                message: "Successfully Updated QR Code Status",
              });
            });
          } else {
            return res.send({
              status: "failed",
              message: "Failed when searching user or updating data",
            });
          }
        });
      } else {
        return res.send({
          status: "failed",
          message: "Failed when searching user or updating data",
        });
      }
    });
  });
};

module.exports.createQr = createQr;
module.exports.findQr = findQr;
module.exports.findQrDataForMail = findQrDataForMail;
module.exports.findQrWeb = findQrWeb;
module.exports.updateStatus = updateStatus;
