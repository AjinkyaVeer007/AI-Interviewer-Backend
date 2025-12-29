const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/resume");
  },
  filename: function (req, file, cb) {
    cb(null, "resume.pdf");
  },
});

const multerUpload = multer({ storage: storage });

module.exports = multerUpload;
