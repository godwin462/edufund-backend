const mongoose = require("mongoose");

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
        return this.role === "sponsor";
      },
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
