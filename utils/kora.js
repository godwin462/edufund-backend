const axios = require("axios");

exports.koraMakePayment = async (endpoint, payload) => {
  try {
    console.log(process.env.KORA_SECRET_KEY);

    const response = await axios.post(
      `https://api.korapay.com/merchant/api/v1/${endpoint}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data;
  } catch(error) {
    console.log(error);
    throw new Error(error);
  }
};
