const {
  getReceivedDonations,
  getOneReceivedDonation,
  getCampaignDonations,
  getCampaignDonationBalance,
  getStudentWalletBalance,
} = require("../controllers/donationController");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const receivedDonationRouter = require("express").Router();
receivedDonationRouter.get(
  "/:studentId",
  isAuthenticated,
  getReceivedDonations
);
receivedDonationRouter.get(
  "/donation-detail/:reference",
  isAuthenticated,
  getOneReceivedDonation
);
receivedDonationRouter.get(
  "/student-balance/:studentId",
  isAuthenticated,
  getStudentWalletBalance
);
receivedDonationRouter.get(
  "/campaign-balance/:campaignId",
  isAuthenticated,
  getCampaignDonationBalance
);
receivedDonationRouter.get(
  "/campaign-donations/:campaignId",
  isAuthenticated,
  getCampaignDonations
);

module.exports = receivedDonationRouter;
