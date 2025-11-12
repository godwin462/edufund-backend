const donorDashboardRouter = require("express").Router();
const { overview } = require("../controllers/donorDashboardController");
/**
 * @swagger
 * tags:
 *   name: donor Dashboard
 *   description: donor dashboard endpoints
 */

/**
 * @swagger
 * /donor-dashboard/overview/{donorId}:
 *   get:
 *     summary: Get donor dashboard overview
 *     tags: [donor Dashboard]
 *     parameters:
 *       - in: path
 *         name: donorId
 *         schema:
 *           type: string
 *         required: true
 *         description: The donor ID
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
 *                     donor:
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
 *                           example: "donor"
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
 *                                 example: "donor"
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
 *                               isFullyVerifiedDonor:
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
 *         description: donor not found
 *       500:
 *         description: Internal server error
 */
donorDashboardRouter.get("/overview/:donorId", overview);

module.exports = donorDashboardRouter;
