const campaignModel = require("../models/campaignModel");
const NotificationModel = require("../models/notificationModel");
const PaymentModel = require("../models/paymentModel");
const WithdrawalModel = require("../models/withdrawalModel");
const UserModel = require("../models/userModel");

exports.overview = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await UserModel.findById(studentId)
      .populate("academicDocuments")
      .lean({ virtuals: true });
    if (!student) {
      return res.status(404).json({
        message: "Student not found, please login or create a student account",
      });
    }
    let totalRaised = await PaymentModel.find({
      receiverId: studentId,
      status: "successful",
    });
    totalRaised =
      totalRaised?.reduce((acc, donation) => acc + donation.amount, 0) || 0;

    const activeCampaign = await campaignModel
      .findOne({ studentId, isActive: true })
      .populate("studentId donations")
      .exec();

    const recentDonors = await PaymentModel.find({
      receiverId: studentId,
      status: "successful",
    })
      .populate("senderId")
      .sort({ createdAt: -1 });
    const recentActivities = await NotificationModel.find({
      userId: studentId,
    }).sort({ createdAt: -1 });
    let totalDonors = await PaymentModel.find({
      receiverId: studentId,
      status: "successful",
    }).distinct("senderId");
    const data = {
      student,
      totalRaised,
      totalDonors: totalDonors.length || 0,
      goalProgress: activeCampaign?.fundedPercentage || 0,
      daysRemaining: activeCampaign?.daysLeft || 0,
      activeCampaign,
      recentDonors,
      recentActivities,
    };
    return res.status(200).json({ message: "success", data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

exports.withdrawalHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await UserModel.findById(studentId)
      .populate("academicDocuments")
      .lean({ virtuals: true });
    if (!student) {
      return res.status(404).json({
        message: "Student not found, please login or create a student account",
      });
    }
    const payments = await PaymentModel.find({
      receiverId: studentId,
      status: "successful",
    });
    let walletBallance = payments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );

    const withdrawals = await WithdrawalModel.find({ userId: studentId })
      .sort({ createdAt: -1 })
      .populate("campaignId");
    const total = withdrawals.length;
    return res.status(200).json({
      message: "Withdrawal history found successfully",
      total,
      data: { withdrawals, walletBallance, payments },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};
