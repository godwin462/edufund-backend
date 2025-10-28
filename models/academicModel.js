const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
    studentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    schoolName: {
        type: String,
        rquired: true,
        trim: true
    },
    year: {
        type: Number,
        required: true
    },
    matricNumber: {
        type: Number,
        required: true,
    },
    jambRegistrationNumber: {
        type: Number,
        required: true,
        trim: true
    }},
    { timestamps: true

    });

const academicModel = mongoose.model('Academic', academicSchema);

module.exports = academicModel;
