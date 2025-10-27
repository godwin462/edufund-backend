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
    const { amount, redirect_url } = req.body;
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

    const transaction = await paymentModel.create({
      senderId: donorId,
      receiverId,
      amount,
      reference,
      redirect_url: req.url,
    });

    if (!transaction) {
      return res.status(500).json({
        message: "Error creating transaction",
      });
    }
    return res.status(200).json({
      message: "Donation test successfully",
      data: response.data.data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error initializing payment: " + error.message,
      error: error.response,
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
      console.log("Payment verification successful");
      payment.status = "successful";
      await payment.save();
      res.status(200).json({
        message: "Payment Verification Successful",
      });
    } else if (event === "charge.failed") {
      const payment = await paymentModel.findOne({ reference: data.reference });
      if (!payment) {
        return res.status(404).json({
          message: "Payment not found",
        });
      }
      payment.status = "failed";
      console.log('Payment verification failed')
      await payment.save();
      res.status(200).json({
        message: "Payment Failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error verifying payment: " + error.message,
    });
  }
};
