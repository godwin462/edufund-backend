const {markNotificationAsRead, markAllNotificationsAsRead, getUserNotifications, getTotalUserNotifications, markAllUserNotificationsAsUnread, markNotificationAsUnread} = require("../controllers/notificationController");
const {isAuthenticated} = require("../middleware/authenticationMiddleware");

const notificationRouter = require("express").Router();

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
 *       404:
 *         description: Notifications not found
 *       500:
 *         description: Internal server error
 */
notificationRouter.patch("/mark-all-as-read/:userId", isAuthenticated, markAllNotificationsAsRead);

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
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
notificationRouter.patch("/mark-as-read/:notificationId", isAuthenticated, markNotificationAsRead);

notificationRouter.patch("/mark-as-unread/:notificationId", isAuthenticated, markNotificationAsUnread);

module.exports = notificationRouter;
