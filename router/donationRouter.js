const {
  getReceivedDonations,
  getOneReceivedDonation,
  getCampaignDonations,
  getCampaignDonationBalance,
  getStudentWalletBalance,
} = require("../controllers/donationController");

const receivedDonationRouter = require("express").Router();
receivedDonationRouter.get("/:studentId", getReceivedDonations);
receivedDonationRouter.get(
  "/donation-detail/:reference",
  getOneReceivedDonation
);
receivedDonationRouter.get(
  "/student-balance/:studentId",
  getStudentWalletBalance
);
receivedDonationRouter.get(
  "/campaign-balance/:campaignId",
  getCampaignDonationBalance
);
receivedDonationRouter.get("/campaign-donations/:campaignId", getCampaignDonations);

module.exports = receivedDonationRouter;
