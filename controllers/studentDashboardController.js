const campaignModel = require("../models/campaignModel");
const NotificationModel = require("../models/notificationModel");
const PaymentModel = require("../models/paymentModel");
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
      .lean({ virtuals: true });
    const activeCampaignTotalDonations =
      activeCampaign?.donations.reduce(
        (acc, donation) => acc + donation.amount,
        0
      ) || 0;
    const goalProgress =
      (activeCampaignTotalDonations / activeCampaign?.target) * 100;

    const daysRemaining = Math.ceil(
      (new Date(activeCampaign?.createdAt).getTime() +
        activeCampaign?.duration * 24 * 60 * 60 * 1000 -
        new Date().getTime()) /
        (24 * 60 * 60 * 1000)
    );

    const donors = (
      await PaymentModel.find({
        campaignId: activeCampaign?._id,
        status: "successful",
      }).distinct("senderId")
    ).length;

    if (activeCampaign) {
      activeCampaign.fundedPercentage = goalProgress;
      activeCampaign.totalDonations = activeCampaignTotalDonations;
      activeCampaign.donors = donors;
      const remainingAmount =
        activeCampaign.target - activeCampaignTotalDonations;
      activeCampaign.remainingAmount =
        remainingAmount < 0 ? 0 : remainingAmount;
      activeCampaign.daysLeft = daysRemaining < 0 ? 0 : daysRemaining;
    }

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
      activeCampaign,
      goalProgress,
      daysRemaining,
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
