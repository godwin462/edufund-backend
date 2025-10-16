const authRouter = require("express").Router();
// const passport = require("passport");
const passport = require("../middleware/passportMiddleware");
// const profile = require("./middleware/passportMiddleware");

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
