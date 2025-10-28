const campaignModel = require('../models/campaignModel');

// Create a new campaign
exports.createCampaign = async (req, res) => {
  /*
  #swagger.tags = ['Campaign']
  #swagger.description = 'Create a new Campaign.'
  */
    try {
        const { studentId } = req.params;
        const { title, target, story, campaignImage, isActive } = req.body;

        const newCampaign = new campaignModel({
            studentId,
            title,
            target,
            story,
            campaignImage,
            isActive
        });
        const savedCampaign = await newCampaign.save();
        res.status(201).json({
            message: 'Campaign created successfully',
            campaign: savedCampaign
        });
    } catch (error) {
        res.status(500).json({
            messaage: 'Error creating campaign',
            error: error.message
        })
    }
}

exports.deleteCampaign = async (req, res) => {
  /*
  #swagger.tags = ['Campaign']
  #swagger.description = 'Delete a Campaign.'
  */
    try {
        const { campaignId } = req.params;
        const deletedCampaign = await campaignModel.findByIdAndDelete(campaignId);

        if (!deletedCampaign) {
            return res.status(404).json({
                message: 'Campaign not found'
            });
        }
        res.status(200).json({
            message: 'Campaign deleted successfully',
            campaign: deletedCampaign
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting campaign',
            error: error.message
        })
    }
}