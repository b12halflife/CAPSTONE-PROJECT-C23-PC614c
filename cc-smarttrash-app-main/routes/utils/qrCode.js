const db = require("../../bin/dbconnection");

const createQr = ({
  qrcodeId,
  status,
  userId,
  username,
  est_points,
  total_trash,
  imgLink,
}) =>
  db.connect((err) => {
    if (err) throw err;
    let query = `INSERT INTO qrcode(qrcodeId, status, userId, username, est_points, total_trash, imgLink) VALUES ('${qrcodeId}', '${status}', '${userId}', '${username}', '${est_points}', '${total_trash}', '${imgLink}')`;
    db.query(query, (err, result) => {
      if (err) throw err;
    });
    let query2 = `UPDATE users SET trash_temp = '' WHERE id = '${userId}'`;
    db.query(query2, (err, result) => {
      if (err) throw err;
    });
  });

const findQr = (qrId, res) =>
  db.connect((err) => {
    if (err) throw err;
    let query = `SELECT * FROM qrcode WHERE qrcodeId = '${qrId}'`;
    db.query(query, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.send({
          status: "success",
          message: "QR Code Found",
          data: result,
        });
      } else {
        res.send({
          status: "failed",
          message: "Invalid QR Code ID",
        });
      }
    });
  });

const updateStatus = (qrId, res) => {
  db.connect((err) => {
    if (err) throw err;
    let query = `UPDATE qrcode SET status = 'approved' WHERE qrcodeId = '${qrId}'`;
    let query2 = `SELECT * FROM qrcode WHERE qrcodeId = '${qrId}'`;
    db.query(query2, (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.send({
          status: "failed",
          message: "QR Code doesn't exists",
        });
      }
      if (result[0].status === "approved") {
        return res.send({
          status: "failed",
          message: "QR Code already approved",
        });
      }
      if (result.length > 0) {
        // UPDATE USER POINTS
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
              res.send({
                status: "success",
                message: "QR Code Approved and Points updated",
                data: {
                  qrcodeId: qrId,
                  points_before: resultUser[0].points,
                  points_after: total_points,
                },
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
module.exports.updateStatus = updateStatus;
