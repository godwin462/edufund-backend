// const passport = require("passport");
const passport = require("../middleware/passportMiddleware");
// const profile = require("./middleware/passportMiddleware");
const authRouter = require("express").Router();
const { register, login, verifyAuth } = require("../controllers/authController");
const { verifyOtp } = require("../middlewares/verifyOtpMiddleware");

authRouter.post("/signup", register);
authRouter.post("/signin", login);
authRouter.put("/verify-otp/:userId", verifyOtp, verifyAuth);

module.exports = authRouter;

authRouter.use(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
authRouter.use(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // console.log(req);
    res.send({ message: "Authentication Success" });
  }
);

module.exports = authRouter;
