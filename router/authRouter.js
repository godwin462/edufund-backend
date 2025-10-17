// const passport = require("passport");
const passport = require("../middleware/passportMiddleware");
// const profile = require("./middleware/passportMiddleware");
const authRouter = require("express").Router();
const { register, login, resendOtp } = require("../controllers/authController");
const { verifyOtp } = require("../middlewares/verifyOtpMiddleware");
const { assignRole, studentAccess } = require("../middlewares/roleMiddleware");
const {
  logInRoleValidationMiddleware,
} = require("../middlewares/loginRoleValidationMiddleware");

authRouter.post("/register/student", assignRole, register);
authRouter.post("/register/sponsor", assignRole, register);
authRouter.post("/register/admin", assignRole, register);

authRouter.post("/login/student", logInRoleValidationMiddleware, login);
authRouter.post("/login/sponsor", logInRoleValidationMiddleware, login);
authRouter.post("/login/admin", logInRoleValidationMiddleware, login);

authRouter.post("/resend-otp/:userId", resendOtp);
authRouter.put("/verify-otp/:userId", verifyOtp, verifyOtp);

authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // console.log(req);
    res.send({ message: "Authentication Success" });
  }
);

module.exports = authRouter;
