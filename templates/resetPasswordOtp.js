const constants = require("../utils/constants");

exports.resetPasswordOtpEmailTemplate = (firstName, otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background-color: #f0f4f8;
            color: #333333;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        td {
            padding: 0;
        }
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }
        a {
            text-decoration: none;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f0f4f8; color: #333333; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <center style="width: 100%; background-color: #f0f4f8;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f0f4f8;">
            <tr>
                <td align="center" style="padding: 1rem;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-radius: 0.75rem; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);">
                        <tr>
                            <td align="center" style="padding: 3rem 2rem 2rem 2rem;">
                                <img src="https://res.cloudinary.com/ddv0ffqnj/image/upload/v1762004111/logo_sdumpf.png" alt="EduFund Logo" width="200" style="max-width: 200px; height: auto; display: block;">
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 0 2rem;">
                                <h1 style="font-size: 2rem; font-weight: 900; margin: 0 0 0.5rem 0; color: #333333;">Reset Your Password</h1>
                                <p style="margin: 0.5rem 0; color: #777777;">Hi ${firstName}, please use the code below to reset your password.</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 2rem 2rem 1rem 2rem;">
                                <p style="margin: 0; color: #777777; font-size: 1rem; line-height: 1.6;">
                                    Please use the following One-Time Password (OTP) to securely set a new password for your account.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 1rem 2rem;">
                                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f0f4f8; border-radius: 0.5rem; width: auto;">
                                    <tr>
                                        <td align="center" style="padding: 1rem 2rem;">
                                            <p style="font-size: 2rem; font-weight: bold; letter-spacing: 0.5em; color: #333333; font-family: monospace; margin: 0;">${otp}</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 0 2rem 2rem 2rem;">
                                <p style="margin: 0; font-size: 0.9rem; color: #777777;">
                                    This code expires in ${constants.otp_expiry.split("m")[0]} minutes. For your security, do not share this code with anyone.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 1.5rem 2rem 0 2rem; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #777777;">If you did not request a password reset, please ignore this email.</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 2rem 2rem 3rem 2rem;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                        <td align="center" style="padding-bottom: 1rem;">
                                            <!-- Social icons as text links for better email compatibility -->
                                            <a href="#" style="color: #777777; text-decoration: none; margin: 0 0.75rem;">Facebook</a> |
                                            <a href="#" style="color: #777777; text-decoration: none; margin: 0 0.75rem;">Twitter</a> |
                                            <a href="#" style="color: #777777; text-decoration: none; margin: 0 0.75rem;">Instagram</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <p style="margin: 0.3rem 0; color: #777777; font-size: 0.8rem;">© 2024 EduFund. All rights reserved.</p>
                                            <p style="margin: 0.3rem 0; color: #777777; font-size: 0.8rem;">123 Security Lane, Verification City, 12345</p>
                                            <a href="#" style="margin: 0.3rem 0; color: #777777; text-decoration: underline; font-size: 0.8rem;">Unsubscribe</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`;
