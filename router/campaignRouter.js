const {createCampaign,
deleteCampaign} = require('../controllers/campaignController');

const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const { studentAccess } = require("../middleware/roleMiddleware");

const campaignRouter = require('express').Router();

campaignRouter.post('/:studentId', isAuthenticated, studentAccess,  createCampaign);

campaignRouter.delete('/:campaignId', isAuthenticated, studentAccess,  deleteCampaign);

module.exports = campaignRouter;