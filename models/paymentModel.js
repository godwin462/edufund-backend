const mongoose = require("mongoose");

const Payment = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    default: null,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  withdrawalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Withdrawal",
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  reference: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["pending", "successful", "failed", "refunded"],
    default: "pending",
  },
  withdrawn: {
    type: Boolean,
    default: () => (this.withdrawalId ? true : false),
    select: false,
  },
});

const PaymentModel = mongoose.model("Payment", Payment);

module.exports = PaymentModel;
