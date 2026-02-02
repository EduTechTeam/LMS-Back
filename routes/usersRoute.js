const express = require("express");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../services/usersService");
const {
  createUserValidator,
  updateUserValidator,
  getUserValidator,
  deleteUserValidator,
} = require("../Validations/users/usersValidations");
const router = express.Router();

router.get("/users", getAllUsers);
router.post("/users", createUserValidator, createUser);
router.get("/users/:id", getUserValidator, getUser);
router.put("/users/:id", updateUserValidator, updateUser);
router.delete("/users/:id", deleteUserValidator, deleteUser);

module.exports = router;
