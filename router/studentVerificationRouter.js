const studentVerificationRouter = require('express').Router();

const studentVerificationController = require("../controllers/studentVerificationController");

const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const { studentAccess } = require("../middleware/roleMiddleware");

const upload = require("../middleware/multerMiddleware");

/**
 * @swagger
 * /Verification/{studentId}:
 *   post:
 *     summary: Upload verified documents for a student
 *     tags: [Verifications]
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
 *         description: Documents uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Documents uploaded successfully
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

studentVerificationRouter.post('/:studentId', upload.single('verificationDocument'), isAuthenticated, studentAccess, studentVerificationController.submitVerification);

/**
 * @swagger
 * /verification/document-detail/{documentId}:
 *   get:
 *     summary: Get a specific document by its ID
 *     tags: [Verifictions]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Documents found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Documents found successfully
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

studentVerificationRouter.get('/:studentId', isAuthenticated, studentAccess, studentVerificationController.getVerificationStatus);

/**
 * @swagger
 * /verifications/{campaignId}:
 *   put:
 *     summary: Update a campaign
 *     tags: [Verifications]
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
 *         description: Documents updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Documents updated successfully
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

studentVerificationRouter.put('/:verificationId', upload.single('verificationDocument'), isAuthenticated, studentAccess, studentVerificationController.updateVerificationDocument);

/**
 * @swagger
 * /verification/{campaignId}:
 *   delete:
 *     summary: Delete a campaign
 *     tags: [Verification]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Documents deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Documents deleted successfully
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

studentVerificationRouter.delete('/:verificationId', isAuthenticated, studentAccess, studentVerificationController.deleteVeriicationDocument);

module.exports = studentVerificationRouter;