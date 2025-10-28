const mongoose = require("mongoose");

const WithdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "campaign",
      required: true,
    },
    transactionRef: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    purpose: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      enum: ["processing", "successful", "failed"],
      default: "processing",
    },
  },
  { timestamps: true }
);
const WithdrawalModel = mongoose.model("Withdrawal", WithdrawalSchema);

module.exports = WithdrawalModel;
