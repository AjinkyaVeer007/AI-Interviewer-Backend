const express = require("express");
const { uploadResume, register } = require("../controllers/user.controller");
const multerUpload = require("../middlewares/multerUpload");

const router = express.Router();

router.post("/register", register);
router.post("/upload_resume", multerUpload.single("file"), uploadResume);

module.exports = router;
