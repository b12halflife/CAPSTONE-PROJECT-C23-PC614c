const db = require("../../bin/dbconnection");

const insertUser = (username, password, res) => {
  db.connect((err) => {
    if (err) throw err;
    let query = `INSERT INTO users(username, password, points) VALUES ('${username}', '${password}', 0)`;
    db.query(query, (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.send({
            status: "failed",
            message: "Username already exist",
          });
        }
      } else {
        res.send({
          status: "success",
          message: "Successfully Signed up",
          data: { username, password },
        });
      }
    });
  });
};

module.exports = insertUser;
