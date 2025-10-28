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
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    method: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "processing", "successful", "failed"],
      default: "requested",
    },
    transactionRef: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);
const WithdrawalModel = mongoose.model("Withdrawal", WithdrawalSchema);

module.exports = WithdrawalModel;
