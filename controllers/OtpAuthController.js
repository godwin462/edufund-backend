const UserModel = require("../models/userModel");
const registrationTemplate = require("../templates/registrationTemplate");
const loginOtpTemplate = require("../templates/loginOtpTemplate");
const OtpModel = require("../models/OtpModel");
const {sendEmail} = require("../email/brevo");
const constants = require("../utils/constants");
const {generateOtp} = require("../utils/otp");
const {generateJwt, verifyJwt, decodeJwt} = require("../utils/jwtUtil");
const {cloudinaryUpload} = require("../utils/cloudinaryUtil");
const {compareData, hashData} = require("../utils/bcryptUtil");
const {
    registerValidation,
    loginValidation,
    verifyOtpValidation,
    resendOtpValidation,
    changePasswordValidation
} = require("../validations/authControllerValidations");

exports.register = async (req, res) => {
    /*
      #swagger.tags = ['Authentication']
      #swagger.description = 'Register user account.'
      */
    let file = null;
    try {
        const {error} = registerValidation.validate(req.body);
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }
        const {firstName, lastName, email, role, password, phoneNumber} = req.body;

        const existingEmail = await UserModel.findOne({email});

        if (existingEmail) {
            return res
                .status(400)
                .json({message: "User with the credentials already exists"});
        }
        let profilePicture;

        if (req.file && req.file.buffer) {
            file = await cloudinaryUpload( req.file.buffer);
            profilePicture = {
                imageUrl: file.secure_url,
                publicId: file.public_id
            };
        }

        const hashedPassword = hashData(password);
        const user = new UserModel({
            firstName,
            lastName,
            email,
            phoneNumber,
            role,
            profilePicture,
            password: hashedPassword
        });

        let otp = generateOtp();

        const text = `EduFunds Account verification`;
        const html = registrationTemplate(otp);
        await sendEmail({
            email,
            subject: "EduFunds Account Registration",
            text,
            html
        });

        otp = await generateJwt({otp}, constants.otp_expiry);

        await OtpModel.deleteMany({userId: user._id}); // Delete previous OTPs
        await OtpModel.create({
            userId: user._id,
            otp
        });
        user.password = undefined;

        await user.save();
        res.status(201).json({
            message: "OTP sent successfully, check your email to verify your account",
            data: user
        });
    } catch (error) {
        console.log(error);
        // if (file && file.path) fs.unlinkSync(file.path);
        res
            .status(500)
            .json({message: "Internal Server Error", error: error.message});
    }
};

exports.login = async (req, res) => {
    /*
      #swagger.tags = ['Authentication']
      #swagger.description = 'Login user account.'
      */
    try {
        const {error} = loginValidation.validate(req.body);
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }
        const {email, password} = req.body;

        const user = await UserModel.findOne({email}).select("+password");

        if (!user) {
            return res.status(404).json({
                message:
                    "User not found, please check your credentials or create an account"
            });
        }

        if (!user.isVerified) {
            return res.status(500).json({
                message: "User not verified, please verify account to continue"
            });
        }

        if (!compareData(password, user.password)) {
            return res
                .status(400)
                .json({message: "Please provide a valid account password"});
        }


        const token = await generateJwt({id: user._id}, "1d");
        user.password = undefined;
        req.user = user;
        res
            .status(200)
            .json({message: "Success, user logged in", token, data: user});
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({message: "Internal Server Error", error: error.message});
    }
};

exports.verifyOtp = async (req, res) => {
    /*
      #swagger.tags = ['Authentication']
      #swagger.description = 'Verify OTP for user account.'
    */
    try {
        const {error} = verifyOtpValidation.validate({...req.body, ...req.params});
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }
        const {otp} = req.body;
        const {email} = req.params;

        const user = await UserModel.findOne({email});

        if (!user) {
            return res
                .status(404)
                .json({message: "User not found, please create an account"});
        }
        if (user.isVerified) {
            return res
                .status(400)
                .json({message: "user already verified, please login to continue"});
        }
        const dbOtp = await OtpModel.findOne({userId: user._id});
        // console.log(dbOtp);

        if (!dbOtp) {
            return res.status(400).json({message: "Invalid OTP, please request for a new one"});
        }

        const isValidOtp = await verifyJwt(dbOtp.otp);
        if (!isValidOtp.otp) {
            return res.status(400).json({message: "Invalid OTP, please ensure to get the correct token from your email"});
        }
        const decodeOtp = await decodeJwt(dbOtp.otp);
        // console.log(decodeOtp);

        if (decodeOtp.otp !== otp) {
            return res.status(400).json({message: "Wrong OTP, please check your email and try again"});
        }

        user.isVerified = true;
        const token = await generateJwt({id: user._id}, "1d");
        req.user = {id: user._id};
        await user.save();

        res
            .status(200)
            .json({message: "OTP verification successful ✅", token, data: user});
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({message: "OTP expired, request new otp"});
        }
        console.log(error);
        res.status(500).json({
            message: "Internal server error verifying OTP",
            error: error.message
        });
    }
};

exports.resendOtp = async (req, res) => {
    /*
      #swagger.tags = ['Authentication']
      #swagger.description = 'Resend OTP for user account.'
      */
    try {
        const {error} = resendOtpValidation.validate(req.body);
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }
        const {email} = req.body;

        const user = await UserModel.findOne({email});

        if (!user) {
            return res
                .status(404)
                .json({message: "User not found, please create an account"});
        }

        let otp = generateOtp();

        const text = `EduFunds otp resend request`;
        const html = loginOtpTemplate(otp);
        await sendEmail({
            email: user.email,
            subject: "EduFunds Account Login",
            text,
            html
        });

        otp = await generateJwt({otp}, constants.otp_expiry);

        await OtpModel.deleteMany({userId: user._id}); // Delete previous OTPs
        await OtpModel.create({
            userId: user._id,
            otp
        });

        // console.log(otp);
        res
            .status(200)
            .json({message: "New OTP sent, check your email", data: user});
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({message: "Internal Server Error", error: error.message});
    }
};

exports.changePassword = async (req, res) => {
    /*
      #swagger.tags = ['Authentication']
      #swagger.description = 'Change authenticated user account password.'
      */
    try {
        const {error} = changePasswordValidation.validate({...req.body, ...req.params});
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }
        const {userId} = req.params;
        const {password, newPassword} = req.body;

        const user = await UserModel.findById(userId).select("+password");

        if (!user) {
            return res
                .status(404)
                .json({message: "User not found, please create an account"});
        }

        if (!user.isVerified) {
            return res
                .status(403)
                .json({message: "User not verified, please verify your account"});
        }
        if (!compareData(password, user.password)) {
            return res.status(400).json({
                message:
                    "Initial password account incorrect, please provide correct account password"
            });
        }

        if (compareData(newPassword, user.password)) {
            return res
                .status(400)
                .json({message: "New password cannot be same as old password"});
        }
        if (password === newPassword) {
            return res.status(400).json({
                message: "New password cannot be same as initial account password"
            });
        }

        user.password = hashData(newPassword);
        await user.save();
        user.password = undefined;

        res
            .status(200)
            .json({message: "Password changed successfully", data: user});
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({message: "internal server error", error: error.message});
    }
};

exports.getCurrentAuthUser = async (req, res) => {
    /*
      #swagger.tags = ['Authentication']
      #swagger.description = 'Get authenticated user'
      */
    try {
        const user = req.user;
        res.status(200).json({message: "success", data: user});
    } catch (error) {
        return res
            .status(500)
            .json({message: "internal server error", error: error.message});
    }
};
