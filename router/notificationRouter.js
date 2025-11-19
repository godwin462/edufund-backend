const {markNotificationAsRead, markAllNotificationsAsRead, getUserNotifications, getTotalUserNotifications, markAllUserNotificationsAsUnread, markNotificationAsUnread} = require("../controllers/notificationController");
const {isAuthenticated} = require("../middleware/authenticationMiddleware");

const notificationRouter = require("express").Router();

/**
 * @swagger
 * /notification/total/{userId}:
 *   get:
 *     summary: Get total number of notifications for a user
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notifications found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notifications found
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 10
 *                     unread:
 *                       type: number
 *                       example: 5
 *                     new:
 *                       type: number
 *                       example: 2
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
notificationRouter.get("/total/:userId", isAuthenticated, getTotalUserNotifications);

/**
 * @swagger
 * /notification/{userId}:
 *   get:
 *     summary: Get all notifications for a user
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notifications found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notifications found
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
 *                       userId:
 *                         type: string
 *                         example: 60d5ec49a0d2db2a3c_dummy_id
 *                       message:
 *                         type: string
 *                         example: You have a new donation.
 *                       type:
 *                         type: string
 *                         example: success
 *                       relatedEntity:
 *                         type: string
 *                         example: 60d5ec49a0d2db2a3c_dummy_id
 *                       isRead:
 *                         type: boolean
 *                         example: false
 *                       isNew:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *       404:
 *         description: Notifications not found
 *       500:
 *         description: Internal server error
 */
notificationRouter.get("/:userId", isAuthenticated, getUserNotifications);

/**
 * @swagger
 * /notification/mark-all-as-read/{userId}:
 *   patch:
 *     summary: Mark all notifications as read for a user
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All notifications successfully marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All notifications successfully marked as read
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
 *                       userId:
 *                         type: string
 *                         example: 60d5ec49a0d2db2a3c_dummy_id
 *                       message:
 *                         type: string
 *                         example: You have a new donation.
 *                       type:
 *                         type: string
 *                         example: success
 *                       relatedEntity:
 *                         type: string
 *                         example: 60d5ec49a0d2db2a3c_dummy_id
 *                       isRead:
 *                         type: boolean
 *                         example: true
 *                       isNew:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *       404:
 *         description: Notifications not found
 *       500:
 *         description: Internal server error
 */
notificationRouter.patch("/mark-all-as-read/:userId", isAuthenticated, markAllNotificationsAsRead);

/**
 * @swagger
 * /notification/mark-all-as-unread/{userId}:
 *   patch:
 *     summary: Mark all notifications as unread for a user
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All notifications successfully marked as unread
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All notifications successfully marked as unread
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
 *                       userId:
 *                         type: string
 *                         example: 60d5ec49a0d2db2a3c_dummy_id
 *                       message:
 *                         type: string
 *                         example: You have a new donation.
 *                       type:
 *                         type: string
 *                         example: success
 *                       relatedEntity:
 *                         type: string
 *                         example: 60d5ec49a0d2db2a3c_dummy_id
 *                       isRead:
 *                         type: boolean
 *                         example: false
 *                       isNew:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T12:00:00.000Z
 *       404:
 *         description: Notifications not found
 *       500:
 *         description: Internal server error
 */
notificationRouter.patch("/mark-all-as-unread/:userId", isAuthenticated, markAllUserNotificationsAsUnread);

/**
 * @swagger
 * /notification/mark-as-read/{notificationId}:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification successfully marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification successfully marked as read
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     userId:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     message:
 *                       type: string
 *                       example: You have a new donation.
 *                     type:
 *                       type: string
 *                       example: success
 *                     relatedEntity:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     isRead:
 *                       type: boolean
 *                       example: true
 *                     isNew:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
notificationRouter.patch("/mark-as-read/:notificationId", isAuthenticated, markNotificationAsRead);

/**
 * @swagger
 * /notification/mark-as-unread/{notificationId}:
 *   patch:
 *     summary: Mark a notification as unread
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification successfully marked as unread
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification successfully marked as unread
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     userId:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     message:
 *                       type: string
 *                       example: You have a new donation.
 *                     type:
 *                       type: string
 *                       example: success
 *                     relatedEntity:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     isRead:
 *                       type: boolean
 *                       example: false
 *                     isNew:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
notificationRouter.patch("/mark-as-unread/:notificationId", isAuthenticated, markNotificationAsUnread);

module.exports = notificationRouter;
