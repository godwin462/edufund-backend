const userModel = require("../models/userModel");
const paymentModel = require("../models/paymentModel");
const campaignModel = require("../models/campaignModel");
const WithdrawalModel = require("../models/withdrawalModel");
const { koraMakePayment } = require("../utils/kora");
const { createNotification } = require("./notificationController");
const reference = require("crypto");

exports.makeDonation = async (req, res) => {
  try {
    const { donorId, receiverId, campaignId } = req.params;
    let { amount } = req.body || {};
    // console.log(amount);
    amount = parseInt(amount);
    // console.log(amount);
    const ref = reference.randomUUID();
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        message: "Please provide a valid donation amount",
      });
    }

    const receiver = await userModel.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found, please create an account",
      });
    }
    if (receiver.role !== "student") {
      return res.status(400).json({
        message: "Receiver not a student, donation not allowed",
      });
    }

    const donor = await userModel.findById(donorId);

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found, please create an account to make donation",
      });
    }

    const campaign = await campaignModel.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }
    if (!campaign.isActive) {
      return res.status(400).json({
        message: "Action not allowed, can not donate to an inactive campaign",
      });
    }
    const payload = {
      amount: parseInt(amount),
      currency: "NGN",
      reference: ref,
      customer: {
        email: donor.email,
        name: donor.fullName,
      },
      redirect_url: `https://edu-fund-gamma.vercel.app/donor_dashboard/donation`,
    };
    const url = "charges/initialize";
    const response = await koraMakePayment(url, payload);

    if (!response) {
      return res.status(500).json({
        message: "Error initializing payment",
      });
    }

    const transaction = await paymentModel.create({
      campaignId,
      senderId: donorId,
      receiverId,
      amount: parseInt(amount),
      reference: ref,
    });

    if (!transaction) {
      return res.status(500).json({
        message: "Error creating transaction",
      });
    }
    console.log(payload, transaction, ref);
    return res.status(200).json({
      message: "Donation initiated successfully",
      data: response.data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error initializing payment",
      error: error.response,
    });
  }
};

exports.verifyPaymentWebHook = async (req, res) => {
  try {
    const { event, data } = req.body || {};
    console.log("Verifying payment...");
    console.log(data);
    console.log(event);
    const payment = await paymentModel.findOne({ reference: data.reference });
    if (!payment) {
      console.log("Payment not found");
      return res.status(404).json({
        message: "Payment not found",
      });
    }
    const campaign = await campaignModel.findById(
      payment.campaignId.toString()
    );
    if (!campaign) {
      console.log("Campaign not found");
      return res.status(404).json({
        message: "Campaign not found",
      });
    }
    if (!campaign.isActive) {
      console.log("Campaign is not active");
      await createNotification(
        payment.senderId,
        "Campaign is not active",
        payment._id,
        "error"
      );
      return res.status(400).json({
        message: "Campaign is not active",
      });
    }

    const donations = await paymentModel.find({
      campaignId: payment.campaignId.toString(),
      status: "successful",
    });
    let totalDonation = donations.reduce(
      (acc, donation) => acc + donation.amount,
      0
    );

    if (data.status === "success") {
      console.log("Payment successful");
      payment.status = "successful";
      totalDonation += payment.amount;
      if (totalDonation >= campaign.target) {
        try {
          await campaignModel.findByIdAndUpdate(payment.campaignId, {
            isActive: false,
          });
        } catch (error) {
          console.log(
            "Error updating campaign, but proceeding with payment verification.",
            error
          );
          return res.status(200).json({
            message:
              "Campaign update failed, but payment verification successful",
          });
        }
      }
      await payment.save();
      await createNotification(
        payment.senderId,
        `Donation of ₦${payment.amount.toLocaleString()} was successful`,
        payment._id,
        "success"
      );
      await createNotification(
        payment.receiverId,
        `New donation of ₦${payment.amount.toLocaleString()}  received`,
        payment._id,
        "success"
      );
      console.log("payment completed successfully");
      res.status(200).json({
        message: "Payment Verification Successful",
      });
    } else if (event === "charge.failed") {
      console.log("Payment failed");
      payment.status = "failed";
      await payment.save();
      await createNotification(
        payment.senderId,
        `Your donation of ₦${payment.amount.toLocaleString()} failed`,
        payment._id,
        "error"
      );
      res.status(200).json({
        message: "Payment Failed",
      });
    } else {
      throw new Error("Invalid event");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error verifying payment: ",
      error: error.message,
    });
  }
};

exports.withdrawDonation = async (req, res) => {
  try {
    const { campaignId, studentId } = req.params;
    const { purpose, note } = req.body || {};
    const campaign = await campaignModel
      .findOne({ _id: campaignId, studentId })
      .populate("studentId");

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found, please create a campaign first",
      });
    }

    const donations = await paymentModel
      .find({ campaignId, status: "successful" })
      .populate("senderId");

    const amount = donations.reduce(
      (acc, donation) => acc + donation.amount,
      0
    );
    if (amount < campaign.target) {
      return res.status(400).json({
        message: "Cannot withdraw donation, target not met yet!",
      });
    }
    const withdrawal = await WithdrawalModel.create({
      campaignId,
      userId: studentId,
      amount,
      purpose,
      note,
    });
    const payload = {
      reference: reference.randomUUID(),
      amount,
      currency: "NGN",
      customer: {
        name: `${campaign.studentId.firstName} ${campaign.studentId.lastName}`,
        email: campaign.studentId.email,
      },
      // account_name, merchant_bears_cost, narration, metadata (optional)
      narration: `EduFund Donation Withdrawal: ${campaign.title}`,
    };
    const url = "charges/bank-transfer";
    const response = await koraMakePayment(url, payload);
    const total_donations = donations.length;
    res.status(200).json({
      message:
        total_donations < 1
          ? "No donations yet"
          : "Donations found successfully",
      total_donations,
      redirect_url: response.data.redirect_url,
      data: withdrawal,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error withdrawing donation",
      error: error.message,
    });
  }
};
