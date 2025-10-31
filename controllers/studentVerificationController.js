const StudentVerificationModel = require("../models/studentVerificationModel");
const UserModel = require("../models/userModel");
const {cloudinaryUpload, cloudinaryDelete} = require("../utils/cloudinaryUtil");

exports.createVerificationDocument = async (req, res) => {
    try {
        const {studentId} = req.params;
        const {documentType} = req.body;
        const student = await UserModel.findOne({_id: studentId});

        if(!student) {
            return res.status(404).json({message: "Student not found"});
        }
        let document;
        if(!req.file || !req.file.buffer) {
            return res.status(400).json({message: "Please provide a file"});
        }
        if(req.file.mimetype !== "application/pdf") {
            return res.status(400).json({message: "Only PDF files are allowed"});
        }

        const uploadResult = await cloudinaryUpload(req.file.buffer);
        console.log(uploadResult);
        document = {
            secureUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
        };
        const payloadObject = {studentId, document, documentType, documentType};

        const verificationDocument = await StudentVerificationModel.create(payloadObject);
        res.status(200).json({message: "Verification document created successfully", data: verificationDocument});
    } catch(error) {
        console.log(error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

exports.getAllStudentsVerificationDocuments = async (req, res) => {
    try {
        const studentVerificationDocuments = await StudentVerificationModel.find({}).populate("studentId");
        const total = studentVerificationDocuments.length;
        res.status(200).json({message: total < 1 ? "No documents found" : "Documents fetched successfully", total, data: studentVerificationDocuments});
    } catch(error) {
        console.log(error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

exports.deleteStudentVerificationDocument = async (req, res) => {
    try {
        const {documentId} = req.params;
        const studentVerificationDocument = await StudentVerificationModel.findOneAndDelete({_id: documentId}, {new: true});
        if(!studentVerificationDocument) {
            return res.status(404).json({message: "Document not found"});
        }
        if(studentVerificationDocument.document && studentVerificationDocument.document.publicId)
            await cloudinaryDelete(studentVerificationDocument.document.publicId);
        res.status(200).json({message: "Document deleted successfully", data: studentVerificationDocument});
    } catch(error) {
        console.log(error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};