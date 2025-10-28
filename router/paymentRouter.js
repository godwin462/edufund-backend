const {
  makeDonation,
  verifyPaymentWebHook,
  withdrawDonation,
} = require("../controllers/paymentController");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const { studentAccess } = require("../middleware/roleMiddleware");

const paymentRouter = require("express").Router();

paymentRouter.post(
  "/make-donation/:donorId/:receiverId",
  isAuthenticated,
  makeDonation
);
paymentRouter.post("/verify-payment-webhook", verifyPaymentWebHook);
paymentRouter.post(
  "/request-withdrawal/:donorId/:campaignId",
  isAuthenticated,
  studentAccess,
  withdrawDonation
);

module.exports = paymentRouter;
