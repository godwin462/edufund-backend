const { Schema, model } = require("mongoose");

const VerificationTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      default: Date.now,
      index: { expires: "30m" },
    },
  },
  { timestamps: true }
);

const VerificationTokenModel = model(
  "VerificationToken",
  VerificationTokenSchema
);

module.exports = VerificationTokenModel;
