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
    course: {
      type: String,
      trim: true,
      required: true,
    },
    matricNumber: {
      type: String,
      required: true,
      trim: true,
    },
    jambRegistrationNumber: {
      type: String,
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
      enum: ["rejected", "pending", "approved", "completed"],
      default: "pending",
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

campaignSchema.virtual("totalDonations").get(function () {
  if (!this.donations || this.donations.length === 0) return 0;
  return this.donations.reduce(
    (acc, donation) =>
      donation.status === "successful" ? acc + donation.amount : acc,
    0
  );
});

campaignSchema.virtual("fundedPercentage").get(function () {
  if (this.target === 0 || !this.donations) return 0;
  const totalDonations = this.donations.reduce(
    (acc, donation) =>
      donation.status === "successful" && acc + donation.amount,
    0
  );
  let percentage = (totalDonations / this.target) * 100;
  percentage = percentage > 100 ? 100 : percentage;
  return Math.round(percentage);
});

campaignSchema.virtual("endDate").get(function () {
  if (!this.createdAt) {
    return null;
  }
  return new Date(
    this.createdAt.getTime() + this.duration * 24 * 60 * 60 * 1000
  );
});

campaignSchema.virtual("daysLeft").get(function () {
  if (!this.endDate) {
    return this.duration;
  }
  const msLeft = this.endDate.getTime() - Date.now();
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  return daysLeft > 0 ? daysLeft : 0;
});

campaignSchema.virtual("remainingAmount").get(function () {
  const remainingAmount = this.target - this.totalDonations;
  return remainingAmount > 0 ? remainingAmount : 0;
});

campaignSchema.virtual("donors").get(function () {
  const donors = this.donations
    ?.filter((d) => d.status === "successful")
    ?.map((donation) => donation.donorId?.toString());
  return new Set(donors).size;
});

const campaignModel = mongoose.model("Campaign", campaignSchema);

module.exports = campaignModel;
