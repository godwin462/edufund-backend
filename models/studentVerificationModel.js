const mongoose = require("mongoose");

const StudentVerificationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    document: {
        secureUrl: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    // documentType: {
    //     type: String,
    //     enum: ["admission-letter", "id-card", "prev-semester-receipt", "nin", "result"],
    //     required: true,
    // },
},
    {timestamps: true}
);

const StudentVerificationModel = mongoose.model('StudentVerification', StudentVerificationSchema);

module.exports = StudentVerificationModel;
