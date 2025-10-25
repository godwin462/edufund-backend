const userModel = require("../models/userModel");
const paymentModel = require("../models/paymentModel");
const axios = require("axios");
const reference = require("crypto").randomBytes(16).toString("hex");

exports.makeDonation = async (req, res) => {
  /* #swagger.tags = ['Payment']
   #swagger.description = 'Make a donation.'
   */
  try {
    const { donorId, receiverId } = req.params;
    const { amount } = req.body;
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        message: "Please provide a valid donation amount",
      });
    }

    const receiver = await userModel.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found, please create an account",
      });
    }
    if (receiver.role !== "student") {
      return res.status(400).json({
        message: "Receiver not a student, donation not allowed",
      });
    }
    const donor = await userModel.findById(donorId);

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found, please create an account to make donation",
      });
    }

    const payload = {
      amount: amount,
      currency: "NGN",
      reference,
      customer: {
        email: donor.email,
        name: donor.fullName,
      },
    };
    console.log(process.env.KORA_SECRET_KEY);
    const url = "https://api.korapay.com/merchant/api/v1/charges/initialize";
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      return res.status(500).json({
        message: "Error initializing payment",
        error: response.data,
      });
    }

    console.log(response.data);

    const transaction = await paymentModel.create({
      senderId: donorId,
      receiverId,
      amount,
      reference,
    });

    if (!transaction) {
      return res.status(500).json({
        message: "Error creating transaction",
      });
    }
    return res.status(200).json({
      message: "Donation test successfully",
      data: response.data.data.checkout_url,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error initializing payment: " + error.message,
      error: error.response?.data,
    });
  }
};

exports.verifyPaymentWebHook = async (req, res) => {
  /* #swagger.tags = ['Payment']
   #swagger.description = 'Verify payment webhook note: will be called by KoraPay won't work on swagger ui.'
   */
  try {
    const { event, data } = req.body;
    if (event === "charge.success") {
      const payment = await paymentModel.findOne({ reference: data.reference });
      if (!payment) {
        return res.status(404).json({
          message: "Payment not found",
        });
      }
      payment.status = "Successful";
      await payment.save();
      res.status(200).json({
        message: "Payment Verified Successfully",
      });
    } else if (event === "charge.failed") {
      const payment = await paymentModel.findOne({ reference: data.reference });
      if (!payment) {
        return res.status(404).json({
          message: "Payment not found",
        });
      }
      payment.status = "Failed";
      await payment.save();
      res.status(200).json({
        message: "Payment Failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error verifying payment: " + error.message,
    });
  }
};
