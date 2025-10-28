const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    target: { type: Number,
        required: true,
    },
    story: {
        type: String,
        required: true,
        trim: true
    },
    isActive:{
        type: Boolean,
        default: true
    },
    campaignImage: {
        type: String,
        required: true,
}}, 
{ 
    timestamps: true 
});

const campaignModel = mongoose.model('Campaign', campaignSchema);  

module.exports = campaignModel;  
