const db = require("../../bin/dbconnection");
const bcrypt = require("bcrypt");

const findUser = (username, password, res, req) => {
  db.connect((err) => {
    if (err) throw err;
    let query = `SELECT * FROM users WHERE username = ?`;
    db.query(query, [username], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        // Bcrypt compare password
        const comparePassword = bcrypt.compareSync(
          password,
          result[0].password
        );
        if (!comparePassword) {
          return res.render("login", {
            error: true,
            message: "Invalid Username or Password",
          });
        }
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
        res.render("login", {
          error: true,
          message: "Invalid Username or Password",
        });
      }
    });
  });
};

const findUserForDisplay = (res, req) => {
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
        res.render("user", { data: userData });
      }
    });
  });
};

const findUserForProfile = (res, req) => {
  db.connect((err) => {
    if (err) throw err;
    let query = `SELECT * FROM qrcode WHERE userId = '${req.session.user.id}' AND username = '${req.session.user.username}'`;
    db.query(query, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.render("profile", { data: result });
      } else {
        res.render("profile", { data: [{}] });
      }
    });
  });
};

module.exports.findUser = findUser;
module.exports.findUserForDisplay = findUserForDisplay;
module.exports.findUserForProfile = findUserForProfile;
