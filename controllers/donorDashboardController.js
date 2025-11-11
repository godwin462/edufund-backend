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
    let withdrawnDonations = await PaymentModel.find({
      senderId: donorId,
      status: "withdrawn",
    });

    const activeCampaigns = await campaignModel
      .find({ isActive: true })
      .populate("donations")
      .exec();
    let recentDonations = await PaymentModel.find({
      senderId: donorId,
      status: "successful",
    })
      .sort({ createdAt: -1 })
      .populate("receiverId")
      .populate({
        path: "campaignId",
        populate: {
          path: "donations",
        },
      })
      .exec();
    const recentWithdrawnDonations = await PaymentModel.find({
      senderId: donorId,
      status: "withdrawn",
    })
      .sort({ createdAt: -1 })
      .populate("receiverId")
      .populate({
        path: "campaignId",
        populate: {
          path: "donations",
        },
      })
      .exec();
    recentDonations = recentDonations.concat(recentWithdrawnDonations);
    let studentsHelped = totalDonated.map((donation) => donation.receiverId);
    studentsHelped = studentsHelped.concat(
      withdrawnDonations.map((donation) => donation.receiverId)
    );
    studentsHelped = new Set(studentsHelped).size;
    totalDonated =
      totalDonated?.reduce((acc, donation) => acc + donation.amount, 0) || 0;
    totalDonated += withdrawnDonations.reduce(
      (acc, donation) => acc + donation.amount,
      0
    );
    const stats = [
      `₦${totalDonated.toLocaleString()}`,
      studentsHelped,
      activeCampaigns.length,
      `${94}%`,
    ];
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
