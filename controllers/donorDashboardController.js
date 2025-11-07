const campaignModel = require("../models/campaignModel");
const NotificationModel = require("../models/notificationModel");
const PaymentModel = require("../models/paymentModel");
const UserModel = require("../models/userModel");

exports.overview = async (req, res) => {
  try {
    const { donorId } = req.params;
    const donor = await UserModel.findById(donorId)
      .populate("academicDocuments")
      .lean({ virtuals: true });
    if (!donor) {
      return res.status(404).json({
        message: "Donor not found, please login or create a donor account",
      });
    }
    let totalDonated = await PaymentModel.find({
      senderId: donorId,
      status: "successful",
    });

    const activeCampaigns = await campaignModel
      .find({ isActive: true })
      .populate("donations")
      .exec();
    const recentDonations = await PaymentModel.find({
      senderId: donorId,
      status: "successful",
    })
      .populate("receiverId campaignId")
      .sort({ createdAt: -1 })
      .exec();
    let studentsHelped = totalDonated.map((donation) => donation.receiverId);
    studentsHelped = new Set(studentsHelped).size;
    totalDonated =
      totalDonated?.reduce((acc, donation) => acc + donation.amount, 0) || 0;
    const stats = [totalDonated, studentsHelped, activeCampaigns.length];
    const data = {
      donor,
      stats,
      activeCampaigns,
      recentDonations,
    };
    return res.status(200).json({ message: "success", data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};
