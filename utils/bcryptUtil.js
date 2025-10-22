const bcrypt = require("bcrypt");

exports.hashData = (data) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(data, salt);
};

exports.compareData = (data, hashedData) =>
  bcrypt.compareSync(data, hashedData);
