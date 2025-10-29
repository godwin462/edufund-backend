const {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const upload = require("../middleware/multerMiddleware");
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
 *       "404":
 *         description: User not found.
 *       "500":
 *         description: Server error.
 */
userRouter.delete("/:userId",
  //  isAuthenticated,
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
