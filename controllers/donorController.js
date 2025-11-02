const paymentModel = require("../models/paymentModel");
const academicModel = require("../models/academicModel");
const campaignModel = require("../models/campaignModel");

exports.totalStudentsHelped = async (req, res) => {
  try {
    const { donorId } = req.params;
    let totalStudentsHelped = (
      await paymentModel.find({ senderId: donorId }).distinct("receiverId")
    ).length;
    let totalDonated = await paymentModel.find({ senderId: donorId, status: "successful" });
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
    return res
      .status(200)
      .json({ message: "Success", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Error getting total students helped: ${error.message}`,
    });
  }
};

exports.myDonations = async (req, res) => {
  try {
    const donations = await paymentModel.find();
    if (!donations || donations.length === 0) {
      return res
        .status(404)
        .json({ message: "You have not donated for any student" });
    }

    if (donations) {
      return res.status(200).json({ message: "My Donations", data: donations });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error getting all my donations: ${error.message}` });
  }
};

exports.getDonorsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const donors = await academicModel
      .find({ studentId })
      .distinct("donorId")
      .populate("academicDocuments")
      .lean({ virtuals: true });
    if (!donors || donors.length === 0) {
      return res.status(404).json({ message: "No donor yet" });
    }

    if (donors) {
      return res.status(200).json({
        message: `${donors.length} generous supporters`,
        data: donors,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error getting donors: ${error.message}` });
  }
};
