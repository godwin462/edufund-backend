const donorRouter = require("express").Router();

const {
  totalStudentsHelped,
  getDonorsForStudent,
  myDonations,
} = require("../controllers/donorController");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

donorRouter.get(
  "/students-helped/:donorId",
  isAuthenticated,
  totalStudentsHelped
);
donorRouter.get("/allDonors/:studentId", isAuthenticated, getDonorsForStudent);

donorRouter.get("/myDonations", myDonations);
module.exports = donorRouter;
