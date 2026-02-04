const courseModel = require("../models/courseModel.js");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiErrorHandler.js");

//Get all Courses

exports.getAllCourses = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query || { page: 1, limit: 10 };
  const skip = (page - 1) * limit || 0;
  const courses = await courseModel.getAllCourses(skip, limit, search);
  if (!courses) {
    throw new ApiError("No courses found", 404);
  }
  res.status(200).json({ courses });
});

//Get single Course

exports.getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await courseModel.getCourseById(id);
  if (!course) {
    throw new ApiError("No course found", 404);
  }
  res.status(200).json({ course });
});

//Create Course

exports.createCourse = asyncHandler(async (req, res) => {
  const {
    instructor_id,
    category_id,
    title,
    subtitle,
    description,
    price,
    level,
    thumbnail_url,
    language,
    is_published,
  } = req.body;
  const course = await courseModel.createCourse(
    instructor_id,
    category_id,
    title,
    subtitle,
    description,
    price,
    level,
    thumbnail_url,
    language,
    is_published,
  );
  if (!course) {
    throw new ApiError("Failed to create course", 400);
  }
  res.status(200).json({ course });
});

//Update Course

exports.updateCourse = asyncHandler(async (req, res) => {
  const {
    instructor_id,
    category_id,
    title,
    subtitle,
    description,
    price,
    level,
    thumbnail_url,
    language,
    is_published,
  } = req.body;
  const { id } = req.params;
  const course = await courseModel.updateCourse(
    id,
    instructor_id,
    category_id,
    title,
    subtitle,
    description,
    price,
    level,
    thumbnail_url,
    language,
    is_published,
  );
  if (!course) {
    throw new ApiError("Failed to update course", 400);
  }
  res.status(200).json({ course });
});

//Delete Course

exports.deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await courseModel.deleteCourse(id);
  if (!course) {
    throw new ApiError("Failed to delete course", 400);
  }
  res.status(200).json({ course });
});
