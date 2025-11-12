const {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const upload = require("../middleware/multerMiddleware");
const {adminAccess} = require("../middleware/roleMiddleware");
const userRouter = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       "200":
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users found successfully
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
 *                       email:
 *                         type: string
 *                         example: user@example.com
 *                       firstName:
 *                         type: string
 *                         example: John
 *                       lastName:
 *                         type: string
 *                         example: Doe
 *                       isVerified:
 *                         type: boolean
 *                         example: true
 *                       role:
 *                         type: string
 *                         example: student
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *       "500":
 *         description: Server error.
 */
userRouter.get("/", getAllUsers);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: User found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User found successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     role:
 *                       type: string
 *                       example: student
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "404":
 *         description: User not found.
 *       "500":
 *         description: Server error.
 */
userRouter.get("/:userId", getUser);

/**
 * @swagger
 * /user/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     role:
 *                       type: string
 *                       example: student
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "404":
 *         description: User not found.
 *       "500":
 *         description: Server error.
 */
userRouter.delete("/:userId",
   isAuthenticated,
   adminAccess,
    deleteUser);

/**
 * @swagger
 * /user/{userId}:
 *   patch:
 *     summary: Update a user's information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "200":
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     role:
 *                       type: string
 *                       example: student
 *                     profilePicture:
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
 *         description: User not found.
 *       "500":
 *         description: Server error.
 */
userRouter.patch(
  "/:userId",
  upload.single("profilePicture"),
  isAuthenticated,
  updateUser
);

module.exports = userRouter;
