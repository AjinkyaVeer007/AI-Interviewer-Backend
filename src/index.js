const dotenv = require("dotenv");
const express = require("express");
const router = require("./routes/user.routes");
const cors = require("cors");
const connection = require("./config/config");

dotenv.config();

connection()
  .then((res) => {
    console.log("Mongodb connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/user", router);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
