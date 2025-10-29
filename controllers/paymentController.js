const userModel = require("../models/userModel");
const paymentModel = require("../models/paymentModel");
const campaignModel = require("../models/campaignModel");
const WithdrawalModel = require("../models/withdrawalModel");
const { koraMakePayment } = require("../utils/kora");
const reference = require("crypto").randomUUID();

exports.makeDonation = async (req, res) => {
  /* #swagger.tags = ['Payment']
     #swagger.description = 'Make a donation.'
     */
  try {
    const { donorId, receiverId, campaignId } = req.params;
    let { amount } = req.body || {};
    amount = parseInt(amount);

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

    const payload = {
      amount: parseInt(amount),
      currency: "NGN",
      reference,
      customer: {
        email: donor.email,
        name: donor.fullName,
      },
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
      reference,
      redirect_url: req.url,
    });

    if (!transaction) {
      return res.status(500).json({
        message: "Error creating transaction",
      });
    }
    return res.status(200).json({
      message: "Donation test successfully",
      data: response.data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error initializing payment: " + error.message,
      error: error.response,
    });
  }
};

exports.verifyPaymentWebHook = async (req, res) => {
  /* #swagger.tags = ['Payment']
     #swagger.description = 'Verify payment webhook note: will be called by KoraPay won't work on swagger ui.'
     */
  try {
    const { event, data } = req.body || {};
    if (event === "charge.success") {
      const payment = await paymentModel.findOne({ reference: data.reference });
      if (!payment) {
        return res.status(404).json({
          message: "Payment not found",
        });
      }
      payment.status = "successful";
      await payment.save();
      res.status(200).json({
        message: "Payment Verification Successful",
      });
    } else if (event === "charge.failed") {
      const payment = await paymentModel.findOne({ reference: data.reference });
      if (!payment) {
        return res.status(404).json({
          message: "Payment not found",
        });
      }
      payment.status = "failed";
      await payment.save();
      res.status(200).json({
        message: "Payment Failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error verifying payment: " + error.message,
    });
  }
};

exports.withdrawDonation = async (req, res) => {
  /* #swagger.tags = ['Payment']
     #swagger.description = 'Withdraw donation.'
     */
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
      reference,
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
