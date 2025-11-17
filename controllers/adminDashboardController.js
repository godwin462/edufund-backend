const PaymentModel = require("../models/paymentModel");
const UserModel = require("../models/userModel");
const campaignModel = require("../models/campaignModel");
const StudentVerificationModel = require("../models/studentVerificationModel");
const NotificationModel = require("../models/notificationModel");

exports.approveCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await campaignModel.findById(
      campaignId);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    await campaignModel.updateOne({
      _id: campaignId,
      isActive: true
    })

    return res.status(200).json({
      message: "Campaign approved successfully",
      data: campaign,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error approving campaign",
      error: error.message,
    });
  }
};

exports.verifyStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await UserModel.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (student.role !== "student") {
      return res.status(400).json({
        message: "User is not a student",
      });
    }

    if (student.isFullyVerifiedStudent) {
      return res.status(400).json({
        message: "Student has already been verified",
      });
    }

    // student.isFullyVerifiedStudent = true;
    // await student.save();
    await UserModel.updateOne({ _id: studentId }, { isFullyVerifiedStudent: true });

    return res.status(200).json({
      message: "Student verified successfully",
      data: student,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error verifying student",
      error: error.message,
    });
  }
};
