let mysql = require("mysql2");
let config = require("./config/config.js");
let db = mysql.createConnection(config);

module.exports = db;
