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
 * /admin-dashboard/overview/{adminId}:
 *   get:
 *     summary: Get admin dashboard overview
 *     tags: [admin Dashboard]
 *     parameters:
 *       - in: path
 *         name: adminId
 *         schema:
 *           type: string
 *         required: true
 *         description: The admin ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     admin:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "6907053fbd60ad4e1200fb93"
 *                         email:
 *                           type: string
 *                           example: "example@gmail.com"
 *                         firstName:
 *                           type: string
 *                           example: "string"
 *                         lastName:
 *                           type: string
 *                           example: "string"
 *                         isVerified:
 *                           type: boolean
 *                           example: true
 *                         role:
 *                           type: string
 *                           example: "admin"
 *                         organizationName:
 *                           type: object
 *                           example: null
 *                         createdAt:
 *                           type: string
 *                           example: "2025-11-02T07:16:16.703Z"
 *                         updatedAt:
 *                           type: string
 *                           example: "2025-11-02T13:08:54.490Z"
 *                         __v:
 *                           type: number
 *                           example: 0
 *                         academicDocuments:
 *                           type: array
 *                           items:
 *                             type: object
 *                     totalRaised:
 *                       type: number
 *                       example: 400
 *                     totalDonors:
 *                       type: number
 *                       example: 1
 *                     activeCampaign:
 *                       type: object
 *                       example: null
 *                     goalProgress:
 *                       type: object
 *                       example: null
 *                     daysRemaining:
 *                       type: object
 *                       example: null
 *                     recentDonors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "69075a401704c2b025d49f06"
 *                           campaignId:
 *                             type: string
 *                             example: "690758991fad79238269f27f"
 *                           senderId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "6907053fbd60ad4e1200fb93"
 *                               email:
 *                                 type: string
 *                                 example: "example@gmail.com"
 *                               firstName:
 *                                 type: string
 *                                 example: "string"
 *                               lastName:
 *                                 type: string
 *                                 example: "string"
 *                               isVerified:
 *                                 type: boolean
 *                                 example: true
 *                               role:
 *                                 type: string
 *                                 example: "admin"
 *                               organizationName:
 *                                 type: object
 *                                 example: null
 *                               createdAt:
 *                                 type: string
 *                                 example: "2025-11-02T07:16:16.703Z"
 *                               updatedAt:
 *                                 type: string
 *                                 example: "2025-11-02T13:08:54.490Z"
 *                               __v:
 *                                 type: number
 *                                 example: 0
 *                               fullName:
 *                                 type: string
 *                                 example: "string string"
 *                               isFullyVerifiedadmin:
 *                                 type: boolean
 *                                 example: false
 *                               id:
 *                                 type: string
 *                                 example: "6907053fbd60ad4e1200fb93"
 *                           receiverId:
 *                             type: string
 *                             example: "6907053fbd60ad4e1200fb93"
 *                           amount:
 *                             type: number
 *                             example: 200
 *                           reference:
 *                             type: string
 *                             example: "c8d1885c-3e4c-40ef-b5ea-dd11b7b48abb"
 *                           status:
 *                             type: string
 *                             example: "successful"
 *                           __v:
 *                             type: number
 *                             example: 0
 *                     recentActivities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "690a431f15478f4e5b4c4c32"
 *                           userId:
 *                             type: string
 *                             example: "6907053fbd60ad4e1200fb93"
 *                           message:
 *                             type: string
 *                             example: "New account login"
 *                           type:
 *                             type: string
 *                             example: "info"
 *                           relatedEntity:
 *                             type: string
 *                             example: "6907053fbd60ad4e1200fb93"
 *                           isRead:
 *                             type: boolean
 *                             example: false
 *                           isNew:
 *                             type: boolean
 *                             example: true
 *                           createdAt:
 *                             type: string
 *                             example: "2025-11-04T18:17:03.343Z"
 *                           updatedAt:
 *                             type: string
 *                             example: "2025-11-04T18:17:03.343Z"
 *                           __v:
 *                             type: number
 *                             example: 0
 *       404:
 *         description: admin not found
 *       500:
 *         description: Internal server error
 */
adminDashboardRouter.get(
  "/overview/:adminId",
  isAuthenticated,
  adminAccess,
  adminOverview
);

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
