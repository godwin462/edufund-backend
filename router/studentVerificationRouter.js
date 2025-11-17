const studentVerificationRouter = require("express").Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const { studentAccess } = require("../middleware/roleMiddleware");
const upload = require("../middleware/multerMiddleware");
const {
  createVerificationDocument,
  getAllStudentsVerificationDocuments,
  deleteStudentVerificationDocument,
  updateStudentVerificationDocuments,
} = require("../controllers/studentVerificationController");

/**
 * @swagger
 * tags:
 *   name: Student Verification
 *   description: API for student verification documents
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StudentVerification:
 *       type: object
 *       required:
 *         - studentId
 *         - document
 *         - documentType
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the verification document
 *         studentId:
 *           type: string
 *           description: The ID of the student
 *         document:
 *           type: object
 *           properties:
 *             secureUrl:
 *               type: string
 *               description: The secure URL of the uploaded document
 *             publicId:
 *               type: string
 *               description: The public ID of the uploaded document
 *         isVerified:
 *           type: boolean
 *           description: Whether the document is verified or not
 *           default: false
 *         documentType:
 *           type: string
 *           enum: [admissionLetter, studentIdCard, semesterReceipt, academicResult, nin]
 *           description: The type of the verification document
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time the document was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The time the document was last updated
 *       example:
 *         _id: "60d5f3f7a0d2db2a3c000008"
 *         studentId: "60d5ec49a0d2db2a3c_dummy_id"
 *         document:
 *           secureUrl: "http://example.com/document.pdf"
 *           publicId: "document_public_id"
 *         isVerified: false
 *         documentType: "admissionLetter"
 *         createdAt: "2025-11-02T07:16:16.703Z"
 *         updatedAt: "2025-11-02T07:16:16.703Z"
 */

/**
 * @swagger
 * /student-verification/{studentId}:
 *   post:
 *     summary: Upload verification documents for a student
 *     tags: [Student Verification]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               admissionLetter:
 *                 type: string
 *                 format: binary
 *                 description: Admission letter in PDF format.
 *               studentIdCard:
 *                 type: string
 *                 format: binary
 *                 description: Student ID card in PDF format.
 *               semesterReceipt:
 *                 type: string
 *                 format: binary
 *                 description: Semester receipt in PDF format.
 *               academicResult:
 *                 type: string
 *                 format: binary
 *                 description: Academic result in PDF format.
 *               nin:
 *                 type: string
 *                 format: binary
 *                 description: NIN in PDF format.
 *     responses:
 *       "200":
 *         description: Verification documents created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification documents created successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StudentVerification'
 *       "400":
 *         description: Bad request
 *       "403":
 *         description: User is not a student
 *       "404":
 *         description: Student not found
 *       "500":
 *         description: Internal server error
 */
studentVerificationRouter.post(
  "/:studentId",
  upload.fields([
    { name: "admissionLetter", maxCount: 1 },
    { name: "studentIdCard", maxCount: 1 },
    { name: "semesterReceipt", maxCount: 1 },
    { name: "academicResult", maxCount: 1 },
    { name: "nin", maxCount: 1 },
  ]),
  isAuthenticated,
  studentAccess,
  createVerificationDocument
);

/**
 * @swagger
 * /student-verification/{studentId}:
 *   get:
 *     summary: Get all verification documents for a student
 *     tags: [Student Verification]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student
 *     responses:
 *       "200":
 *         description: Documents fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StudentVerification'
 *       "500":
 *         description: Internal server error
 */
studentVerificationRouter.get(
  "/:studentId",
  isAuthenticated,
  studentAccess,
  getAllStudentsVerificationDocuments
);

/**
 * @swagger
 * /student-verification/{documentId}:
 *   patch:
 *     summary: Update a verification document
 *     tags: [Student Verification]
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the document
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               verificationDocument:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "200":
 *         description: Document updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentVerification'
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Document not found
 *       "500":
 *         description: Internal server error
 */
studentVerificationRouter.patch(
  "/:documentId",
  upload.single("verificationDocument"),
  isAuthenticated,
  studentAccess,
  updateStudentVerificationDocuments
);

/**
 * @swagger
 * /student-verification/{documentId}:
 *   delete:
 *     summary: Delete a verification document
 *     tags: [Student Verification]
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the document
 *     responses:
 *       "200":
 *         description: Document deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentVerification'
 *       "404":
 *         description: Document not found
 *       "500":
 *         description: Internal server error
 */
studentVerificationRouter.delete(
  "/:documentId",
  isAuthenticated,
  studentAccess,
  deleteStudentVerificationDocument
);

module.exports = studentVerificationRouter;
