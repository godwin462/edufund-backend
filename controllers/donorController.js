const paymentModel = require("../models/paymentModel");
const academicModel = require("../models/academicModel");

exports.totalStudentsHelped = async (req, res) => {
  /*
  #swagger.tags = ['Analytics']
  #swagger.description = 'Total number of students helped.'
  */
  try {
    const { donorId } = req.params;
    const data = await paymentModel
      .find({ senderId: donorId })
      .distinct("receiverId");
    return res
      .status(200)
      .json({ message: "Total number of students helped:", data: data.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Error getting total students helped: ${error.message}`,
    });
  }
};

exports.myDonations = async (req, res) => {
  /*
  #swagger.tags = ['myDonations']
  #swagger.description = 'All students helped.'
  */
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
  /*
  #swagger.tags = ['donors']
  #swagger.description = 'All generous supporters.'
  */
  try {
    const { studentId } = req.params;
    const donors = await academicModel.find({ studentId }).distinct("donorId");
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
