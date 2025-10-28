const {createCampaign,
deleteCampaign} = require('../controllers/campaignController');

const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const campaignRouter = require('express').Router();

campaignRouter.post('/:studentId', isAuthenticated, createCampaign);

campaignRouter.delete('/:campaignId', isAuthenticated, deleteCampaign);

module.exports = campaignRouter;