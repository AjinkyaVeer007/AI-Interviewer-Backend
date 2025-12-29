const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    // Handle the global error
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }
};

module.exports = asyncHandler;
