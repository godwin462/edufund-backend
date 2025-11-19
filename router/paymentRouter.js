const {
  makeDonation,
  verifyPaymentWebHook,
  withdrawDonation,
  withdrawWalletBalance,
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Donation initiated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     checkout_url:
 *                       type: string
 *                       example: https://checkout.korapay.com/pay/3y3i3o3i
 *       "400":
 *         description: Invalid amount or receiver is not a student.
 *       "404":
 *         description: Receiver or donor not found.
 *       "500":
 *         description: Error initializing payment.
 */
paymentRouter.post(
  "/make-donation/:donorId/:receiverId/:campaignId",
  // isAuthenticated,
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment Verification Successful
 *       "404":
 *         description: Payment not found for the given reference.
 *       "500":
 *         description: Error verifying payment.
 */
paymentRouter.post("/verify-payment-webhook", verifyPaymentWebHook);

paymentRouter.post(
  "/request-withdrawal/:studentId/:campaignId",
  isAuthenticated,
  studentAccess,
  withdrawDonation
);

/**
 * @swagger
 * /payment/withdraw-wallet-balance/{studentId}/{campaignId}:
 *   post:
 *     summary: Withdraw from wallet balance for a campaign
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
 *               amount:
 *                 type: number
 *               purpose:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Donation withdrawn initiated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Donation withdrawn initiated
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     campaignId:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     userId:
 *                       type: string
 *                       example: 60d5ec49a0d2db2a3c_dummy_id
 *                     amount:
 *                       type: number
 *                       example: 5000
 *                     purpose:
 *                       type: string
 *                       example: School fees
 *                     note:
 *                       type: string
 *                       example: Payment for 2023/2024 session
 *                     status:
 *                       type: string
 *                       example: processing
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T12:00:00.000Z
 *       "400":
 *         description: You have already withdrawn from this campaign.
 *       "404":
 *         description: Campaign not found.
 *       "500":
 *         description: Error withdrawing donation.
 */
paymentRouter.post(
  "/withdraw-wallet-balance/:studentId/:campaignId",
  isAuthenticated,
  studentAccess,
  withdrawWalletBalance
);

module.exports = paymentRouter;
