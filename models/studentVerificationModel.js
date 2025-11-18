const mongoose = require("mongoose");

const StudentVerificationSchema = new mongoose.Schema(
  {
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
    documentType: {
      type: String,
      enum: [
        "admissionLetter",
        "studentIdCard",
        "semesterReceipt",
        "academicResult",
        "nin",
      ],
      required: true,
    },
  },
  { timestamps: true }
);
StudentVerificationSchema.index(
  { studentId: 1, documentType: 1 },
  { unique: true }
);
const StudentVerificationModel = mongoose.model(
  "StudentVerification",
  StudentVerificationSchema
);

module.exports = StudentVerificationModel;
