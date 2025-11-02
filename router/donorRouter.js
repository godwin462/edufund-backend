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
 * /donors/analytics/students-helped/{donorId}:
 *   get:
 *     summary: Get the count of students helped, total donations, and active campaigns for a specific donor
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
 *         content:
 *           application/json:

 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalDonated:
 *                       type: number
 *                       example: 1000
 *                     totalStudentsHelped:
 *                       type: number
 *                       example: 10
 *                     activeCampaigns:
 *                       type: number
 *                       example: 5
 *       "500":
 *         description: Server error.
 */
donorRouter.get(
  "/analytics/students-helped/:donorId",
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 2 generous supporters
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: 60d5ec49a0d2db2a3c_dummy_id
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: My Donations
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d5ec49a0d2db2a3c_dummy_id
 *                       campaignId:
 *                         type: string
 *                         example: 60d5ec49a0d2db2a3c_dummy_id
 *                       senderId:
 *                         type: string
 *                         example: 60d5ec49a0d2db2a3c_dummy_id
 *                       receiverId:
 *                         type: string
 *                         example: 60d5ec49a0d2db2a3c_dummy_id
 *                       amount:
 *                         type: number
 *                         example: 100
 *                       reference:
 *                         type: string
 *                         example: 1a2b3c4d5e6f7g8h
 *                       status:
 *                         type: string
 *                         example: successful
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *       "404":
 *         description: No donations have been made yet.
 *       "500":
 *         description: Server error.
 */
donorRouter.get("/myDonations", myDonations);

module.exports = donorRouter;
