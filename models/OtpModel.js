const { Schema, model } = require("mongoose");

const authSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
      required: [true, "OTP not provided!"],
    },
    trials: {
      type: Number,
      default: 0,
      max: 3,
    },
    blockedUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const OtpModel = model("Otp", authSchema);
module.exports = OtpModel;
