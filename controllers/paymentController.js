const userModel = require("../models/userModel");
const paymentModel = require("../models/paymentModel");
const campaignModel = require("../models/campaignModel");
const WithdrawalModel = require("../models/withdrawalModel");
const { koraMakePayment } = require("../utils/kora");
const { createNotification } = require("./notificationController");
const reference = require("crypto");
const { sendEmail } = require("../email/brevo");
const campaignTargetMetTemplate = require("../templates/campaignTargetMetTemplate");
const withdrawalRequestTemplate = require("../templates/withdrawalRequestTemplate");

exports.makeDonation = async (req, res) => {
  try {
    const { donorId, receiverId, campaignId } = req.params;
    let { amount } = req.body || {};
    console.log(req.body);
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

    const campaign = await campaignModel
      .findById(campaignId)
      .populate("donations")
      .exec();
    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }
    // console.log(campaign.remainingAmount, campaign);

    if (!campaign.isActive) {
      return res.status(400).json({
        message: "Action not allowed, can not donate to an inactive campaign",
      });
    }
    if (amount > campaign.remainingAmount) {
      return res.status(400).json({
        message: `Amount is greater than the remaining campaign target`,
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
        message: "Internal server error, error initializing payment",
      });
    }
    if (response.data.status == false) {
      console.log("response.data");
      return res.status(500).json({
        message: response.data.message,
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
    console.log(response.data);
    return res.status(200).json({
      message: "Donation initiated successfully",
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error initializing payment",
      error: error.message,
    });
  }
};

exports.verifyPaymentWebHook = async (req, res) => {
  try {
    const { event, data } = req.body || {};
    console.log("Verifying payment...");
    console.log(data);
    console.log(event);
    const payment = await paymentModel
      .findOne({ reference: data.payment_reference })
      .populate("receiverId senderId campaignId");
    if (!payment) {
      console.log("Payment not found");
      return res.status(404).json({
        message: "Payment not found",
      });
    }
    const campaign = await campaignModel.findById(payment.campaignId);
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
        `Your donation of ₦${payment.amount.toLocaleString()} ${
          payment.receiverId?.fullName
            ? "to " + payment.receiverId?.fullName
            : ""
        } was not processed because the campaign is not active`,
        payment._id,
        "error"
      );
      return res.status(400).json({
        message: "Campaign is not active",
      });
    }

    const donations = await paymentModel.find({
      campaignId: payment.campaignId,
      status: "successful",
    });
    let totalDonation = donations.reduce(
      (acc, donation) => acc + donation.amount,
      0
    );

    if (data.status === "success") {
      console.log("Payment successful");
      totalDonation += payment.amount;
      if (totalDonation >= campaign.target) {
        try {
          await createNotification(
            payment.senderId,
            `Good news! Your campaign has reached its target donation amount of ₦${campaign.target.toLocaleString()}`,
            payment._id,
            "success"
          );
          const html = campaignTargetMetTemplate(
            campaign.target,
            payment.senderId?.firstName,
            payment.campaignId?.title
          );
          const subject = "EduGoal Achieved!";
          if (payment.receiverId.email)
            await sendEmail({
              to: payment.receiverId.email,
              subject,
              html,
            });
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
      await paymentModel.findByIdAndUpdate(payment._id, {
        status: "successful",
      });
      await createNotification(
        payment.senderId,
        `Donation of ₦${payment.amount.toLocaleString()} ${
          payment.receiverId?.fullName
            ? "to " + payment.receiverId?.fullName
            : ""
        } was successful`,
        payment._id,
        "success"
      );
      await createNotification(
        payment.receiverId,
        `New donation of ₦${payment.amount.toLocaleString()}  received ${
          payment.senderId?.fullName ? "from " + payment.senderId?.fullName : ""
        }`,
        payment._id,
        "success"
      );
      console.log("payment completed successfully");
      res.status(200).json({
        message: "Payment Verification Successful",
      });
    } else if (event === "charge.failed") {
      console.log("Payment failed");
      await paymentModel.findByIdAndUpdate(payment._id, {
        status: "failed",
      });
      await createNotification(
        payment.senderId,
        `Your donation of ₦${payment.amount.toLocaleString()} ${
          payment.receiverId?.fullName
            ? "to " + payment.receiverId?.fullName
            : ""
        } was not successful`,
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
      .populate("studentId donations")
      .exec();

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found, please create a campaign first",
      });
    }

    if (campaign.status == "withdrawn") {
      return res.status(400).json({
        message: "You have already withdrawn from this campaign",
      });
    }

    if (
      !campaign.totalDonations ||
      campaign.totalDonations !== campaign.target
    ) {
      // console.log(campaign.totalDonations, campaign);
      return res.status(400).json({
        message: "You cannot withdraw amount not equal to total donations",
      });
    }

    const withdrawal = await WithdrawalModel.create({
      campaignId,
      userId: studentId,
      amount: campaign.totalDonations,
      purpose,
      note,
    });

    await paymentModel.updateMany(
      { campaignId, status: "successful" },
      { status: "withdrawn", withdrawalId: withdrawal._id }
    );

    await campaignModel.findOneAndUpdate(
      { _id: campaignId, studentId },
      { status: "withdrawn", isActive: false }
    );

    res.status(200).json({
      message: "Donation withdrawn initiated",
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

exports.withdrawWalletBalance = async (req, res) => {
  try {
    const { campaignId, studentId } = req.params;
    const { amount, purpose, note } = req.body || {};

    const student = await userModel.findById(studentId);
    if (!student) {
      return res.status(404).json({
        message: "User not found, please create an account",
      });
    }
    const campaign = await campaignModel.findOne({
      _id: campaignId,
      studentId,
    });

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found, please create a campaign first",
      });
    }

    if (campaign.status == "withdrawn") {
      return res.status(400).json({
        message: "You have already withdrawn from this campaign",
      });
    }

    if (amount < campaign.target || amount > campaign.target) {
      return res.status(400).json({
        // message: "You cannot withdraw more than your campaign set target",
        message:
          "You can only withdraw amount equal to your campaign set target",
      });
    }

    const withdrawal = await WithdrawalModel.create({
      campaignId,
      userId: studentId,
      amount,
      purpose,
      note,
    });

    await paymentModel.updateMany(
      { campaignId, status: "successful" },
      { status: "withdrawn" }
    );

    await campaignModel.findOneAndUpdate(
      { _id: campaignId, studentId },
      { status: "withdrawn", isActive: false }
    );
    const html = withdrawalRequestTemplate(
      student.fullName,
      student.studentId,
      withdrawal.createdAt,
      withdrawal.status
    );
    await sendEmail({
      email: "anadulimited@gmail.com",
      subject: "EduWallet withdrawal request",
      text: "Withdrawal request",
      html: html,
    });
    res.status(200).json({
      message: "Donation withdrawn initiated",
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
