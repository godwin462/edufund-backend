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
const donorRouter = require("./router/donorRouter");
const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("./swagger-output.json");
const contactUsRouter = require("./router/contactUsRouter");
const campaignRouter = require("./router/campaignRouter");
const academicRouter = require("./router/academicRouter");
const donationRouter = require("./router/donationRouter");
const swaggerJSDoc = require("swagger-jsdoc");

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

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Api documentation for Edufund backend application",
    version: "1.0.0",
    description:
      "This is a REST API application for Edufund.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "JSONPlaceholder",
      url: "https://apple.com",
    },
  },
  servers: [
    {
      url: `https://edufund-backend-os2x.onrender.com/api/v1`,
      description: "Live server",
    },
    {
      url: `http://localhost:${PORT}/api/v1`,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./router/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
// app.use(`${apiVersion}/docs`, swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/Analytics", donorRouter);
app.use("/api/v1/donors", donorRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/contact-us", contactUsRouter);
app.use("/api/v1/campaigns", campaignRouter);
app.use("/api/v1/academic", academicRouter);
app.use("/api/v1/donation", donationRouter);

app.get("/", (req, res) => {

  res.send("Connected to Backend Server");
});

app.use((error, req, res, next) => {
  if(error) {
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
