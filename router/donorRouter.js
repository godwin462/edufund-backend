const donorRouter = require("express").Router();

const {
  totalStudentsHelped,
  getDonorsForStudent,
  myDonations,
} = require("../controllers/donorController");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

/**
 * @swagger
 * tags:
 *   name: Donors
 *   description: Donor-related analytics and data
 */

/**
 * @swagger
 * /donors/students-helped/{donorId}:
 *   get:
 *     summary: Get the total number of students helped by a specific donor
 *     tags: [Donors]
 *     parameters:
 *       - in: path
 *         name: donorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Successfully retrieved the count of students helped.
 *       "500":
 *         description: Server error.
 */
donorRouter.get(
  "/students-helped/:donorId",
  isAuthenticated,
  totalStudentsHelped
);

/**
 * @swagger
 * /donors/allDonors/{studentId}:
 *   get:
 *     summary: Get all donors for a specific student
 *     tags: [Donors]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Successfully retrieved the list of donors.
 *       "404":
 *         description: No donors found for this student.
 *       "500":
 *         description: Server error.
 */
donorRouter.get("/allDonors/:studentId", isAuthenticated, getDonorsForStudent);

/**
 * @swagger
 * /donors/myDonations:
 *   get:
 *     summary: Get all donations made on the platform
 *     tags: [Donors]
 *     responses:
 *       "200":
 *         description: Successfully retrieved all donations.
 *       "404":
 *         description: No donations have been made yet.
 *       "500":
 *         description: Server error.
 */
donorRouter.get("/myDonations", myDonations);

module.exports = donorRouter;