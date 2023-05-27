const db = require("../../bin/dbconnection");

const insertUser = (username, password) =>
  db.connect((err) => {
    if (err) throw err;
    let query = `INSERT INTO users(username, password, points) VALUES ('${username}', '${password}', 0)`;
    db.query(query);
  });

module.exports = insertUser;
