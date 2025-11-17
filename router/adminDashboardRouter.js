const adminDashboardRouter = require("express").Router();
const { adminOverview, verifyStudent, approveCampaign } = require("../controllers/adminDashboardController");
const {isAuthenticated} = require("../middleware/authenticationMiddleware");
const {adminAccess} = require("../middleware/roleMiddleware");
/**
 * @swagger
 * tags:
 *   name: admin Dashboard
 *   description: admin dashboard endpoints
*/



/**
 * @swagger
 * /admin-dashboard/verify-student/{studentId}:
 *   get:
 *     summary: Verify a student
 *     tags: [admin Dashboard]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The student ID
 *     responses:
 *       200:
 *         description: Student verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student verified successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */
adminDashboardRouter.get(
  "/verify-student/:studentId",
  verifyStudent
);

/**
 * @swagger
 * /admin-dashboard/approve-campaign/{campaignId}:
 *   get:
 *     summary: Approve a campaign
 *     tags: [admin Dashboard]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         schema:
 *           type: string
 *         required: true
 *         description: The campaign ID
 *     responses:
 *       200:
 *         description: Campaign approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Campaign approved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Internal server error
 */
adminDashboardRouter.get(
  "/approve-campaign/:campaignId",
  approveCampaign
);

module.exports = adminDashboardRouter;
