const UserModel = require("../models/userModel");
const {hashData} = require("../utils/bcryptUtil");

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const hashedPassword = hashData(password);
    const student = new UserModel({
      firstName,
      lastName,
      email,
      password:hashedPassword,
      role
    });
    await student.save();
    res.status(201).json({
      message: `${role} created successfully`,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      message: `Server error creating ${role}`,
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, password, role } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found, please create an account",
      });
    }
    Object.assign(user, {
      firstName,
      lastName,
      email,
      password,
      role
    });
    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error updating user",
      error: error.message,
    })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found, please create an account",
      });
    }
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
  try {
    const users = await UserModel.find();
    const total = users.length;
    res.status(200).json({
      message: total<1 ? "No users found" : "Users found successfully",
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
  try {
    const { email } = req.body;
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
