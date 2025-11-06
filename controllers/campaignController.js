const campaignModel = require("../models/campaignModel");
const PaymentModel = require("../models/paymentModel");
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
  try {
    const { studentId } = req.params;
    const { error } = createCampaignValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    let {
      schoolName,
      year,
      course,
      matricNumber,
      jambRegistrationNumber,
      duration,
      title,
      target,
      story,
    } = req.body || {};
    let file = null;
    const student = await UserModel.findOne({ _id: studentId, role: "student" })
      .populate("academicDocuments")
      .lean({ virtuals: true });

    if (!student) {
      return res.status(404).json({
        message:
          "Student not found, please create a student account to create campaign",
      });
    }

    // if (
    //   !(student.isFullyVerifiedStudent && student.academicDocuments.length < 1)
    // ) {
    //   return res.status(400).json({
    //     message:
    //       "Please upload your academic documents to get verified for campaign creation",
    //   });
    // }

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

    let campaignImage;
    if (req.file && req.file.buffer) {
      file = await cloudinaryUpload(req.file.buffer);
      campaignImage = {
        imageUrl: file.secure_url,
        publicId: file.public_id,
      };
    }

    const newCampaign = new campaignModel({
      studentId,
      schoolName,
      year,
      course,
      matricNumber,
      jambRegistrationNumber,
      duration,
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
    console.log(error);
    res.status(500).json({
      messaage: "Error creating campaign",
      error: error.message,
    });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { error } = updateCampaignValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    const { title, target, story, isActive } = req.body || {};
    let file = null;
    const campaign = await campaignModel.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
        error: error.message,
      });
    }

    let campaignImage;
    if (campaign.campaignImage && campaign.campaignImage.publicId && req.file) {
      cloudinaryDelete(campaign.campaignImage.publicId);
    }
    if (req.file && req.file.buffer) {
      file = await cloudinaryUpload(req.file.buffer);
      campaignImage = {
        imageUrl: file.secure_url,
        publicId: file.public_id,
      };
    }
    campaign.title = title ?? campaign.title;
    campaign.target = target ?? campaign.target;
    campaign.story = story ?? campaign.story;
    campaign.campaignImage = campaignImage ?? campaign.campaignImage;
    campaign.isActive = isActive ?? campaign.isActive;
    await campaign.save();

    res.status(200).json({
      message: "Campaign updated successfully",
      data: campaign,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating campaign",
      error: error.message,
    });
  }
};

exports.deleteCampaign = async (req, res) => {
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
      cloudinaryDelete(campaign.campaignImage.publicId);

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
  try {
    const { status, isActive } = req.query;
    const { studentId } = req.params;
    const campaigns = await campaignModel
      .find({ studentId})
      .populate("studentId donations")
      .exec();
    const total = campaigns.length;
    res.status(200).json({
      message:
        total < 1
          ? "No campaigns yet, create to view campaigns"
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
  try {
    const campaigns = await campaignModel
      .find()
      .populate("studentId donations")
      .exec();
    const total = campaigns.length;
    res.status(200).json({
      message: total < 1 ? "No campaigns yet" : "Campaigns found successfully",
      total,
      data: campaigns,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting campaigns",
      error: error.message,
    });
  }
};

exports.getCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await campaignModel
      .findById(campaignId)
      .populate("studentId donations").exec();
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
