const dotenv = require("dotenv");
const { default: OpenAI } = require("openai");
const asyncHandler = require("../utils/asyncHandler");
const { CustomError } = require("../utils/customError");
const textScrapper = require("../utils/textScrapper");
const { default: z } = require("zod");
const { zodTextFormat } = require("openai/helpers/zod.js");
const fs = require("fs");

dotenv.config();

const client = new OpenAI();

const QuestionFormat = z.object({
  questions: z.array(z.string()),
});

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new CustomError("Please upload resume", 400);
  }

  const content = await textScrapper(req.file.path);

  if (!content) {
    throw new CustomError("Failed to scrap text from pdf", 400);
  }

  const PROMPT = `
  You are an AI Interviewer which create questions based on user information like profession, experience, skills etc
  Below are the text content scrapped from resume of pdf file. Analyse the content and based on information create 5 theoretical questions.
  The question level should be based on experience skill the user have. Always add first question like Introduce yourself.

  Questions type
    - Based on skills
    - Based on Prior company work experience
    - Based on personal projects
    - If user is IT professional, then based on tech stack

  Content - 
  ${content}
  `;

  const response = await client.responses.parse({
    model: "gpt-4o-mini",
    input: PROMPT,
    text: {
      format: zodTextFormat(QuestionFormat, "questions"),
    },
  });

  const event = response.output_parsed;

  if (!event.questions.length) {
    throw new CustomError("Failed to generate questions", 400);
  }

  fs.writeFile(
    "src/candidate_analytics/questions.json",
    JSON.stringify(event),
    (err) => {
      if (err) {
        throw new CustomError(err.message, 400);
      }
    }
  );

  return res.json({
    message: "Questions created successfully",
  });
});

module.exports = {
  uploadResume,
};
