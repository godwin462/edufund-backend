const {
  makeDonation,
  verifyPaymentWebHook,
} = require("../controllers/paymentController");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const paymentRouter = require("express").Router();

paymentRouter.post(
  "/make-donation/:donorId/:receiverId",
  isAuthenticated,
  makeDonation
);
paymentRouter.get(
  "/verify-payment-webhook",
  verifyPaymentWebHook
);

module.exports = paymentRouter;
