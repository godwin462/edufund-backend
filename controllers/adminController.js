const adminModel = require("../models/adminModel");
const campaignModel = require("../models/campaignModel");
const cloudinaryDelete = require("../utils/cloudinaryUtil");
const bcrypt = require("bcrypt");

exports.getAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find();
    res
      .status(200)
      .json({ message: "Admins retrieved successfully", data: admins });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve admins" });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await adminModel.findById(id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res
      .status(200)
      .json({ message: "Admin retrieved successfully", data: admin });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve admin" });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedAdmin = await adminModel.findByIdAndUpdate(
      id,
      { firstName, lastName, email, password: hashedPassword },
      { new: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res
      .status(200)
      .json({ message: "Admin updated successfully", data: updatedAdmin });
  } catch (error) {
    res.status(500).json({ error: "Failed to update admin" });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdmin = await adminModel.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    const image = await cloudinaryDelete(deletedAdmin.profilePicture.publicId);
    res.status(200).json({
      message: "Admin deleted successfully",
      data: `${deletedAdmin} ${image}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete admin" });
  }
};

exports.verifyCampaigns = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await campaignModel.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    campaign.status = "verified";
    await campaign.save();
    res
      .status(200)
      .json({ message: "Campaign verified successfully", data: campaign });
  } catch (error) {
    res.status(500).json({ error: "Error verifying campaign" });
  }
};

exports.unverifyCampaigns = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await campaignModel.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    campaign.status = "unverified";
    await campaign.save();
    res
      .status(200)
      .json({ message: "Campaign unverified successfully", data: campaign });
  } catch (error) {
    res.status(500).json({ error: "Error unverifying campaign" });
  }
};

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignModel.find();
    res
      .status(200)
      .json({ message: "Campaigns retrieved successfully", data: campaigns });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving campaigns" });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await campaignModel.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    res
      .status(200)
      .json({ message: "Campaign retrieved successfully", data: campaign });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving campaign" });
  }
};

exports.getVerifiedCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignModel.find({ status: "verified" });
    res.status(200).json({
      message: "Verified campaigns retrieved successfully",
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving verified campaigns" });
  }
};
exports.getUnverifiedCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignModel.find({ status: "unverified" });
    res.status(200).json({
      message: "Unverified campaigns retrieved successfully",
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving unverified campaigns" });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const deletedCampaign = await campaignModel.findByIdAndDelete(campaignId);
    if (!deletedCampaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    res.status(200).json({
      message: "Campaign deleted successfully",
      data: deletedCampaign,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete campaign" });
  }
};
