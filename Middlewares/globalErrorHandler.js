exports.globalError = (err, req, res, next) => {
  console.error("Global Error:", err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
      error: err.detail,
      stack: err.stack,
    });
  }

  // production
  res.status(err.statusCode).json({
    status: err.status,
    message: err.isOperational ? err.message : "Something went wrong",
  });
};
