const {
  getReceivedDonations,
  getOneReceivedDonation,
  getCampaignDonations,
} = require("../controllers/receivedDonationController");

const receivedDonationRouter = require("express").Router();
receivedDonationRouter.get("/:studentId", getReceivedDonations);
receivedDonationRouter.get(
  "/donation-detail/:reference",
  getOneReceivedDonation
);
receivedDonationRouter.get("/campaign-donations/:campaignId", getCampaignDonations);

module.exports = receivedDonationRouter;
