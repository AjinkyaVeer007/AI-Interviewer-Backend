const dotenv = require("dotenv");
const { default: OpenAI } = require("openai");
const asyncHandler = require("../utils/asyncHandler");
const { CustomError } = require("../utils/customError");
const textScrapper = require("../utils/textScrapper");
const { default: z } = require("zod");
const { zodTextFormat } = require("openai/helpers/zod.js");
const fs = require("fs");
const User = require("../models/user.model");
const Questions = require("../models/questions.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

dotenv.config();

const ObjectId = mongoose.Types.ObjectId;

const client = new OpenAI();

const QuestionFormat = z.object({
  questions: z.array(z.string()),
});

const register = asyncHandler(async (req, res) => {
  const { username, fname, lname, password } = req?.body;

  if (!username || !fname || !lname || !password) {
    throw new CustomError("All fields are mandatory", 400);
  }

  const user = new User({
    username,
    fname,
    lname,
    password,
  });

  await user.save();

  return res.status(200).json({
    message: "User created successfully",
    success: true,
    user: user,
  });
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req?.body;

  if (!username || !password) {
    throw new CustomError("All fields are mandatory", 400);
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new CustomError("Register first to login", 400);
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new CustomError("Passowrd is incorrect", 400);
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );

  user.token = token;
  user.password = undefined;

  return res.status(200).json({
    message: "User created successfully",
    user,
    success: true,
  });
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

  let questions = new Questions({
    userId: new ObjectId(req.user.userId),
    questions: event.questions,
  });

  await questions.save();

  return res.json({
    message: "Questions created successfully",
    questions,
  });
});

module.exports = {
  uploadResume,
  register,
  login,
};
