const paymentModel = require("../models/paymentModel");
const campaignModel = require("../models/campaignModel");
const {listeners} = require("../models/studentVerificationModel");

exports.totalStudentsHelped = async (req, res) => {
  try {
    const { donorId } = req.params;
    let totalStudentsHelped = (
      await paymentModel.find({ senderId: donorId }).distinct("receiverId")
    ).length;
    let totalDonated = await paymentModel.find({
      senderId: donorId,
      status: "successful",
    });
    const activeCampaigns = (await campaignModel.find({ isActive: true }))
      .length;

    totalDonated = totalDonated.reduce(
      (acc, donation) => acc + donation.amount,
      0
    );

    const data = {
      totalDonated,
      totalStudentsHelped,
      activeCampaigns,
    };
    return res.status(200).json({ message: "Success", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Internal server error getting total students helped`,
      error: error.message,
    });
  }
};

exports.myDonations = async (req, res) => {
  try {
    const { donorId } = req.params;
    let donations = await paymentModel
      .find({ senderId: donorId, status: "successful" })
      .sort({ createdAt: -1 })
      .populate("receiverId")
      .populate({
        path: "campaignId",
        populate: {
          path: "donations",
        },
      })
      .exec();
    donations = donations.concat( await paymentModel
      .find({ senderId: donorId, status: "withdrawn" })
      .sort({ createdAt: -1 })
      .populate("receiverId")
      .populate({
        path: "campaignId",
        populate: {
          path: "donations",
        },
      })
      .exec());

    const total = donations.length;
    return res.status(200).json({
      message: total < 1 ? "No donations yet" : "My Donations",
      total,
      data: donations,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal server error getting all my donations`,
      error: error.message,
    });
  }
};

exports.getDonorsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    let donors = await paymentModel
      .find({ receiverId: studentId, status: "successful" })
      .populate("senderId")
      .exec();
      donors = donors.concat( await paymentModel
      .find({ receiverId: studentId, status: "withdrawn" })
      .populate("senderId")
      .exec());
    const total = donors.length;

    return res.status(200).json({
      message: total < 1 ? "No donations hey" : "Donors found successfully",
      total,
      data: donors,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: `Internal server error getting donors`,
        error: error.message,
      });
  }
};
