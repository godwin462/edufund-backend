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
    console.log(response);
    return response?.data;
  } catch (error) {
    if (error.response.data.message) {
      console.log(error.response.data);
      return error.response;
    }
    console.log(error);
    throw new Error(error.response.data.message || error);
  }
};
