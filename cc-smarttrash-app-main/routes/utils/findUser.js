const db = require("../../bin/dbconnection");

const findUser = (username, password, res, req) =>
  db.connect((err) => {
    if (err) throw err;
    let query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.query(query, [username, password], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        let { id, username, points, trash_temp } = result[0];
        let userData = {
          id,
          username,
          points,
          trash_temp,
        };
        req.session.user = userData;
        res.status(200);
        res.redirect("/user/home");
      } else {
        res.send({
          status: "failed",
          message: "Invalid Username or Password",
        });
      }
    });
  });

const findUserForDisplay = (res, req) =>
  db.connect((err) => {
    if (err) throw err;
    let query = `SELECT * FROM users WHERE id = ${req.session.user.id}`;
    db.query(query, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        let { id, username, points, trash_temp } = result[0];
        if (points == null) points = 0;
        let userData = {
          id,
          username,
          points,
          trash_temp,
        };
        res.send({
          status: "success",
          message: `Welcome ${username} to the homepage, you have ${points} points right now.`,
          data: userData,
        });
      }
    });
  });

module.exports.findUser = findUser;
module.exports.findUserForDisplay = findUserForDisplay;
