const PaymentModel = require("../models/paymentModel");
const UserModel = require("../models/userModel");
const campaignModel = require("../models/campaignModel");
const StudentVerificationModel = require("../models/studentVerificationModel");
const NotificationModel = require("../models/notificationModel");
const { createNotification } = require("./notificationController");

exports.adminOverview = async (req, res) => {
  try {
    const { adminId } = req.params;
    const donor = await UserModel.findById(adminId)
      .populate("academicDocuments")
      .lean({ virtuals: true });
    if (!donor) {
      return res.status(404).json({
        message: "Donor not found, please login or create a donor account",
      });
    }
    let totalDonated = await PaymentModel.find({
      status: "successful",
    });
    let withdrawnDonations = await PaymentModel.find({
      status: "withdrawn",
    });

    const activeCampaigns = await campaignModel
      .find({ isActive: true })
      .populate("donations")
      .exec();
    let recentDonations = await PaymentModel.find({
      senderId: adminId,
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
      senderId: adminId,
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
    let studentsHelped = await PaymentModel.find({
      senderId: adminId,
      status: "successful",
    }).distinct("receiverId");
    studentsHelped = studentsHelped.concat(
      await PaymentModel.find({
        senderId: adminId,
        status: "withdrawn",
      }).distinct("receiverId")
    );
    studentsHelped = new Set(studentsHelped).size;
    totalDonated =
      totalDonated?.reduce((acc, donation) => acc + donation.amount, 0) || 0;
    totalDonated += withdrawnDonations.reduce(
      (acc, donation) => acc + donation.amount,
      0
    );
    // const stats = [
    //   `₦${totalDonated.toLocaleString()}`,
    //   studentsHelped,
    //   activeCampaigns.length,
    //   `${94}%`,
    // ];
    const totalUsers = await UserModel.find({});
    const totalStudents = await UserModel.find({
      role: "student",
    });
    const totalDonors = await UserModel.find({
      role: "sponsor",
    });
    const schools = 332;
    const recentActivities = await NotificationModel.find().sort({
      createdAt: -1,
    });
    /* -------------------------- */
    const donationsByMonth = await PaymentModel.aggregate([
      {
        $match: {
          createdAt: {
            // Optional: limit to last 6 months
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          count: 1,
        },
      },
    ]);
    console.log(donationsByMonth);
    /* -------------------------- */

    const data = {
      totalUsers: totalUsers.length,
      totalStudents: totalStudents.length,
      totalDonors: totalDonors.length,
      schools,
      donor,
      // stats,
      activeCampaigns: activeCampaigns.length,
      recentActivities,
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

exports.approveCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await campaignModel.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    await campaignModel.updateOne({
      _id: campaignId,
      isActive: true,
    });
    await createNotification(
      campaign.studentId,
      `Your campaign have successfully been reviewed and approved by the Admin`,
      campaignId,
      "success"
    );
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
    let student = await UserModel.findById(studentId);

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
    student = await UserModel.findByIdAndUpdate(
      studentId,
      { isFullyVerifiedStudent: true },
      { new: true }
    );
    await createNotification(
      studentId,
      `Your educational documents have been verified successfully by the Admin`,
      studentId,
      "success"
    );
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
