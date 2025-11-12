const userModel = require("../models/userModel");
const paymentModel = require("../models/paymentModel");
const campaignModel = require("../models/campaignModel");

exports.overview = async (req, res) => {
  try {
    const totalUsers = await userModel.find();
    if (!totalUsers) {
      return res.status(404).json({ message: "No users in this app" });
    } else {
      res.status(200).json({ message: `Total users ${totalUsers.length}` });
    }

    const totalDonations = await paymentModel.find();
    res.status(200).json({
      message:
        totalDonations < 1
          ? `Total donations ${totalDonations.length}`
          : "No donations yet",
    });

    const activeCampaigns = await campaignModel.find({ isActive: true });
    res.status(200).json({
      message: `Active campaigns ${activeCampaigns.length}`,
    });

    const successRate = await paymentModel.find({ status: "successful" });
    res.status(200).json({
      message: `Successful payments ${successRate.length}`,
    });

    const students = await userModel.find({ role: "student" });

    const donors = await userModel.find({ role: "donor" });

    const schools = await userModel.find({ role: "school" });

    const data = {
      totalUsers,
      totalDonations,
      activeCampaigns,
      successRate,
      students,
      donors,
      schools,
    };
    return res
      .status(200)
      .json({ message: "Overview data", data, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
