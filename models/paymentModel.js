const { required } = require("joi");
const mongoose = require("mongoose");

const Payment = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "campaign",
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
  donorName:{
    type:String,
    default: ()=>this.senderId
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
    enum: ["Pending", "Successful", "Failed", "refunded"],
    default: "Pending",
  },
});

const PaymentModel = mongoose.model("Payment", Payment);

module.exports = PaymentModel;
