const {
  getReceivedDonations, getOneReceivedDonation, getCampaignDonations, getCampaignDonationBalance, getStudentWalletBalance,
  getAllDonations, } = require("../controllers/donationController");
const {isAuthenticated} = require("../middleware/authenticationMiddleware");

const receivedDonationRouter = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Donations
 *   description: Donation management endpoints
 */

/**
 * @swagger
 * /donations:
 *   get:
 *     summary: Get all donations
 *     tags: [Donations]
 *     responses:
 *       "200":
 *         description: A list of all donations
 *       "500":
 *         description: Server error
 */
receivedDonationRouter.get("/", getAllDonations);

/**
 * @swagger
 * /donations/received-donations/{studentId}:
 *   get:
 *     summary: Get all donations received by a student
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter donations by status (e.g., successful, pending)
 *     responses:
 *       "200":
 *         description: A list of received donations
 *       "500":
 *         description: Server error
 */
receivedDonationRouter.get("/received-donations/:studentId", isAuthenticated, getReceivedDonations);

/**
 * @swagger
 * /donations/received-donations/donation-detail/{reference}:
 *   get:
 *     summary: Get a single received donation by reference
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Donation found successfully
 *       "404":
 *         description: Donation not found
 *       "500":
 *         description: Server error
 */
receivedDonationRouter.get("/received-donations/donation-detail/:reference", isAuthenticated, getOneReceivedDonation);

/**
 * @swagger
 * /donations/received-donations/student-balance/{studentId}:
 *   get:
 *     summary: Get a student's total wallet balance from donations
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Student wallet balance retrieved successfully
 *       "500":
 *         description: Server error
 */
receivedDonationRouter.get("/received-donations/student-balance/:studentId", isAuthenticated, getStudentWalletBalance);

/**
 * @swagger
 * /donations/received-donations/campaign-balance/{campaignId}:
 *   get:
 *     summary: Get a campaign's total donation balance
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Campaign donation balance retrieved successfully
 *       "500":
 *         description: Server error
 */
receivedDonationRouter.get("/received-donations/campaign-balance/:campaignId", isAuthenticated, getCampaignDonationBalance);

/**
 * @swagger
 * /donations/received-donations/campaign-donations/{campaignId}:
 *   get:
 *     summary: Get all donations for a specific campaign
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: A list of campaign donations
 *       "500":
 *         description: Server error
 */
receivedDonationRouter.get("/received-donations/campaign-donations/:campaignId", isAuthenticated, getCampaignDonations);

module.exports = receivedDonationRouter;