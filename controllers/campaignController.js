const campaignModel = require('../models/campaignModel');
const { cloudinaryUpload, cloudinaryDelete } = require('../utils/cloudinaryUtil');

// Create a new campaign
exports.createCampaign = async (req, res) => {
  /*
  #swagger.tags = ['Campaign']
  #swagger.description = 'Create a new Campaign.'
  */
    try {
        const { studentId } = req.params;
        const { title, target, story, campaignImage, isActive } = req.body || {};
        let file = null;

        if (req.file && req.file.buffer) {
            file = await cloudinaryUpload(file.buffer);
            campaignImage = {
                imageUrl: file.secure_url,
                publicId: file.public_id
            };
        }

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

exports.updateCampaign = async (req, res) => {
  /*
  #swagger.tags = ['Campaign']
  #swagger.description = 'Create a new Campaign.'
  */
    try {
        const { campaignId } = req.params;
        const { title, target, story, campaignImage, isActive } = req.body || {};
        const updatedCampaign = await campaignModel.findByIdAndUpdate(
            campaignId,
            { title, target, story, campaignImage, isActive },
            { new: true }
        );
        if (!updatedCampaign) {
            return res.status(404).json({
                message: 'Campaign not found'
            });
        }
        res.status(200).json({
            message: 'Campaign updated successfully',
            campaign: updatedCampaign
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating campaign',
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
        cloudinaryDelete(deleteCampaign.campaignImage.publicId);
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
