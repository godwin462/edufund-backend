const campaignRouter = require('express').Router();

const {createCampaign, deleteCampaign, getStudentCampaigns, getAllCampaigns, getCampaign, updateCampaign} = require('../controllers/campaignController');

const {isAuthenticated} = require("../middleware/authenticationMiddleware");

const {studentAccess} = require("../middleware/roleMiddleware");

const upload = require("../middleware/multerMiddleware");

campaignRouter.get('/', isAuthenticated, getAllCampaigns);

campaignRouter.get('/:studentId', isAuthenticated, studentAccess, getStudentCampaigns);

campaignRouter.post('/:studentId', upload.single('campaignImage'), isAuthenticated, studentAccess, createCampaign);

campaignRouter.get('/campaign-detail/:campaignId', isAuthenticated, getCampaign);

campaignRouter.put('/:campaignId', upload.single('campaignImage'), isAuthenticated, studentAccess, updateCampaign);

campaignRouter.delete('/:campaignId', isAuthenticated, studentAccess, deleteCampaign);

module.exports = campaignRouter;