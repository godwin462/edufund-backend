const campaignModel = require("../models/campaignModel");
const UserModel = require("../models/userModel");
const {
  cloudinaryUpload,
  cloudinaryDelete,
} = require("../utils/cloudinaryUtil");
const {
  createCampaignValidation,
  updateCampaignValidation,
} = require("../validations/campaignControllerValidations");

// Create a new campaign
exports.createCampaign = async (req, res) => {
  /*
    #swagger.tags = ['Campaign']
    #swagger.description = 'Create a new Campaign.'
    */
  try {
    const { studentId } = req.params;
    const { error } = createCampaignValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const { title, target, story, campaignImage } = req.body || {};
    let file = null;
    const student = await UserModel.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message:
          "Student not found, please create a student account to create campaign",
      });
    }

    const campaignIsActive = await campaignModel.findOne({
      studentId,
      isActive: true,
    });

    if (campaignIsActive) {
      return res.status(400).json({
        message:
          "You already have an active campaign, please end your current campaign before creating a new one",
      });
    }

    if (req.file && req.file.buffer) {
      file = await cloudinaryUpload(file.buffer);
      campaignImage = {
        imageUrl: file.secure_url,
        publicId: file.public_id,
      };
    }

    const newCampaign = new campaignModel({
      studentId,
      title,
      target,
      story,
      campaignImage,
    });
    await newCampaign.save();
    res.status(201).json({
      message: "Campaign created successfully",
      data: newCampaign,
    });
  } catch (error) {
    res.status(500).json({
      messaage: "Error creating campaign",
      error: error.message,
    });
  }
};

exports.deleteCampaign = async (req, res) => {
  /*
    #swagger.tags = ['Campaign']
    #swagger.description = 'Delete a Campaign.'
    */
  try {
    const { campaignId } = req.params;
    const campaign = await campaignModel.findByIdAndDelete(campaignId, {
      new: true,
    });

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }
    if (campaign.campaignImage && campaign.campaignImage.publicId)
      cloudinaryDelete(deleteCampaign.campaignImage.publicId);

    res.status(200).json({
      message: "Campaign deleted successfully",
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting campaign",
      error: error.message,
    });
  }
};

exports.getStudentCampaigns = async (req, res) => {
  /*
    #swagger.tags = ['Campaign']
    #swagger.description = 'Get all Campaigns.'
    */
  try {
    const { studentId } = req.params;
    const campaigns = await campaignModel.find({ studentId });
    const total = campaigns.length;
    res.status(200).json({
      message:
        total < 1
          ? "No campaigns yet,create to view campaigns"
          : "Campaigns found successfully",
      total,
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting campaigns",
      error: error.message,
    });
  }
};

exports.getAllCampaigns = async (req, res) => {
  /*
    #swagger.tags = ['Campaign']
    #swagger.description = 'Get a student Campaigns.'
    */
  try {
    const campaigns = await campaignModel.find().populate("studentId");
    const total = campaigns.length;
    res.status(200).json({
      message: total < 1 ? "No campaigns yet" : "Campaigns found successfully",
      total,
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting campaigns",
      error: error.message,
    });
  }
};

exports.getCampaign = async (req, res) => {
  /*
    #swagger.tags = ['Campaign']
    #swagger.description = 'Get a Campaign.'
    */
  try {
    const { campaignId } = req.params;
    const campaign = await campaignModel
      .findById(campaignId)
      .populate("studentId");
    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }
    res.status(200).json({
      message: "Campaign found successfully",
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting campaign",
      error: error.message,
    });
  }
};
