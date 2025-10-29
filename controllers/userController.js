const UserModel = require("../models/userModel");
const { hashData } = require("../utils/bcryptUtil");
const {
  cloudinaryUpload,
  cloudinaryDelete,
} = require("../utils/cloudinaryUtil");

exports.updateUser = async (req, res) => {
  /*
  #swagger.tags = ['User']
  #swagger.description = 'Update existing user.'
  #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        firstName: { type: "string" },
                        lastName: { type: "string" },
                        role: { type: "string" },
                        profilePicture: {
                            type: "string",
                            format: "binary"
                        }
                    }
                }
            }
        }
    }
  */
  try {
    const { userId } = req.params;
    const { firstName, lastName, role } = req.body || {};
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found, please create an account",
      });
    }
    let profilePicture;
    if (user.profilePicture && user.profilePicture.publicId && req.file) {
      await cloudinaryDelete(user.profilePicture.publicId);
    }
    if (req.file && req.file.buffer) {
      const uploadResult = await cloudinaryUpload(req.file.buffer);
      profilePicture = {
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.role = role ?? user.role;
    user.profilePicture = profilePicture ?? user.profilePicture;

    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error updating user",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  /*
  #swagger.tags = ['User']
  #swagger.description = 'Delete a new user.'
  */
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found, please create an account",
      });
    }

    if (user.profilePicture && user.profilePicture.publicId)
      await cloudinaryDelete(user.profilePicture.publicId);

    await UserModel.findByIdAndDelete(userId);
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error deleting user",
      error: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  /*
  #swagger.tags = ['User']
  #swagger.description = 'Get a user by  ID.'
  */
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found, please create an account",
      });
    }
    res.status(200).json({
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error getting user",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  /*
  #swagger.tags = ['User']
  #swagger.description = 'Get all users.'
  */
  try {
    const users = await UserModel.find();
    const total = users.length;
    res.status(200).json({
      message: total < 1 ? "No users found" : "Users found successfully",
      total,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error getting users",
      error: error.message,
    });
  }
};

exports.getUserByEmail = async (req, res) => {
  /*
  #swagger.tags = ['User']
  #swagger.description = 'Get a user by email.'
  */
  try {
    const { email } = req.body || {};
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found, please create an account",
      });
    }
    res.status(200).json({
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error getting user",
      error: error.message,
    });
  }
};
