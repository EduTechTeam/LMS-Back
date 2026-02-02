const userModel = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiErrorHandler.js");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken.js");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.getUserByEmail(email);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  if (user.is_verified == false) {
    return next(
      new ApiError("please visit ur email address to verify ur email", 404),
    );
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordMatched) {
    return next(new ApiError("Invalid credentials", 401));
  }
  const token = generateToken(user.id, user.role, user.username);
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  res.status(200).json({
    success: true,
    data: { token },
  });
});

exports.signup = asyncHandler(async (req, res, next) => {
  const {
    username,
    email,
    password,
    headline,
    biography,
    avatar_url,
    website_url,
    full_name,
  } = req.body;
  const user = await userModel.getUserByEmail(email);
  if (user) {
    return next(new ApiError("User already exists", 400));
  }

  // generate user verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const newUser = await userModel.createUser(
    username,
    email,
    password,
    "student",
    headline,
    biography,
    avatar_url,
    website_url,
    full_name,
    verificationToken,
  );

  const verifyUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/verify/${verificationToken}`;
  const message = `Welcome to Edutech! \n\nPlease verify your email by clicking the link below:\n\n${verifyUrl}\n\nIf you did not create this account, please ignore this email.`;

  try {
    await sendEmail({
      email: newUser.email,
      subject: "Edutech Email Verification",
      text: message,
    });
    res.status(201).json({
      success: true,
      message:
        "Signup successful! Please check your email to verify your account.",
    });
  } catch (err) {
    return next(
      new ApiError(
        "There was an error sending the email. Try again later!",
        500,
      ),
    );
  }
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const token = req.params.token;
  const user = await userModel.verifyUser(token);

  if (!user) {
    return next(new ApiError("Token is invalid or has expired", 400));
  }
  res.status(200).json({
    success: true,
    message: "Email verified successfully! You can now log in.",
  });
});

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  //Get user by email
  const { email } = req.body;
  const user = await userModel.getUserByEmail(email);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  // generate token for reset password
  const resetToken = crypto.randomBytes(32).toString("hex");

  // hashing the token

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //token expires in 10m
  const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  //save in database

  await userModel.savePasswordResetToken(
    user.email,
    passwordResetToken,
    passwordResetExpires,
  );

  //send the mail to user's email
  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password to:
   \n${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "reset ur password",
      text: message,
    });
    res.status(200).json({
      success: true,
      message: "Token sent to email!",
    });
  } catch (err) {
    // If email sending fails, verify we reset fields (optional but good practice)
    // await userModel.savePasswordResetToken(user.email, null, null);
    return next(
      new ApiError(
        "There was an error sending the email. Try again later!",
        500,
      ),
    );
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await userModel.getUserByResetToken(hashedToken);
  if (!user) {
    return next(new ApiError("Token is invalid or has expired", 400));
  }
  const newPasswordHash = await bcrypt.hash(password, 10);
  await userModel.resetPassword(user.id, newPasswordHash);

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

exports.signupOrganization = asyncHandler(async (req, res, next) => {
  const {
    username,
    email,
    password,
    headline,
    biography,
    avatar_url,
    website_url,
    full_name,
  } = req.body;

  // 1) Check if email domain is allowed
  const allowedDomains = process.env.ORGANIZATION_DOMAINS.split(",");
  const userDomain = email.split("@")[1];

  if (!allowedDomains.includes(userDomain)) {
    return next(
      new ApiError("Email domain not authorized for organization account", 403),
    );
  }

  // 2) Check if user exists
  const user = await userModel.getUserByEmail(email);
  if (user) {
    return next(new ApiError("User already exists", 400));
  }

  // 3) Generate verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // 4) Create User with 'organization' role
  const newUser = await userModel.createUser(
    username,
    email,
    password,
    "organization",
    headline,
    biography,
    avatar_url,
    website_url,
    full_name,
    verificationToken,
  );

  // 5) Send Verification Email 
  const verifyUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/verify/${verificationToken}`;
  const message = `Welcome to Edutech Organization! \n\nPlease verify your email: \n${verifyUrl}`;

  try {
    await sendEmail({
      email: newUser.email,
      subject: "Edutech Organization Verification",
      text: message,
    });

    res.status(201).json({
      success: true,
      message: "Organization signup successful! Please verify your email.",
    });
  } catch (err) {
    return next(new ApiError("Error sending email", 500));
  }
});
