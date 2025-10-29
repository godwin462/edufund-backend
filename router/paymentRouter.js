const {
  makeDonation,
  verifyPaymentWebHook,
  withdrawDonation,
} = require("../controllers/paymentController");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const { studentAccess } = require("../middleware/roleMiddleware");

const paymentRouter = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment and withdrawal endpoints
 */

/**
 * @swagger
 * /payment/make-donation/{donorId}/{receiverId}/{campaignId}:
 *   post:
 *     summary: Initiate a donation to a campaign
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: donorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user making the donation.
 *       - in: path
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student receiving the donation.
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the campaign being donated to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       "200":
 *         description: Donation initiated successfully. Returns payment link.
 *       "400":
 *         description: Invalid amount or receiver is not a student.
 *       "404":
 *         description: Receiver or donor not found.
 *       "500":
 *         description: Error initializing payment.
 */
paymentRouter.post(
  "/make-donation/:donorId/:receiverId/:campaignId",
  isAuthenticated,
  makeDonation
);

/**
 * @swagger
 * /payment/verify-payment-webhook:
 *   post:
 *     summary: Webhook to verify payment status from payment provider (KoraPay)
 *     tags: [Payments]
 *     description: This endpoint is called by the payment provider (KoraPay) to update the status of a transaction. It should not be called directly.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 example: charge.success
 *               data:
 *                 type: object
 *                 properties:
 *                   reference:
 *                     type: string
 *     responses:
 *       "200":
 *         description: Webhook received and payment status updated.
 *       "404":
 *         description: Payment not found for the given reference.
 *       "500":
 *         description: Error verifying payment.
 */
paymentRouter.post("/verify-payment-webhook", verifyPaymentWebHook);

/**
 * @swagger
 * /payment/request-withdrawal/{studentId}/{campaignId}:
 *   post:
 *     summary: Request a withdrawal for a campaign that has met its target
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student requesting the withdrawal.
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the campaign to withdraw from.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               purpose:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Withdrawal request successful. Returns redirect URL.
 *       "400":
 *         description: Campaign target not met.
 *       "404":
 *         description: Campaign not found.
 *       "500":
 *         description: Error processing withdrawal.
 */
paymentRouter.post(
  "/request-withdrawal/:studentId/:campaignId",
  isAuthenticated,
  studentAccess,
  withdrawDonation
);

module.exports = paymentRouter;
