const registrationTeplate = (otp) => {
  return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>OTP Email</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
        style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 20px;">
        <tr>
            <td align="center" style="padding-bottom: 20px;">
                <!-- Logo -->
                <img src="https://res.cloudinary.com/ddv0ffqnj/image/upload/v1759131838/Modern_Fast_Delivery_Logo_1_nfaoht.svg" alt="DawnEats Logo"
                  srcset="https://res.cloudinary.com/ddv0ffqnj/image/upload/v1759131838/Modern_Fast_Delivery_Logo_1_nfaoht.svg 2x"  style="max-width: 120px;">
            </td>
        </tr>
        <tr>
            <td align="center" style="color: #222222;">
                <h2 style="margin: 0; font-size: 22px; font-weight: bold;">One Time Password (OTP)</h2>
                <p style="margin: 10px 0 20px; font-size: 14px; color: #555555;">
                    Please enter the verification code below to confirm your account.
                </p>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 20px;">
                <p style="font-size: 14px; color: #444444; margin-bottom: 10px;">Dear User,</p>
                <div
                    style="background-color: #fff3e6; border: 1px solid #f0c28c; border-radius: 6px; display: inline-block; padding: 15px 25px; margin: 10px 0;">
                    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333333;">
                        Your OTP is: <strong>${otp}</strong>
                    </p>
                </div>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 10px 20px; color: #666666; font-size: 13px; line-height: 20px;">
                <p>Please enter the OTP on the website to complete your registration.</p>
                <p>If you did not request this OTP, please ignore this email.</p>
                <p style="margin-top: 20px;">DawnEats Team</p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

module.exports = registrationTeplate;
