const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers?.authorization;

    if (!token) {
      return res.status(400).json({
        message: "Token is missing",
        success: false,
      });
    }

    const decode = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);

    if (!decode) {
      return res.status(403).json({
        message: "Unauthorised user",
        success: false,
      });
    }

    req.user = {
      userId: decode.userId,
    };

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Unauthorised user",
      success: false,
    });
  }
};

module.exports = auth;
