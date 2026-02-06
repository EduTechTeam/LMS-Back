const userModel = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiErrorHandler.js");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken.js");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");

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
  const token = generateToken(
    user.id,
    user.role,
    user.username,
    user.full_name,
  );
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

exports.me = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ApiError("ur not logged in", 401));
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userModel.getUserById(decodedToken.id);
  if (!user) {
    return next(new ApiError("user not found", 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
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
  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${resetToken}`;

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

exports.serveResetPasswordPage = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  // Basic HTML template
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password - Edutech</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f3f4f6;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }
        h2 {
          text-align: center;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4b5563;
          font-size: 0.875rem;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          box-sizing: border-box; /* details */
          font-size: 1rem;
        }
        input:focus {
          outline: none;
          border-color: #3b82f6;
          ring: 2px solid #3b82f6;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        button:hover {
          background-color: #2563eb;
        }
        .message {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.875rem;
          display: none;
        }
        .error {
          color: #ef4444;
        }
        .success {
          color: #10b981;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Reset Password</h2>
        <form id="resetForm">
          <div class="form-group">
            <label for="password">New Password</label>
            <input type="password" id="password" name="password" required placeholder="Enter new password">
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm new password">
          </div>
          <button type="submit" id="submitBtn">Reset Password</button>
        </form>
        <div id="message" class="message"></div>
      </div>

      <script>
        const form = document.getElementById('resetForm');
        const messageDiv = document.getElementById('message');
        const submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          messageDiv.style.display = 'none';
          
          const password = document.getElementById('password').value;
          const confirmPassword = document.getElementById('confirmPassword').value;

          if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
          }

          submitBtn.disabled = true;
          submitBtn.innerText = 'Resetting...';

          try {
            const response = await fetch('/api/v1/auth/reset-password/${token}', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ password, confirmPassword: password })
            });

            const data = await response.json();

            if (response.ok) {
              showMessage('Password reset successfully! Redirecting...', 'success');
              form.reset();
              setTimeout(() => {
                // Redirect logic here if needed, or just specific message
                 window.location.href = '/login'; // Assuming there is a login page, strictly implementation choice
              }, 2000);
            } else {
              showMessage(data.message || 'Something went wrong', 'error');
              submitBtn.disabled = false;
              submitBtn.innerText = 'Reset Password';
            }
          } catch (error) {
            console.error('Error:', error);
            showMessage('Network error, please try again', 'error');
            submitBtn.disabled = false;
            submitBtn.innerText = 'Reset Password';
          }
        });

        function showMessage(msg, type) {
          messageDiv.textContent = msg;
          messageDiv.className = 'message ' + type;
          messageDiv.style.display = 'block';
        }
      </script>
    </body>
    </html>
  `;

  res.send(html);
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
