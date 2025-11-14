const mongoose = require("mongoose");
const StudentVerificationModel = require("./studentVerificationModel");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    profilePicture: {
      imageUrl: {
        type: String,
        // required: true,
      },
      publicId: {
        type: String,
        // required: true,
      },
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["student", "institution", "sponsor", "admin"],
      default: "student",
    },
    sponsorType: {
      type: String,
      enum: ["individual", "organization"],
      default: () => (this.role === "sponsor" ? "individual" : undefined),
      required: function () {
        return this.role === "sponsor";
      },
    },
    organizationName: {
      type: String,
      default: null,
      required: function () {
        return this.role === "sponsor" && this.sponsorType === "organization";
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual("academicDocuments", {
  ref: "StudentVerification",
  localField: "_id",
  foreignField: "studentId",
  justOne: false,
});

// const REQUIRED_DOCUMENTS = [
//   "admission-letter",
//   "id-card",
//   "prev-semester-receipt",
//   "nin",
//   "result",
// ];

UserSchema.virtual("isFullyVerifiedStudent").get(function () {
  return true;
  if (this.role !== "student") {
    return false;
  }

  const docs = this.academicDocuments;

  if (!docs || docs.length === 0) {
    return false;
  }

  // const verifiedTypes = new Set(
  //   docs.filter((doc) => doc.isVerified === true).map((doc) => doc.documentType)
  // );

  // const hasAllRequired = REQUIRED_DOCUMENTS.every((requiredType) =>
  //   verifiedTypes.has(requiredType)
  // );

  const hasAllRequired = docs.every((doc) => doc.isVerified === true);

  return hasAllRequired;
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
