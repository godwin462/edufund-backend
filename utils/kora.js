const axios = require("axios");

exports.koraMakePayment = async (endpoint, payload) => {
  axios
    .post(`https://api.korapay.com/merchant/api/v1/${endpoint}`, payload, {
      headers: {
        Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(error.response ? error.response.data : error.message);
      throw new Error("Error making payment");
    });
};
