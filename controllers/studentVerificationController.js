const StudentVerificationModel = require("../models/studentVerificationModel");
const UserModel = require("../models/userModel");
const {
  cloudinaryUpload,
  cloudinaryDelete,
} = require("../utils/cloudinaryUtil");

exports.createVerificationDocument = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await UserModel.findOne({ _id: studentId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (student.role !== "student") {
      return res.status(403).json({ message: "User is not a student" });
    }

    if (!req.files) {
      return res.status(400).json({
        message:
          "Verification documents must not be empty. Please provide at least the required ones.",
      });
    }
    const previousVerification = await StudentVerificationModel.find({
      studentId,
    });
    if (previousVerification.length > 0) {
      if (previousVerification.length >= 5) {
        return res.status(400).json({
          message:
            "Documents already uploaded, please wait fro verification or change documents",
        });
      }
      const uploadedDocumentTYpes = previousVerification.map(
        (doc) => doc.documentType
      );
      const duplicatedDocuments = Object.keys(req.files).filter((field) =>
        uploadedDocumentTYpes.includes(field)
      );
      if (duplicatedDocuments.length > 0) {
        return res.status(400).json({
          message: `${duplicatedDocuments.join(
            ", "
          )} have already been uploaded, please avoid duplicates uploads.`,
        });
      }
    }

    if (!req.files.admissionLetter) {
      return res.status(400).json({
        message:
          "Admission letter is required, please provide admission letter",
      });
    }
    if (!req.files.studentIdCard) {
      return res.status(400).json({
        message: "Student ID card is required, please provide student ID card",
      });
    }
    if (!req.files.nin) {
      return res
        .status(400)
        .json({ message: "NIN is required, please provide NIN" });
    }

    const files = Object.values(req.files).flat();

    for (const file of files) {
      if (file.mimetype !== "application/pdf") {
        return res.status(400).json({
          message:
            "Only PDF files are allowed, please ensure all files are PDF",
        });
      }
    }

    const uploadPromises = Object.keys(req.files).map(async (field) => {
      const file = req.files[field][0];
      const uploadResult = await cloudinaryUpload(file.buffer);
      const document = {
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
      const payloadObject = { studentId, document, documentType: field };
      return StudentVerificationModel.create(payloadObject);
    });

    const verificationDocuments = await Promise.all(uploadPromises);

    res.status(200).json({
      message: "Verification documents created successfully",
      data: verificationDocuments,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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
    const { studentId } = req.params;
    const student = await UserModel.findOne({
      _id: studentId,
      role: "student",
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        message: "At least one file is required for update.",
        error: "No file uploaded",
      });
    }

    const updatedDocuments = [];

    for (const field in req.files) {
      const file = req.files[field][0];

      if (file.mimetype !== "application/pdf") {
        return res.status(400).json({
          message: "Only PDF files are allowed",
          error: `Invalid file type for ${field}`,
        });
      }

      const existingDocument = await StudentVerificationModel.findOne({
        studentId,
        documentType: field,
      });

      if (!existingDocument) {
        // As per instruction "updating exiting file and not creating new ones"
        // We will not create a new one, just ignore it.
        // Or we can send a message to the user.
        console.log(
          `No document found for type ${field} for student ${studentId}. Skipping.`
        );
        continue;
      }

      if (
        existingDocument &&
        existingDocument.document &&
        existingDocument.document.publicId
      ) {
        await cloudinaryDelete(existingDocument.document.publicId);
      }

      const uploadResult = await cloudinaryUpload(file.buffer);
      const document = {
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };

      const updatedDocumentRecord =
        await StudentVerificationModel.findByIdAndUpdate(
          existingDocument._id,
          { document, documentType: field },
          { new: true }
        );

      updatedDocuments.push(updatedDocumentRecord);
    }

    if (updatedDocuments.length === 0) {
      return res.status(404).json({
        message: "No matching documents found to update.",
      });
    }

    res.status(200).json({
      message: "Documents updated successfully",
      data: updatedDocuments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error, failed to update documents",
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
