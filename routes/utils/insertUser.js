const db = require("../../bin/dbconnection");

const insertUser = (username, password, res) => {
  db.connect((err) => {
    if (err) throw err;
    let query = `INSERT INTO users(username, password, points) VALUES ('${username}', '${password}', 0)`;
    db.query(query, (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.render("signup", {
            error: true,
            message: "Username already exist",
          });
        }
      } else {
        res.render("signup", {
          error: false,
          message: "Successfully Signed Up!",
        });
      }
    });
  });
};

module.exports = insertUser;
