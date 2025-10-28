const donorRouter = require("express").Router();

const { totalStudentsHelped } = require("../controllers/donorController");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

donorRouter.get(
  "/students-helped/:donorId",
  isAuthenticated,
  totalStudentsHelped
);
module.exports = donorRouter;
