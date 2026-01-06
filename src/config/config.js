const { default: mongoose } = require("mongoose");

const connection = async () => {
  const instance = await mongoose.connect(
    "mongodb://admin:admin@localhost:27017/langgraph?authSource=admin"
  );

  return instance;
};

module.exports = connection;
