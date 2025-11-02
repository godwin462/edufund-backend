const UserModel = require("../models/userModel");
const registrationTemplate = require("../templates/registrationTemplate");
const loginOtpTemplate = require("../templates/loginOtpTemplate");
const OtpModel = require("../models/OtpModel");
const {sendEmail} = require("../email/brevo");
const constants = require("../utils/constants");
const {generateOtp} = require("../utils/otp");
const {generateJwt} = require("../utils/jwtUtil");
const {compareData, hashData} = require("../utils/bcryptUtil");
const {
    registerValidation,
    loginValidation,
    resendOtpValidation,
    changePasswordValidation
} = require("../validations/authControllerValidations");
const {createNotification} = require("./notificationController");
const {AccountVerificationEmailTemplate} = require("../templates/accountVerification");
const {resetPasswordOtpEmailTemplate} = require("../templates/resetPasswordOtp");

exports.register = async (req, res) => {
    try {
        const {error} = registerValidation.validate(req.body);
        if(error) {
            return res.status(400).json({message: error.details[0].message});
        }
        const {firstName, lastName, email, role, password, phoneNumber, sponsorType, organizationName} = req.body || {};

        const existingEmail = await UserModel.findOne({email});

        if(existingEmail) {
            return res
                .status(400)
                .json({message: "User with the credentials already exists"});
        }

        const hashedPassword = hashData(password);
        const user = new UserModel({
            firstName,
            lastName,
            email,
            phoneNumber,
            role,
            password: hashedPassword,
            sponsorType,
            organizationName
        });

        let otp = generateOtp();

        const text = `EduFund Account verification`;
        const html = AccountVerificationEmailTemplate(firstName, otp);
        await sendEmail({
            email,
            subject: "EduFund Account Registration",
            text,
            html
        });

        otp = await generateJwt({otp}, constants.otp_expiry);

        await OtpModel.deleteMany({userId: user._id}); // Delete previous OTPs
        await OtpModel.create({
            userId: user._id,
            otp
        });

        await user.save();
        user.password = undefined;
        res.status(201).json({
            message: "OTP sent successfully, check your email to verify your account",
            data: user
        });
    } catch(error) {
        console.log(error);
        // if (file && file.path) fs.unlinkSync(file.path);
        res
            .status(500)
            .json({message: "Internal Server Error", error: error.message});
    }
};

