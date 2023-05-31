var express = require("express");
var router = express.Router();
// Insert User in MySQL for POST "/signup"
const insertUser = require("./utils/insertUser");
// Find User in MySQL for POST "/login"
const findUser = require("./utils/findUser");
// bcrypt
const bcrypt = require("bcrypt");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ status: "success", message: "Render homepage" });
});

/* GET & POST SIGN UP page. */
router.get("/signup", function (req, res, next) {
  res.send({ status: "success", message: "Render signup" });
});

router.post("/signup", function (req, res, next) {
  let { username, password } = req.body;
  if (username.length < 7 || password.length < 7) {
    return res.send({
      status: "failed",
      message: "Username or Password minimum characters is 7",
    });
  }
  // hash & UPLOAD TO DATABASE
  const hash = bcrypt.hashSync(password, 10);
  insertUser(username, hash, res);
  // REDIRECT TO LOGIN PAGE
  // res.redirect("/login");
});

/* GET & POST LOG IN page. */
router.get("/login", function (req, res, next) {
  res.send({ status: "success", message: "Render login" });
});

router.post("/login", function (req, res, next) {
  let { username, password } = req.body;
  // compare hash & FIND IN DATABASE
  findUser.findUser(username, password, res, req);
  // REDIRECT TO USER HOMEPAGE
});

module.exports = router;
