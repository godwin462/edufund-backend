const joi = require("joi");
const constants = require("../utils/constants");

exports.registerValidation = joi.object({
    firstName: joi.string().messages({
        'string.base': 'First name must be a string.',
    }),
    lastName: joi.string().messages({
        'string.base': 'Last name must be a string.',
    }),
    email: joi.string().email().required().messages({
        'string.base': 'Email must be a string.',
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.'
    }),
    role: joi.string().valid("student", "institution", "sponsor", "admin").messages({
        'string.base': 'Role must be a string.',
        'any.only': 'Role must be one of [student, institution, sponsor, admin].',
    }),
    password: joi.string().min(6).required().messages({
        'string.base': 'Password must be a string.',
        'string.min': 'Password must be at least 6 characters long.',
        'any.required': 'Password is required.'
    }),
    phoneNumber: joi.string().messages({
        'string.base': 'Phone number must be a string.',
    }),
    sponsorType: joi.string().messages({
        'string.base': 'Sponsor type must be a string.',
        'any.only': 'Sponsor type must be one of [company, individual].',
    }).optional(),
    organizationName: joi.string().messages({
        'string.base': 'Sponsor type must be a string.',
    }).optional(),
});

exports.loginValidation = joi.object({
    email: joi.string().email().required().messages({
        'string.base': 'Email must be a string.',
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.'
    }),
    password: joi.string().required().messages({
        'string.base': 'Password must be a string.',
        'any.required': 'Password is required.'
    }),
});

exports.verifyOtpValidation = joi.object({
    otp: joi.string().min(constants.otp_length).required().messages({
        'string.base': 'OTP must be a string.',
        'any.required': 'OTP is required.'
    }),
    email: joi.string().email().messages({
        'string.base': 'Email must be a string.',
        'string.email': 'Please provide a valid email address.',
    }).optional(),
    password: joi.string().min(6).messages({
        'string.base': 'Password must be a string.',
        'string.min': 'Password must be at least 6 characters long.',
    }).optional(),
});

exports.resendOtpValidation = joi.object({
    email: joi.string().email().required().messages({
        'string.base': 'Email must be a string.',
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.'
    }),
});

exports.changePasswordValidation = joi.object({
    userId: joi.string().required().messages({
        'string.base': 'User ID must be a string.',
        'any.required': 'User ID is required.'
    }),
    password: joi.string().required().messages({
        'string.base': 'Password must be a string.',
        'any.required': 'Password is required.'
    }),
    newPassword: joi.string().min(6).required().messages({
        'string.base': 'New password must be a string.',
        'string.min': 'New password must be at least 6 characters long.',
        'any.required': 'New password is required.'
    }),
});
