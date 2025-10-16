const loginOtpTemplate = (otp) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Login OTP</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0"
        style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 20px;">

        <!-- Logo -->
        <tr>
            <td align="center" style="padding-bottom: 20px;">
                <img src="https://res.cloudinary.com/ddv0ffqnj/image/upload/v1759131838/Modern_Fast_Delivery_Logo_1_nfaoht.svg" alt="DawnEats Logo"
                   srcset="https://res.cloudinary.com/ddv0ffqnj/image/upload/v1759131838/Modern_Fast_Delivery_Logo_1_nfaoht.svg 2x" style="max-width: 120px;">
            </td>
        </tr>

        <!-- Title -->
        <tr>
            <td align="center" style="color: #222222;">
                <h2 style="margin: 0; font-size: 22px; font-weight: bold; color: #FF6E00;">
                    Your Login OTP 🔐
                </h2>
                <p style="margin: 10px 0 20px; font-size: 14px; color: #555555;">
                    Use the one-time password below to log in to your DawnEats account.
                </p>
            </td>
        </tr>

        <!-- OTP Box -->
        <tr>
            <td align="center" style="padding: 20px;">
                <div
                    style="background-color: #fff3e6; border: 1px solid #FF6E00; border-radius: 6px; display: inline-block; padding: 15px 25px; margin: 10px 0;">
                    <p style="margin: 0; font-size: 20px; font-weight: bold; color: #FF6E00;">
                        ${otp}
                    </p>
                </div>
            </td>
        </tr>

        <!-- Instruction -->
        <tr>
            <td align="center" style="padding: 10px 20px; color: #555555; font-size: 14px; line-height: 20px;">
                <p>This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
                <p>If you didn’t request this login, please secure your account immediately.</p>
            </td>
        </tr>

        <!-- CTA Button -->
        <tr>
            <td align="center" style="padding: 20px;">
                <a href="#" style="background-color: #FF6E00; color: #ffffff; text-decoration: none;
                  padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: bold; display: inline-block;">
                    Log In to DawnEats
                </a>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td align="center" style="padding: 10px 20px; color: #666666; font-size: 13px; line-height: 20px;">
                <p>If you have any issues, please contact DawnEats support.</p>
                <p style="margin-top: 20px; color:#FF6E00; font-weight: bold;">The DawnEats Team</p>
            </td>
        </tr>
    </table>
</body>

</html>
`;
};

module.exports = loginOtpTemplate;
