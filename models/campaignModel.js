const mongoose = require("mongoose");
const PaymentModel = require("./paymentModel");

const campaignSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    schoolName: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    matricNumber: {
      type: Number,
      required: true,
    },
    jambRegistrationNumber: {
      type: Number,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    target: {
      type: Number,
      required: true,
    },
    story: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['rejected', 'pending', 'approved', 'completed'],
      default: 'pending'
    },
    campaignImage: {
      imageUrl: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

campaignSchema.virtual("donations", {
  ref: "Payment",
  localField: "_id",
  foreignField: "campaignId",
  justOne: false,
});

const campaignModel = mongoose.model("Campaign", campaignSchema);

module.exports = campaignModel;
