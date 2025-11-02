const { createAcademicDetails, deleteAcademicDetails, updateAcademicDetails, getAcademicDetails } = require('../controllers/academicController')

const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const { studentAccess } = require('../middleware/roleMiddleware');

const academicRouter = require('express').Router();

/**
 * @swagger
 * tags:
 *   name: Academics
 *   description: Academic details management
 */

/**
 * @swagger
 * /academic/{studentId}:
 *   post:
 *     summary: Create academic details for a student
 *     tags: [Academics]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolName:
 *                 type: string
 *               year:
 *                 type: number
 *               matricNumber:
 *                 type: number
 *               jambRegistrationNumber:
 *                 type: number
 *     responses:
 *       "201":
 *         description: Academic details created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Academic details created successfully
 *                 academicDetails:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     studentId:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     schoolName:
 *                       type: string
 *                       example: University of Example
 *                     year:
 *                       type: number
 *                       example: 2023
 *                     matricNumber:
 *                       type: number
 *                       example: 123456
 *                     jambRegistrationNumber:
 *                       type: number
 *                       example: 789012
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "500":
 *         description: Error creating academic details
 */
academicRouter.post('/:studentId', isAuthenticated, studentAccess, createAcademicDetails);

/**
 * @swagger
 * /academic/{studentId}:
 *   get:
 *     summary: Get academic details of a student
 *     tags: [Academics]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Academic details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Academic details fetched successfully
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
 *                       schoolName:
 *                         type: string
 *                         example: University of Example
 *                       year:
 *                         type: number
 *                         example: 2023
 *                       matricNumber:
 *                         type: number
 *                         example: 123456
 *                       jambRegistrationNumber:
 *                         type: number
 *                         example: 789012
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *       "500":
 *         description: Error fetching academic details
 */
academicRouter.get('/:studentId', isAuthenticated, studentAccess, getAcademicDetails)

/**
 * @swagger
 * /academic/{academicDetailsId}:
 *   put:
 *     summary: Update academic details
 *     tags: [Academics]
 *     parameters:
 *       - in: path
 *         name: academicDetailsId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolName:
 *                 type: string
 *               year:
 *                 type: number
 *               matricNumber:
 *                 type: number
 *               jambRegistrationNumber:
 *                 type: number
 *     responses:
 *       "200":
 *         description: Academic details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Academic details updated successfully
 *                 academicDetails:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     studentId:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     schoolName:
 *                       type: string
 *                       example: University of Example
 *                     year:
 *                       type: number
 *                       example: 2024
 *                     matricNumber:
 *                       type: number
 *                       example: 123457
 *                     jambRegistrationNumber:
 *                       type: number
 *                       example: 789013
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-02T12:00:00.000Z
 *       "404":
 *         description: Academic details not found
 *       "500":
 *         description: Error updating academic details
 */
academicRouter.put('/:academicDetailsId', studentAccess, isAuthenticated, updateAcademicDetails);

// academicRouter.delete('/:academicDetails', isAuthenticated, studentAccess, deleteAcademicDetails);

module.exports = academicRouter;
