var express = require("express");
var router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Convert buffer js
const convertBuffer = require("./utils/convertbuffer");

// Find User in MySQL and Update trash_temp
const trash_temp = require("./utils/temp_trash");

// Find user for display
const findUser = require("./utils/findUser");

/* GET user HOME PAGE. */
router.get("/home", function (req, res, next) {
  if (req.session.user) {
    findUser.findUserForDisplay(res, req);
  } else {
    // Redirect to login page
    res.redirect("/login");
  }
});

/* GET user SCAN PAGE. */
router.get("/scan", function (req, res, next) {
  if (req.session.user) {
    res.render("scan");
  } else {
    res.redirect("/login");
  }
});

router.get("/profile", function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  findUser.findUserForProfile(res, req);
});

// GET & PUT & DELETE for after Scanning trash
// router.post(
//   "/scan/test",
//   upload.single("image"),
//   async function (req, res, next) {}
// );

router.get("/scan/add", function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  trash_temp.findUserAndDisplay(res, req);
});

router.post(
  "/scan/add",
  upload.single("image"),
  async function (req, res, next) {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    const output = await convertBuffer.getImage(
      req.file.buffer,
      req.file.originalname
    );
    console.log(output);
    await trash_temp.findUserAndUpdate(res, req, output);
  }
);

router.get("/scan/remove", function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  trash_temp.findUserAndDelete(res, req);
});

/* GET user REDEEM PAGE. */
router.get("/redeem", function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("redeem");
});

/* user LOG OUT */
router.get("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) throw err;
  });
  res.render("index");
});

module.exports = router;
