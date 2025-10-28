require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 1234;
const DB = process.env.MONGODB_URI;
const userRouter = require("./router/userRouter");
const paymentRouter = require("./router/paymentRouter");
const session = require("express-session");
const passport = require("passport");
const authRouter = require("./router/authRouter");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const contactUsRouter = require("./router/contactUsRouter");
const donorRouter = require("./router/donorRouter");

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/contact-us", contactUsRouter);
app.use("/api/v1/analytics", donorRouter);

app.use("/", (req, res) => {
  res.send("Connected to Backend Server");
});

app.use((error, req, res, next) => {
  if (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
  next();
});

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log(`EduFund server is running on http://localhost:${PORT}
        Documentation: http://localhost:${PORT}/api/v1/api-docs`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to Database", error.message);
  });
