const {
  getReceivedDonations, getOneReceivedDonation, getCampaignDonations, getCampaignDonationBalance, getStudentWalletBalance,
  getAllDonations, } = require("../controllers/donationController");
const {isAuthenticated} = require("../middleware/authenticationMiddleware");

const receivedDonationRouter = require("express").Router();

receivedDonationRouter.get("/", getAllDonations);
receivedDonationRouter.get("/received-donations/:studentId", isAuthenticated, getReceivedDonations);
receivedDonationRouter.get("/received-donations/donation-detail/:reference", isAuthenticated, getOneReceivedDonation);
receivedDonationRouter.get("/received-donations/student-balance/:studentId", isAuthenticated, getStudentWalletBalance);
receivedDonationRouter.get("/received-donations/campaign-balance/:campaignId", isAuthenticated, getCampaignDonationBalance);
receivedDonationRouter.get("/received-donations/campaign-donations/:campaignId", isAuthenticated, getCampaignDonations);

module.exports = receivedDonationRouter;
