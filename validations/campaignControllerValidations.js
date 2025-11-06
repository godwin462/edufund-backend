const joi = require("joi");

exports.createCampaignValidation = joi.object({
  schoolName: joi.string().required().trim().messages({
    "string.base": "School name must be a string.",
    "any.required": "School name is required.",
  }),
  year: joi
    .number()
    .integer()
    .min(100)
    .required()
    .messages({
      "number.base": "Year must be a number.",
      "number.min": "Year must be at least minimum 3 digits.",
      "any.required": "Year is required.",
    }),
  matricNumber: joi.number().required().messages({
    "number.base": "Matric number must be a number.",
    "any.required": "Matric number is required.",
  }),
  jambRegistrationNumber: joi.number().required().messages({
    "number.base": "Jamb registration number must be a number.",
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
  target: joi.number().required().messages({
    "number.base": "Target must be a number.",
    "any.required": "Target is required.",
  }),
  story: joi.string().required().trim().messages({
    "string.base": "Story must be a string.",
    "any.required": "Story is required.",
  }),
});

exports.updateCampaignValidation = joi.object({
  schoolName: joi.string().trim().messages({
    "string.base": "School name must be a string.",
  }),
  year: joi
    .number()
    .integer()
    .min(100)
    .messages({
      "number.base": "Year must be a number.",
      "number.min": "Year must be at least minimum 3 digits.",
    }),
  matricNumber: joi.number().messages({
    "number.base": "Matric number must be a number.",
  }),
  jambRegistrationNumber: joi.number().messages({
    "number.base": "Jamb registration number must be a number.",
  }),
  duration: joi.number().min(1).messages({
    "number.base": "Duration must be a number.",
    "number.min": "Duration must be at least 1.",
  }),
  title: joi.string().trim().messages({
    "string.base": "Title must be a string.",
  }),
  target: joi.number().messages({
    "number.base": "Target must be a number.",
  }),
  story: joi.string().trim().messages({
    "string.base": "Story must be a string.",
  }),
});
