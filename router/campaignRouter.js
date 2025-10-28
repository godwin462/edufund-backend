const {createCampaign,
deleteCampaign} = require('../controllers/campaignController');
const campaignRouter = require('express').Router();

campaignRouter.post('/:studentId',createCampaign);

campaignRouter.delete('/:campaignId', deleteCampaign);

module.exports = campaignRouter;