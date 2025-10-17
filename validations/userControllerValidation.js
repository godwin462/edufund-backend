const joi = require("joi");
const UserModel = require("../models/userModel");
const userRouter = require("../router/userRouter");

const createUserJoiSchema = joi.object({
  firstName: joi.string().alphanum().min(3).required(),
  lastName: joi.string().alphanum().min(3).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
