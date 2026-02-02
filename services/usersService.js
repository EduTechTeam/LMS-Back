const userModel = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiErrorHandler.js");

//GET ALL USERS
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const users = await userModel.getAllUsers(skip, limit);
  if (!users) {
    next(new ApiError("Users not found", 404));
  }
  res.status(200).json({
    success: true,
    page: page,
    limit: limit,
    data: users,
  });
});

//GET SINGLE USER
exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.getUserById(id);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

//CREATE USER
exports.createUser = asyncHandler(async (req, res, next) => {
  const {
    username,
    email,
    password,
    role,
    headline,
    biography,
    avatar_url,
    website_url,
    full_name,
  } = req.body;
  const newUser = await userModel.createUser(
    username,
    email,
    password,
    role,
    headline,
    biography,
    avatar_url,
    website_url,
    full_name,
  );
  if (!newUser) {
    return next(new ApiError("User not created", 404));
  }
  res.status(201).json({
    success: true,
    data: newUser,
  });
});

//update user
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    username,
    email,
    password,
    role,
    headline,
    biography,
    avatar_url,
    website_url,
    full_name,
  } = req.body;
  const updatedUser = await userModel.updateUser(
    id,
    username,
    email,
    password,
    role,
    headline,
    biography,
    avatar_url,
    website_url,
    full_name,
  );
  if (!updatedUser) {
    return next(new ApiError("User not updated", 404));
  }
  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

//delete user
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deletedUser = await userModel.deleteUser(id);
  if (!deletedUser) {
    return next(new ApiError("User not deleted", 404));
  }
  res.status(200).json({
    success: true,
    data: deletedUser,
  });
});
