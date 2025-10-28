const paymentModel = require("../models/paymentModel");

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
  try {
    const donations = await paymentModel.find();
    if (!donations) {
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

exports.donors = async (req, res) => {
  try {
    const donators = await f;
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error getting all donators: ${error.message}` });
  }
};
