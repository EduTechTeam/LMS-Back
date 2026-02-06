const express = require("express");
const {
  signup,
  login,
  logout,
  verifyEmail,
  forgetPassword,
  resetPassword,
  signupOrganization,
  serveResetPasswordPage,
  me,
} = require("../services/authController");
const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);
router.get("/verify/:token", verifyEmail);
router.post("/forgot-password", forgetPassword);

router.get("/reset-password/:token", serveResetPasswordPage);
router.patch("/reset-password/:token", resetPassword);
router.post("/register-org", signupOrganization);

// router.post("/refresh-token", refreshToken);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);

module.exports = router;
