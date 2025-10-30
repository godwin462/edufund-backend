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
const upload = require("../middleware/multerMiddleware");
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
  *                 type: string *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       "201":
 *         description: OTP sent successfully
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
 *       "500":
 *         description: Internal server error
 */
authRouter.post("/me", isAuthenticated, getCurrentAuthUser);

module.exports = authRouter;
