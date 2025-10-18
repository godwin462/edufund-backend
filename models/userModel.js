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
    password: {
      type: String,
      required: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      imageUrl: { type: String },
      publicId: { type: String },
    },
    role: {
      type: String,
      enum: ["student", "institution", "sponsor", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
