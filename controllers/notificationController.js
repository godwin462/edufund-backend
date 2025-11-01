const NotificationModel = require("../models/notificationModel");
const UserModel = require("../models/userModel");
const loginOtpTemplate = require("../templates/loginOtpTemplate");

exports.createNotification = async (userId, message, relatedEntity, type) => {
    try {
        const notification = await NotificationModel.create({
            userId,
            message,
            type,
            relatedEntity,
        });
        // console.log(notification);
        return notification;
    } catch(error) {
        console.log(error);
        throw error;
    }
};

exports.getTotalUserNotifications = async (req, res) => {
    try {
        const {userId} = req.params;

        const user = await UserModel.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        const notifications = await NotificationModel.find({userId});
        const unreadNotifications = await NotificationModel.find({userId, isRead: false});
        const newNotifications = await NotificationModel.find({userId, isNew: true});

        const total = notifications.length;
        return res.status(200).json({
            message:
                total < 1
                    ? "No notifications , you are all caught up"
                    : "Notifications found",
            data: {
                total,
                unread: unreadNotifications.length,
                new: newNotifications.length,
            }
        });
    } catch(error) {
        console.log(error);
        return res
            .status(500)
            .json({message: "Internal server error", error: error.message});
    }
};

exports.getUserNotifications = async (req, res) => {
    try {

        const {userId} = req.params;

        const user = await UserModel.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        let notifications = await NotificationModel.updateMany({userId}, {isNew: false});

        notifications = await NotificationModel.find({userId}).sort({createdAt: -1});
        const total = notifications.length;
        return res.status(200).json({
            message:
                total < 1
                    ? "No notifications , you are all caught up"
                    : "Notifications found",
            total,
            data: notifications,
        });
    } catch(error) {
        console.log(error);
        return res
            .status(500)
            .json({message: "Internal server error", error: error.message});
    }
};

exports.markAllUserNotificationsAsRead = async (req, res) => {
    try {
        const {userId} = req.params;

        const user = await UserModel.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        let notifications = await NotificationModel.updateMany({userId, isRead: false}, {isNew: false, isRead: true});

        notifications = await NotificationModel.find({userId});

        const total = notifications.length;
        return res.status(200).json({
            message: total < 1 ? "No notifications, you are all caught up" : "All notifications successfully marked as read",
            total,
            data: notifications,
        });
    } catch(error) {
        console.log(error);
        return res
            .status(500)
            .json({message: "Internal server error", error: error.message});
    }
};

exports.markAllUserNotificationsAsUnread = async (req, res) => {
    try {
        const {userId} = req.params;

        const user = await UserModel.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        let notifications = await NotificationModel.updateMany({userId, isRead: true}, {isRead: false});
        notifications = await NotificationModel.find({userId});

        const total = notifications.length;
        return res.status(200).json({
            message: total < 1 ? "No notifications, you are all caught up" : "All notifications successfully marked as unread",
            total,
            data: notifications,
        });
    } catch(error) {
        console.log(error);
        return res
            .status(500)
            .json({message: "Internal server error", error: error.message});
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        const {notificationId} = req.params;

        const notification = await NotificationModel.findByIdAndUpdate(
            notificationId,
            {isRead: true},
            {new: true}
        );
        if(!notification) {
            return res.status(404).json({message: "Notification not found"});
        }
        return res.status(200).json({
            message: "Notification successfully marked as read",
            data: notification,
        });
    } catch(error) {
        console.log(error);
        return res
            .status(500)
            .json({message: "Internal server error", error: error.message});
    }
};

exports.markNotificationAsUnread = async (req, res) => {
    try {
        const {notificationId} = req.params;

        const notification = await NotificationModel.findByIdAndUpdate(
            notificationId,
            {isRead: false},
            {new: true}
        );
        if(!notification) {
            return res.status(404).json({message: "Notification not found"});
        }
        return res.status(200).json({
            message: "Notification successfully marked as unread",
            data: notification,
        });
    } catch(error) {
        console.log(error);
        return res
            .status(500)
            .json({message: "Internal server error", error: error.message});
    }
};

// These below are for the admin and testing
exports.markAllNotificationsAsRead = async (req, res) => {
    try {
        let notifications = await NotificationModel.updateMany(
            {isRead: false},
            {isNew: false, isRead: true}
        );
        notifications = await NotificationModel.find();
        const total = notifications.length;
        return res.status(200).json({
            message:
                total < 1
                    ? "No notifications, you are all caught up"
                    : "All notifications successfully marked as read",
            total,
            data: notifications,
        });
    } catch(error) {
        console.log(error);
        return res
            .status(500)
            .json({message: "Internal server error", error: error.message});
    }
};

exports.markAllNotificationsAsUnread = async (req, res) => {
    try {
        let notifications = await NotificationModel.updateMany(
            {isRead: true},
            {isRead: false}
        );
        notifications = await NotificationModel.find();
        const total = notifications.length;
        return res.status(200).json({
            message:
                total < 1
                    ? "No notifications, you are all caught up"
                    : "All notifications successfully marked as unread",
            total,
            data: notifications,
        });
    } catch(error) {
        console.log(error);
        return res
            .status(500)
            .json({message: "Internal server error", error: error.message});
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const {notificationId} = req.params;

        const notification = await NotificationModel.findByIdAndDelete(
            notificationId,
            {new: true}
        );
        if(!notification) {
            return res.status(404).json({message: "Notification not found"});
        }
        return res.status(200).json({
            message: "Notification successfully deleted",
            data: notification,
        });
    } catch(error) {
        console.log(error);
        return res
            .status(500)
            .json({message: "Internal server error", error: error.message});
    }
};

exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await NotificationModel.find().sort({createdAt: -1});

        const total = notifications.length;
        return res.status(200).json({
            message: total < 1 ? "No notifications found" : "Notifications found successfully",
            total,
            data: notifications,
        });
    } catch(error) {
        console.log(error);
        return res
            .status(500)
            .json({message: "Internal server error", error: error.message});
    }
};
