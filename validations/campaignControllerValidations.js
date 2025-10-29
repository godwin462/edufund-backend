const joi = require("joi");

exports.createCampaignValidation = joi.object({
    title: joi.string().required().trim().messages({
        'string.base': 'Title must be a string.',
        'any.required': 'Title is required.'
    }),
    target: joi.number().required().messages({
        'number.base': 'Target must be a number.',
        'any.required': 'Target is required.'
    }),
    story: joi.string().required().trim().messages({
        'string.base': 'Story must be a string.',
        'any.required': 'Story is required.'
    }),
});

exports.updateCampaignValidation = joi.object({
    title: joi.string().trim().messages({
        'string.base': 'Title must be a string.'
    }).optional(),
    target: joi.number().messages({
        'number.base': 'Target must be a number.'
    }).optional(),
    story: joi.string().trim().messages({
        'string.base': 'Story must be a string.'
    }),
    isActive: joi.boolean().messages({
        'boolean.base': 'isActive must be a boolean.'
    }).optional(),
});