const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { dbConnection } = require("./config/database.js");
const categoryRoute = require("./routes/categoryRoute.js");
const usersRoute = require("./routes/usersRoute.js");
const authRoute = require("./routes/authRoute.js");
const { globalError } = require("./Middlewares/globalErrorHandler.js");
const ApiError = require("./utils/apiErrorHandler.js");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "config.env" });

// Database Connection
dbConnection();

// Middleware
const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/", usersRoute);
app.all(/(.*)/, (req, res, next) => {
  next(new ApiError(`Can't find this route : ${req.originalUrl}`, 404));
});

// Global Error Handler
app.use(globalError);

//unhandled rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.name} | ${err.message}`);
  console.log("Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
