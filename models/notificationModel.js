const {default: mongoose} = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['success', 'info', 'warning', 'error'],
    },
    relatedEntity: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isNew: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

const NotificationModel = mongoose.model('Notification', notificationSchema);
module.exports = NotificationModel;
