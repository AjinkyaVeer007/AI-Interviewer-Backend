const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.log(error);
    // Handle the global error
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }
    return res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = asyncHandler;
