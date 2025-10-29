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
 *       "404":
 *         description: Academic details not found
 *       "500":
 *         description: Error updating academic details
 */
academicRouter.put('/:academicDetailsId', studentAccess, isAuthenticated, updateAcademicDetails);

// academicRouter.delete('/:academicDetails', isAuthenticated, studentAccess, deleteAcademicDetails);

module.exports = academicRouter;
