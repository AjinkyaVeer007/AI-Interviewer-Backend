const express = require("express");
const {
  uploadResume,
  register,
  login,
} = require("../controllers/user.controller");
const multerUpload = require("../middlewares/multerUpload");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/upload_resume", auth, multerUpload.single("file"), uploadResume);

module.exports = router;
