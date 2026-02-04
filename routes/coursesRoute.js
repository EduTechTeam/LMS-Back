const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../services/courseService.js");

const {
  getAllCoursesValidator,
  getCourseByIdValidator,
  createCourseValidator,
  updateCourseValidator,
  deleteCourseValidator,
} = require("../Validations/courses/coursesValidation.js");

router.get("/", getAllCoursesValidator, getAllCourses);
router.get("/:id", getCourseByIdValidator, getCourseById);
router.post("/", createCourseValidator, createCourse);
router.patch("/:id", updateCourseValidator, updateCourse);
router.delete("/:id", deleteCourseValidator, deleteCourse);

module.exports = router;
