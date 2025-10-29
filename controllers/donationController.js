const userModel = require("../models/userModel");
const paymentModel = require("../models/paymentModel");
const axios = require("axios");
const reference = require("crypto").randomBytes(16).toString("hex");

exports.getReceivedDonations = async (req, res) => {
  /* #swagger.tags = ['Donation']
   #swagger.description = 'Get all donations to a student.'
   */
  try {
    const status = req.query.status || "successful";
    const {studentId} = req.params;
    const donations = await paymentModel
      .find({receiverId: studentId, status})
      .populate("senderId");
    const total = donations.length;
    res.status(200).json({
      message:
        total < 1
          ? `No ${status} donations found`
          : "Donations found successfully",
      total,
      data: donations,
    });
  } catch(error) {
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
    const {reference} = req.params;
    const donation = await paymentModel
      .findOne({reference})
      .populate("senderId");
    if(!donation) {
      res.status(404).json({
        message: "Donation not found",
      });
    }
    res.status(200).json({
      message: "Donation found successfully",
      data: donation,
    });
  } catch(error) {
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
    const {campaignId} = req.params;
    const donations = await paymentModel
      .find({receiverId: studentId, campaignId, status: "successful"})
      .populate("senderId");
    const total = donations.length;
    res.status(200).json({
      message:
        total < 1 ? "No donations found" : "Donations found successfully",
      total,
      data: donations,
    });
  } catch(error) {
    res.status(500).json({
      message: "Server error getting donations",
      error: error.message,
    });
  }
};

exports.getSentDonations = async (req, res) => {
  /* #swagger.tags = ['Donation']
   #swagger.description = 'Get all donations by a student.'
   */
  try {
    const {donorId} = req.params;
    const donations = await paymentModel
      .find({senderId: donorId})
      .populate("senderId");
    const total = donations.length;
    res.status(200).json({
      message: total < 1 ? "No donations yet" : "Donations found successfully",
      total,
      data: donations,
    });
  } catch(error) {
    res.status(500).json({
      message: "Server error getting donations",
      error: error.message,
    });
  }
};

exports.getCampaignDonationBalance = async (req, res) => {
  /* #swagger.tags = ['Donation']
   #swagger.description = 'Get total donations for a campaign.'
   */
  try {
    const {campaignId} = req.params;
    const donations = await paymentModel
      .find({campaignId, status: "successful"})
      .populate("senderId");
    const totalDonation = donations.reduce(
      (acc, donation) => acc + donation.amount,
      0
    );
    const total = donations.length;
    res.status(200).json({
      message: total < 1 ? "No donations yet" : "Donations found successfully",
      total,
      balance: totalDonation,
      data: donations,
    });
  } catch(error) {
    res.status(500).json({
      message: "Server error getting donations",
      error: error.message,
    });
  }
};

exports.getStudentWalletBalance = async (req, res) => {
  /* #swagger.tags = ['Donation']
   #swagger.description = 'Get student wallet ballance.'
   */
  try {
    const {studentId} = req.params;
    const donations = await paymentModel
      .find({receiverId: studentId, status: "successful"})
      .populate("senderId");
    const totalDonation = donations.reduce(
      (acc, donation) => acc + donation.amount,
      0
    );
    const total = donations.length;
    res.status(200).json({
      message: total < 1 ? "No donations yet" : "Donations found successfully",
      total,
      balance: totalDonation,
      data: donations,
    });
  } catch(error) {
    res.status(500).json({
      message: "Server error getting student wallet",
      error: error.message,
    });
  }
};

exports.getAllDonations = async (req, res) => {
  /* #swagger.tags = ['Donation']
   #swagger.description = 'Get all donations.'
   */
  try {
    const donations = await paymentModel.find().populate("senderId receiverId campaignId");
    const total = donations.length;
    res.status(200).json({
      message: total < 1 ? "No donations yet, donate and help a student today" : "Donations found successfully",
      total,
      data: donations,
    });
  } catch(error) {
    res.status(500).json({
      message: "Server error getting donations",
      error: error.message,
    });
  }
};
