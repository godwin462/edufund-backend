const campaignRouter = require("express").Router();

const {
  createCampaign,
  deleteCampaign,
  getStudentCampaigns,
  getAllCampaigns,
  getCampaign,
  updateCampaign,
} = require("../controllers/campaignController");

const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const { studentAccess } = require("../middleware/roleMiddleware");

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Campaigns found successfully
 *                 total:
 *                   type: number
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d5ec49a0d2db2a3c_dummy_id
 *                       studentId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 60d5ec49a0d2db2a3c_dummy_id
 *                           firstName:
 *                             type: string
 *                             example: John
 *                           lastName:
 *                             type: string
 *                             example: Doe
 *                       title:
 *                         type: string
 *                         example: Help me fund my education
 *                       target:
 *                         type: number
 *                         example: 5000
 *                       story:
 *                         type: string
 *                         example: I am a student in need of financial assistance...
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       campaignImage:
 *                         type: object
 *                         properties:
 *                           imageUrl:
 *                             type: string
 *                             example: http://example.com/image.jpg
 *                           publicId:
 *                             type: string
 *                             example: image_public_id
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *       "500":
 *         description: Internal server error
 */
campaignRouter.get(
  "/",
  isAuthenticated,
  getAllCampaigns
);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Campaigns found successfully
 *                 total:
 *                   type: number
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d5ec49a0d2db2a3c_dummy_id
 *                       studentId:
 *                         type: string
 *                         example: 60d5ec49a0d2db2a3c_dummy_id
 *                       title:
 *                         type: string
 *                         example: Help me fund my education
 *                       target:
 *                         type: number
 *                         example: 5000
 *                       story:
 *                         type: string
 *                         example: I am a student in need of financial assistance...
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       campaignImage:
 *                         type: object
 *                         properties:
 *                           imageUrl:
 *                             type: string
 *                             example: http://example.com/image.jpg
 *                           publicId:
 *                             type: string
 *                             example: image_public_id
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *       "500":
 *         description: Internal server error
 */
campaignRouter.get(
  "/:studentId",
  isAuthenticated,
  studentAccess,
  getStudentCampaigns
);

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
 *               schoolName:
 *                 type: string
 *                 example: The Curve Africa
 *               year:
 *                 type: number
 *                 example: 2027
 *               course:
 *                 type: string
 *                 example: Backend
 *               matricNumber:
 *                 type: number
 *                 example: 12345678
 *               jambRegistrationNumber:
 *                 type: number
 *                 example: 87654321
 *               duration:
 *                 type: number
 *                 example: 6
 *               title:
 *                 type: string
 *                 example: Help me fund my education
 *               target:
 *                 type: number
 *                 example: 5000
 *               story:
 *                 type: string
 *                 example: I am a student in need of financial assistance...
 *               campaignImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "201":
 *         description: Campaign created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Campaign created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     schoolName:
 *                       type: string
 *                       example: The Curve Africa
 *                     year:
 *                       type: number
 *                       example: 2027
 *                     course:
 *                       type: string
 *                       example: Backend
 *                     matricNumber:
 *                       type: number
 *                       example: 92743947534
 *                     jambRegistrationNumber:
 *                       type: number
 *                       example: 8765432187384
 *                     duration:
 *                       type: number
 *                       example: 12
 *                     studentId:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     title:
 *                       type: string
 *                       example: Help me fund my education
 *                     target:
 *                       type: number
 *                       example: 5000
 *                     story:
 *                       type: string
 *                       example: I am a student in need of financial assistance...
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     campaignImage:
 *                       type: object
 *                       properties:
 *                         imageUrl:
 *                           type: string
 *                           example: http://example.com/image.jpg
 *                         publicId:
 *                           type: string
 *                           example: image_public_id
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "400":
 *         description: Bad request or active campaign already exists
 *       "404":
 *         description: Student not found
 *       "500":
 *         description: Internal server error
 */
campaignRouter.post(
  "/:studentId",
  upload.single("campaignImage"),
  isAuthenticated,
  studentAccess,
  createCampaign
);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Campaign found successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     studentId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 60d5ec49a0d2db2a3c_dummy_id
 *                         firstName:
 *                           type: string
 *                           example: John
 *                         lastName:
 *                           type: string
 *                           example: Doe
 *                     title:
 *                       type: string
 *                       example: Help me fund my education
 *                     target:
 *                       type: number
 *                       example: 5000
 *                     story:
 *                       type: string
 *                       example: I am a student in need of financial assistance...
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     campaignImage:
 *                       type: object
 *                       properties:
 *                         imageUrl:
 *                           type: string
 *                           example: http://example.com/image.jpg
 *                         publicId:
 *                           type: string
 *                           example: image_public_id
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "404":
 *         description: Campaign not found
 *       "500":
 *         description: Internal server error
 */
campaignRouter.get(
  "/campaign-detail/:campaignId",
  isAuthenticated,
  getCampaign
);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Campaign updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     studentId:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     title:
 *                       type: string
 *                       example: Help me fund my education - Updated
 *                     target:
 *                       type: number
 *                       example: 6000
 *                     story:
 *                       type: string
 *                       example: I am a student in need of financial assistance... (updated)
 *                     isActive:
 *                       type: boolean
 *                       example: false
 *                     campaignImage:
 *                       type: object
 *                       properties:
 *                         imageUrl:
 *                           type: string
 *                           example: http://example.com/new_image.jpg
 *                         publicId:
 *                           type: string
 *                           example: new_image_public_id
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-02T12:00:00.000Z
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Campaign not found
 *       "500":
 *         description: Internal server error
 */
campaignRouter.put(
  "/:campaignId",
  upload.single("campaignImage"),
  isAuthenticated,
  studentAccess,
  updateCampaign
);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Campaign deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     studentId:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     title:
 *                       type: string
 *                       example: Help me fund my education - Updated
 *                     target:
 *                       type: number
 *                       example: 6000
 *                     story:
 *                       type: string
 *                       example: I am a student in need of financial assistance... (updated)
 *                     isActive:
 *                       type: boolean
 *                       example: false
 *                     campaignImage:
 *                       type: object
 *                       properties:
 *                         imageUrl:
 *                           type: string
 *                           example: http://example.com/new_image.jpg
 *                         publicId:
 *                           type: string
 *                           example: new_image_public_id
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-02T12:00:00.000Z
 *       "404":
 *         description: Campaign not found
 *       "500":
 *         description: Internal server error
 */
campaignRouter.delete(
  "/:campaignId",
  isAuthenticated,
  studentAccess,
  deleteCampaign
);

module.exports = campaignRouter;
