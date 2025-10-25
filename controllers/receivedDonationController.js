const userModel = require("../models/userModel");
const paymentModel = require("../models/paymentModel");
const axios = require("axios");
const reference = require("crypto").randomBytes(16).toString("hex");

exports.getReceivedDonations = async (req, res) => {
  /* #swagger.tags = ['Donation']
   #swagger.description = 'Get all donations to a student.'
   */
  try {
    const { studentId } = req.params;
    const donations = await paymentModel
      .find({ receiverId: studentId })
      .populate("senderId");
    const total = donations.length;
    res.status(200).json({
      message:
        total < 1 ? "No donations found" : "Donations found successfully",
      total,
      data: donations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error getting donations",
      error: error.message,
    });
  }
};

exports.getOneReceivedDonation = async (req, res) => {
  /* #swagger.tags = ['Donation']
   #swagger.description = 'Get a donation.'
   */
  try {
    const { reference } = req.params;
    const donation = await paymentModel
      .findOne({ reference })
      .populate("senderId");
    if (!donation) {
      res.status(404).json({
        message: "Donation not found",
      });
    }
    res.status(200).json({
      message: "Donation found successfully",
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error getting donations",
      error: error.message,
    });
  }
};

exports.getCampaignDonations = async (req, res) => {
  /* #swagger.tags = ['Donation']
   #swagger.description = 'Get all donations relating to a campaign.'
   */
  try {
    const { campaignId } = req.params;
    const donations = await paymentModel
      .find({ receiverId: studentId, campaignId })
      .populate("senderId");
    const total = donations.length;
    res.status(200).json({
      message:
        total < 1 ? "No donations found" : "Donations found successfully",
      total,
      data: donations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error getting donations",
      error: error.message,
    });
  }
};