exports.login = async (req, res) => {
    try {
        const {error} = loginValidation.validate(req.body);
        if(error) {
            return res.status(400).json({message: error.details[0].message});
        }
        const {email, password} = req.body || {};

        const user = await UserModel.findOne({email}).select("+password").populate('academicDocuments').lean({virtuals: true});

        if(!user) {
            return res.status(404).json({
                message:
                    "User not found, please check your credentials or create an account"
            });
        }

        if(!user.isVerified) {
            return res.status(500).json({
                message: "User not verified, please verify account to continue"
            });
        }

        if(!compareData(password, user.password)) {
            return res
                .status(400)
                .json({message: "Please provide a valid account password"});
        }


        const token = await generateJwt({id: user._id}, "1d");
        user.password = undefined;
        req.user = user;
        // testing notification creation
        await createNotification(user._id, "New account login", user._id, "info");
        res
            .status(200)
            .json({message: "Success, user logged in", token, data: user});
    } catch(error) {
        console.log(error);
        res
            .status(500)
            .json({message: "Internal Server Error", error: error.message});
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const {email} = req.params || {};

        const user = await UserModel.findOne({email}).populate('academicDocuments').lean({virtuals: true});
        if(user.isVerified) {
            return res
                .status(400)
                .json({message: "user already verified, please login to continue"});
        }
        user.isVerified = true;
        const token = await generateJwt({id: user._id}, "1d");
        req.user = {id: user._id};
        await user.save();

        res
            .status(200)
            .json({message: "OTP verification successful ✅", token, data: user});
    } catch(error) {
        if(error.name === "TokenExpiredError") {
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
    try {
        const {error} = resendOtpValidation.validate(req.body);
        if(error) {
            return res.status(400).json({message: error.details[0].message});
        }
        const {email} = req.body || {};

        const user = await UserModel.findOne({email}).populate('academicDocuments').lean({virtuals: true});

        if(!user) {
            return res
                .status(404)
                .json({message: "User not found, please create an account"});
        }

        let otp = generateOtp();

        const text = `EduFund otp resend request`;
        const html = AccountVerificationEmailTemplate(user.firstName, otp);;
        await sendEmail({
            email: user.email,
            subject: "EduFund Account verification",
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
    } catch(error) {
        console.log(error);
        res
            .status(500)
            .json({message: "Internal Server Error", error: error.message});
    }
};

exports.changePassword = async (req, res) => {
    try {
        const {error} = changePasswordValidation.validate({...req.body, ...req.params});
        if(error) {
            return res.status(400).json({message: error.details[0].message});
        }
        const {userId} = req.params;
        const {password, newPassword} = req.body || {};

        const user = await UserModel.findById(userId).select("+password").populate('academicDocuments').lean({virtuals: true});

        if(!user) {
            return res
                .status(404)
                .json({message: "User not found, please create an account"});
        }

        if(!user.isVerified) {
            return res
                .status(403)
                .json({message: "User not verified, please verify your account"});
        }
        if(!compareData(password, user.password)) {
            return res.status(400).json({
                message:
                    "Initial password account incorrect, please provide correct account password"
            });
        }

        if(compareData(newPassword, user.password)) {
            return res
                .status(400)
                .json({message: "New password cannot be same as old password"});
        }
        if(password === newPassword) {
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
    } catch(error) {
        console.log(error);
        return res
            .status(500)
            .json({message: "internal server error", error: error.message});
    }
};

exports.getCurrentAuthUser = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({message: "success", data: user});
    } catch(error) {
        return res
            .status(500)
            .json({message: "internal server error", error: error.message});
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        // const {error} = resetPasswordValidation.validate(req.body);
        // if(error) {
        //     return res.status(400).json({message: error.details[0].message});
        // }
        const {email} = req.params || {};

        const user = await UserModel.findOne({email}).populate('academicDocuments').lean({virtuals: true});

        if(!user) {
            return res
                .status(404)
                .json({message: "User not found, please create an account"});
        }

        let otp = generateOtp();

        const text = `EduFund password reset request`;
        const html = resetPasswordOtpEmailTemplate(user.firstName, otp);
        await sendEmail({
            email: user.email,
            subject: "EduFund password reset",
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
            .json({message: "Success, check your email for reset password token", data: user});
    } catch(error) {
        console.log(error);
        res
            .status(500)
            .json({message: "Internal Server Error", error: error.message});
    }
};

exports.verifyResetPasswordOtp = async (req, res) => {
    try {
        // const {error} = resetPasswordValidation.validate({...req.body, ...req.params});
        // if(error) {
        //     return res.status(400).json({message: error.details[0].message});
        // }
        const {email} = req.params;

        const user = await UserModel.findOne({email}).populate('academicDocuments').lean({virtuals: true});

        if(!user) {
            return res
                .status(404)
                .json({message: "User not found, please create an account"});
        }

        await OtpModel.deleteMany({userId: user._id});

        res
            .status(200)
            .json({message: "Success, email verification successful", data: user});
    } catch(error) {
        console.log(error);
        return res
            .status(500)
            .json({message: "internal server error", error: error.message});
    }
};
exports.resetPassword = async (req, res) => {
    try {
        // const {error} = resetPasswordValidation.validate({...req.body, ...req.params});
        // if(error) {
        //     return res.status(400).json({message: error.details[0].message});
        // }
        const {email} = req.params;
        const {password} = req.body || {};

        const user = await UserModel.findOne({email}).select("+password").populate('academicDocuments').lean({virtuals: true});

        if(!user) {
            return res
                .status(404)
                .json({message: "User not found, please create an account"});
        }
        const otp = await OtpModel.findOne({userId: user._id});
        if(otp) {
            return res
                .status(400)
                .json({message: "Please verify your email to reset password"});
        }

        if(compareData(password, user.password)) {
            return res
                .status(400)
                .json({message: "New password cannot be same as old password"});
        }

        user.password = hashData(password);
        await OtpModel.deleteMany({userId: user._id});
        await user.save();
        user.password = undefined;

        res
            .status(200)
            .json({message: "Password changed successfully", data: user});
    } catch(error) {
        console.log(error);
        return res
            .status(500)
            .json({message: "internal server error", error: error.message});
    }
};
