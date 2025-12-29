const express = require("express");
const { uploadResume } = require("../controllers/user.controller");
const multerUpload = require("../middlewares/multerUpload");

const router = express.Router();

router.post("/upload_resume", multerUpload.single("file"), uploadResume);

module.exports = router;
