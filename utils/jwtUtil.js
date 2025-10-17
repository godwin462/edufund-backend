var jwt = require("jsonwebtoken");

exports.generateJwt = async (data, expiresIn = "15m") =>
  await jwt.sign(data, process.env.JWT_SECRETE, { expiresIn });

exports.verifyJwt = async (token) =>
  await jwt.verify(token, process.env.JWT_SECRETE);

exports.decodeJwt = async (token) => await jwt.decode(token);
