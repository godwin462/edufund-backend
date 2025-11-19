const joi = require("joi");

exports.createCampaignValidation = joi.object({
  schoolName: joi.string().required().trim().messages({
    "string.base": "School name must be a string.",
    "any.required": "School name is required.",
  }),
  year: joi.number().integer().min(100).max(999).required().messages({
    "number.base": "Year must be a number.",
    "number.min": "Year must be at least minimum 3 digits.",
    "number.max": "Year must be at most 3 digits.",
    "any.required": "Year is required.",
  }),
  matricNumber: joi.string().required().messages({
    "string.base": "Matric number must be a string.",
    "any.required": "Matric number is required.",
  }),
  jambRegistrationNumber: joi.string().required().messages({
    "string.base": "Jamb registration number must be a string.",
    "any.required": "Jamb registration number is required.",
  }),
  duration: joi.number().min(1).required().messages({
    "number.base": "Duration must be a number.",
    "number.min": "Duration must be at least 1.",
    "any.required": "Duration is required.",
  }),
  title: joi.string().required().trim().messages({
    "string.base": "Title must be a string.",
    "any.required": "Title is required.",
  }),
  course: joi.string().required().trim().messages({
    "string.base": "Course must be a string.",
    "any.required": "Course is required.",
  }),
  target: joi.number().integer().min(1).required().messages({
    "number.base": "Target must be a number.",
    "number.min": "Target must be at least 1.",
    "any.required": "Target is required.",
  }),
  story: joi.string().required().trim().messages({
    "string.base": "Story must be a string.",
    "any.required": "Story is required.",
  }),
  campaignImage: joi.any().optional().messages({
    "any.base": "Campaign image must be a valid value.",
  }),
});

exports.updateCampaignValidation = joi.object({
  schoolName: joi.string().trim().messages({
    "string.base": "School name must be a string.",
  }),
  year: joi.number().integer().min(100).max(999).messages({
    "number.base": "Year must be a number.",
    "number.min": "Year must be at least minimum 3 digits.",
  }),
  matricNumber: joi.string().messages({
    "string.base": "Matric number must be a string.",
  }),
  jambRegistrationNumber: joi.string().messages({
    "string.base": "Jamb registration number must be a string.",
  }),
  duration: joi.number().min(1).messages({
    "number.base": "Duration must be a number.",
    "number.min": "Duration must be at least 1.",
  }),
  title: joi.string().trim().messages({
    "string.base": "Title must be a string.",
  }),
  course: joi.string().trim().messages({
    "string.base": "Course must be a string.",
    "any.required": "Course is required.",
  }),
  target: joi.number().integer().min(1).messages({
    "number.base": "Target must be a number.",
    "number.min": "Target must be at least 1.",
  }),
  story: joi.string().trim().messages({
    "string.base": "Story must be a string.",
  }),
  campaignImage: joi.any().optional().messages({
    "any.base": "Campaign image must be a valid value.",
  }),
});
