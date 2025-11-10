const Router = require("express").Router();

const {
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  verifyCampaigns,
  unverifyCampaigns,
  getVerifiedCampaigns,
  getUnverifiedCampaigns,
  getAllCampaigns,
  getCampaignById,
  deleteCampaign,
} = require("../controllers/adminController");



/**
 * @swagger
 * /admins/campaigns/verify/{campaignId}:
 *   patch:
 *     summary: Verify a campaign
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         description: The ID of the campaign to verify
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign verified successfully
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
Router.patch("/campaigns/verify/:campaignId", verifyCampaigns);

/**
 * @swagger
 * /admins/campaigns/unverify/{campaignId}:
 *   patch:
 *     summary: Unverify a campaign
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         description: The ID of the campaign to unverify
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign unverified successfully
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
Router.patch("/campaigns/unverify/:campaignId", unverifyCampaigns);

/**
 * @swagger
 * /admins/campaigns/{campaignId}:
 *   delete:
 *     summary: Delete a campaign
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         description: The ID of the campaign to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign deleted successfully
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
Router.delete("/campaigns/:campaignId", deleteCampaign);

/**
 *  @swagger
 * /admins/campaigns/{campaignId}:
 *   get:
 *     summary: Get a campaign by ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         description: The ID of the campaign to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign retrieved successfully
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
Router.get("/campaigns/:campaignId", getCampaignById);

/**
 * @swagger
 * /admins/campaigns:
 *   get:
 *     summary: Get all campaigns
 *     tags: [Admins]
 *     responses:
 *       200:
 *         description: Campaigns retrieved successfully
 *       500:
 *         description: Server error
 */
Router.get("/campaigns", getAllCampaigns);

/**
 * @swagger
 * /admins/campaigns/verified:
 *   get:
 *     summary: Get all verified campaigns
 *     tags: [Admins]
 *     responses:
 *       200:
 *         description: Verified campaigns retrieved successfully
 *       500:
 *         description: Server error
 */
Router.get("/campaigns/verified", getVerifiedCampaigns);

/**
 * @swagger
 * /admins/campaigns/unverified:
 *   get:
 *     summary: Get all unverified campaigns
 *     tags: [Admins]
 *     responses:
 *       200:
 *         description: Unverified campaigns retrieved successfully
 *       500:
 *         description: Server error
 */
Router.get("/campaigns/unverified", getUnverifiedCampaigns);

/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admins]
 *     responses:
 *       200:
 *         description: Admins retrieved successfully
 *       500:
 *         description: Server error
 */
Router.get("/admins", getAdmins);

/**
 *  @swagger
 * /admins/{id}:
 *   get:
 *     summary: Get an admin by ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the admin to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin retrieved successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */
Router.get("/admins/:id", getAdminById);

/**
 * @swagger
 * /admins/{id}:
 *   put:
 *     summary: Update an admin by ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the admin to update
 *         schema:
 *           type: string
 *       - in: body
 *         name: admin
 *         required: true
 *         description: The updated admin object
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */
Router.put("/admins/:id", updateAdmin);

/**
 * @swagger
 * /admins/{id}:
 *   delete:
 *     summary: Delete an admin by ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the admin to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */
Router.delete("/admins/:id", deleteAdmin);

module.exports = Router;
