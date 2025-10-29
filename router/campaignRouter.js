const campaignRouter = require('express').Router();

const {createCampaign, deleteCampaign, getStudentCampaigns, getAllCampaigns, getCampaign, updateCampaign} = require('../controllers/campaignController');

const {isAuthenticated} = require("../middleware/authenticationMiddleware");

const {studentAccess} = require("../middleware/roleMiddleware");

const upload = require("../middleware/multerMiddleware");

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Campaign management endpoints
 */

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Get all campaigns
 *     tags: [Campaigns]
 *     responses:
 *       "200":
 *         description: A list of campaigns
 *       "500":
 *         description: Internal server error
 */
campaignRouter.get('/', isAuthenticated, getAllCampaigns);

/**
 * @swagger
 * /campaigns/{studentId}:
 *   get:
 *     summary: Get all campaigns for a specific student
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: A list of student's campaigns
 *       "500":
 *         description: Internal server error
 */
campaignRouter.get('/:studentId', isAuthenticated, studentAccess, getStudentCampaigns);

/**
 * @swagger
 * /campaigns/{studentId}:
 *   post:
 *     summary: Create a new campaign for a student
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               target:
 *                 type: number
 *               story:
 *                 type: string
 *               campaignImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "201":
 *         description: Campaign created successfully
 *       "400":
 *         description: Bad request or active campaign already exists
 *       "404":
 *         description: Student not found
 *       "500":
 *         description: Internal server error
 */
campaignRouter.post('/:studentId', upload.single('campaignImage'), isAuthenticated, studentAccess, createCampaign);

/**
 * @swagger
 * /campaigns/campaign-detail/{campaignId}:
 *   get:
 *     summary: Get a specific campaign by its ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Campaign found successfully
 *       "404":
 *         description: Campaign not found
 *       "500":
 *         description: Internal server error
 */
campaignRouter.get('/campaign-detail/:campaignId', isAuthenticated, getCampaign);

/**
 * @swagger
 * /campaigns/{campaignId}:
 *   put:
 *     summary: Update a campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               target:
 *                 type: number
 *               story:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               campaignImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "200":
 *         description: Campaign updated successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Campaign not found
 *       "500":
 *         description: Internal server error
 */
campaignRouter.put('/:campaignId', upload.single('campaignImage'), isAuthenticated, studentAccess, updateCampaign);

/**
 * @swagger
 * /campaigns/{campaignId}:
 *   delete:
 *     summary: Delete a campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Campaign deleted successfully
 *       "404":
 *         description: Campaign not found
 *       "500":
 *         description: Internal server error
 */
campaignRouter.delete('/:campaignId', isAuthenticated, studentAccess, deleteCampaign);

module.exports = campaignRouter;