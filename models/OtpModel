const { Schema, model } = require("mongoose");
const { FIVE_MINUTES_MS } = require("../utils/time");

const otpLifeTime = process.env.OTP_EXPIRY_DATE;

const authSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
      // validate: {
      //   validator: (v) => v.length === 4,
      //   message: () => `OTP must be 4 characters!`,
      // },
      required: [true, "OTP not provided!"],
    },
    trials: {
      type: Number,
      default: 0,
      // validate: {
      //   validator: (v) => v > 3,
      //   message: () => `OTP limit reached!`,
      // },
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
