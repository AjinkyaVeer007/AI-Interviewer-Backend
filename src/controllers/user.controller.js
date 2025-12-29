const asyncHandler = require("../utils/asyncHandler");
const { CustomError } = require("../utils/customError");
const textScrapper = require("../utils/textScrapper");

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new CustomError("Please upload resume", 400);
  }

  const content = await textScrapper(req.file.path);

  if (!content) {
    throw new CustomError("Failed to scrap text from pdf", 400);
  }

  return res.json({
    message: "Success",
    content: content,
  });
});

module.exports = {
  uploadResume,
};
