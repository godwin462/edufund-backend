const academicModel = require('../models/academicModel')

// Create a new academic record
exports.createAcademicDetails = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { schoolName, year, matricNumber, jambRegistrationNumber } = req.body;
        const newAcademicDetails = new academicModel({
            studentId,
            schoolName,
            year,
            matricNumber,
            jambRegistrationNumber
        })
        const savedAcademicDetails = await newAcademicDetails.save();
        res.status(201).json({
            message: 'Academic details created successfully',
            academicDetails: savedAcademicDetails
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error creating academic details',
            error: error.message
        })
    }
}

exports.getAcademicDetails = async (req, res) => {
    try {
        const { studentId } = req.params
        const academicDetails = await academicModel.find({studentId});
        res.status(200).json({
            message: 'Academic details fetched successsfully',
            data: academicDetails
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching academic details',
            error: error.message
        });
    }
}

exports.updateAcademicDetails = async (req, res) => {
    try {
        const { academicDetailsId } = req.params;
        const { schoolName, year, matricNumber, jambRegistrationNumber } = req.body;
         
        const updatedAcademicDetails = await academicModel.findByIdAndUpdate(
            academicDetailsId,
            {
                schoolName,
                year,
                matricNumber,
                jambRegistrationNumber
            },
            { new: true }
        );
        if (!updatedAcademicDetails) {
            return res.status(404).json({
                message: 'Academic details not found'
            });
        }
        res.status(200).json({
            message: 'Academic details updated successfully',
            academicDetails: updatedAcademicDetails
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating academic details',
            error: error.message
        })
    }
}


// exports.deleteAcademicDetails = async (req, res)=> {
//     try {
//         const { academicDetails } = req.params;
//         const deletedAcademicDetails = await academicModel.findByIdAndDelete(academicDetails);

//         if (!deletedAcademicDetails) {
//             return res.status(404).json({
//                 message: 'Academic details not found'
//             });
//         }
//         res.status(200).json({
//             message: 'Academic details deleted successfully',
//             academicDetails: deletedAcademicDetails
//         })
//     } catch (error) {
//         res.status(500).json({
//             message: 'Error deleting academic details',
//             error: error.message
//         })
//     }
// }
