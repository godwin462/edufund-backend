/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */
const authRouter = require("express").Router();
const {
  register,
  login,
  resendOtp,
  verifyOtp,
  changePassword,
  getCurrentAuthUser,
  resetPassword,
  forgotPassword,
  verifyResetPasswordOtp,
} = require("../controllers/authController");
const passport = require("../middleware/passportMiddleware");
const {
  logInRoleValidationMiddleware,
} = require("../middleware/loginRoleValidationMiddleware");
const { assignRole } = require("../middleware/roleMiddleware");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {verifyOtpMiddleware} = require("../middleware/verifyOtpMiddleware");

/**
 * @swagger
 * /auth/register/student:
 *   post:
 *     summary: Register a new student
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       "201":
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully, check your email to verify your account
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     email:
 *                       type: string
 *                       example: student@example.com
 *                     firstName:
 *                       type: string
 *                       example: Jane
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                     role:
 *                       type: string
 *                       example: student
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "400":
 *         description: Bad request
 *       "500":
 *         description: Internal server error
 */
authRouter.post(
  "/register/student",
  assignRole,
  register
);

/**
 * @swagger
 * /auth/register/sponsor/organization:
 *   post:
 *     summary: Register a new organization sponsor
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organizationName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       "201":
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully, check your email to verify your account
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     email:
 *                       type: string
 *                       example: org@example.com
 *                     firstName:
 *                       type: string
 *                       example: Org
 *                     lastName:
 *                       type: string
 *                       example: Sponsor
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                     role:
 *                       type: string
 *                       example: sponsor
 *                     sponsorType:
 *                       type: string
 *                       example: organization
 *                     organizationName:
 *                       type: string
 *                       example: Example Corp
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "400":
 *         description: Bad request
 *       "500":
 *         description: Internal server error
 */
authRouter.post(
  "/register/sponsor/organization",
  assignRole,
  register
);

/**
 * @swagger
 * /auth/register/sponsor/individual:
 *   post:
 *     summary: Register a new individual sponsor
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       "201":
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully, check your email to verify your account
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     email:
 *                       type: string
 *                       example: individual@example.com
 *                     firstName:
 *                       type: string
 *                       example: Individual
 *                     lastName:
 *                       type: string
 *                       example: Sponsor
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                     role:
 *                       type: string
 *                       example: sponsor
 *                     sponsorType:
 *                       type: string
 *                       example: individual
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "400":
 *         description: Bad request
 *       "500":
 *         description: Internal server error
 */
authRouter.post(
  "/register/sponsor/individual",
  assignRole,
  register
);

authRouter.post(
  "/register/admin",
  assignRole,
  register
);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to a user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Success, user logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success, user logged in
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYx...
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     role:
 *                       type: string
 *                       example: student
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: User not found
 *       "500":
 *         description: Internal server error
 */
authRouter.post(
  "/login",
  login
);

authRouter.post("/login/admin", logInRoleValidationMiddleware, login);
// Account verification routes
/**
 * @swagger
 * /auth/resend-otp/:
 *   post:
 *     summary: Resend OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       "200":
 *         description: New OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New OTP sent, check your email
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                     role:
 *                       type: string
 *                       example: student
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: User not found
 *       "500":
 *         description: Internal server error
 */
authRouter.post("/resend-otp/", resendOtp);

/**
 * @swagger
 * /auth/verify/{email}/:
 *   post:
 *     summary: Verify OTP
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       "200":
 *         description: OTP verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP verification successful ✅
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYx...
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     role:
 *                       type: string
 *                       example: student
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: User not found
 *       "500":
 *         description: Internal server error
 */
authRouter.post("/verify/:email/", verifyOtpMiddleware, verifyOtp);

/**
 * @swagger
 * /auth/forgot-password/{email}:
 *   post:
 *     summary: Forgot password
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Success, check your email for reset password token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success, check your email for reset password token
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     role:
 *                       type: string
 *                       example: student
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "404":
 *         description: User not found
 *       "500":
 *         description: Internal server error
 */
authRouter.post("/forgot-password/:email", forgotPassword);

/**
 * @swagger
 * /auth/verify-reset-password/{email}:
 *   post:
 *     summary: Verify reset password OTP
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Success, email verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success, email verification successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     role:
 *                       type: string
 *                       example: student
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "404":
 *         description: User not found
 *       "500":
 *         description: Internal server error
 */
authRouter.post("/verify-reset-password/:email", verifyOtpMiddleware, verifyResetPasswordOtp);

/**
 * @swagger
 * /auth/reset-password/{email}:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     role:
 *                       type: string
 *                       example: student
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "400":
 *         description: New password cannot be same as old password
 *       "404":
 *         description: User not found
 *       "500":
 *         description: Internal server error
 */
authRouter.post("/reset-password/:email", resetPassword);

// Account Google login routes

authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.send({ message: "Authentication Success" });
  }
);

//  auth updates
/**
 * @swagger
 * /auth/change-password/{userId}:
 *   post:
 *     summary: Change password
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     role:
 *                       type: string
 *                       example: student
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "400":
 *         description: Bad request
 *       "403":
 *         description: User not verified
 *       "404":
 *         description: User not found
 *       "500":
 *         description: Internal server error
 */
authRouter.post("/change-password/:userId", isAuthenticated, changePassword);

// Current auth user
/**
 * @swagger
 * /auth/me:
 *   post:
 *     summary: Get current authenticated user
 *     tags: [Authentication]
 *     responses:
 *       "200":
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     role:
 *                       type: string
 *                       example: student
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "500":
 *         description: Internal server error
 */
authRouter.post("/me", isAuthenticated, getCurrentAuthUser);

module.exports = authRouter;
