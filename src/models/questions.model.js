const { default: mongoose } = require("mongoose");

const questionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Questions = mongoose.model("Questions", questionSchema);

module.exports = Questions;
