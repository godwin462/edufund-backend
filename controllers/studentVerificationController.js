const StudentVerificationModel = require("../models/studentVerificationModel");
const UserModel = require("../models/userModel");
const {
  cloudinaryUpload,
  cloudinaryDelete,
} = require("../utils/cloudinaryUtil");

exports.createVerificationDocument = async (req, res) => {
  try {
    const { studentId } = req.params;
    // const { documentType } = req.body;
    const student = await UserModel.findOne({ _id: studentId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!req.files || req.files.length < 3) {
      return res
        .status(400)
        .json({ message: "Please provide at least 3 documents" });
    }

    const verificationDocuments = [];
    for (const file of req.files) {
      if (file.mimetype !== "application/pdf") {
        // TODO: consider deleting already uploaded files if one fails
        return res.status(400).json({ message: "Only PDF files are allowed" });
      }
    }
    for (const file of req.files) {
      const uploadResult = await cloudinaryUpload(file.buffer);
      console.log(uploadResult);
      const document = {
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
      //   const payloadObject = { studentId, document, documentType };
      const payloadObject = { studentId, document };

      const verificationDocument = await StudentVerificationModel.create(
        payloadObject
      );
      verificationDocuments.push(verificationDocument);
    }

    res.status(200).json({
      message: "Verification documents created successfully",
      data: verificationDocuments,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: a.message });
  }
};

exports.getAllStudentsVerificationDocuments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentVerificationDocuments = await StudentVerificationModel.find({
      studentId,
    }).populate("studentId");
    const total = studentVerificationDocuments.length;
    res.status(200).json({
      message:
        total < 1 ? "No documents found" : "Documents fetched successfully",
      total,
      data: studentVerificationDocuments,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.updateStudentVerificationDocuments = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        message: "Please provide a file",
        error: "Invalid file",
      });
    }
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF files are allowed",
        error: "Invalid file type",
      });
    }
    const existingDocument = await StudentVerificationModel.findById(
      documentId
    );
    if (!existingDocument) {
      return res
        .status(404)
        .json({ message: "Cannot find the document you're trying to update" });
    }
    if (
      existingDocument &&
      existingDocument.document &&
      existingDocument.document.publicId
    ) {
      await cloudinaryDelete(existingDocument.document.publicId);
    }

    const uploadResult = await cloudinaryUpload(req.file.buffer);
    let document = {
      secureUrl: uploadResult.secure_url,
      publicId: uploadResult.publicId,
    };
    const updatedDocumentRecord =
      await StudentVerificationModel.findByIdAndUpdate(
        documentId,
        { document },
        { new: true }
      );
    res.status(200).json({
      message: "Document updated successfully",
      data: updatedDocumentRecord,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteStudentVerificationDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const studentVerificationDocument =
      await StudentVerificationModel.findOneAndDelete(
        { _id: documentId },
        { new: true }
      );
    if (!studentVerificationDocument) {
      return res.status(404).json({ message: "Document not found" });
    }
    if (
      studentVerificationDocument.document &&
      studentVerificationDocument.document.publicId
    )
      await cloudinaryDelete(studentVerificationDocument.document.publicId);
    res.status(200).json({
      message: "Document deleted successfully",
      data: studentVerificationDocument,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
