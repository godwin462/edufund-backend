const withdrawalRequestTemplate = (
  fullName,
  studentId,
  requestDate,
  status
) => {
  const date = new Date(requestDate);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>New Student Withdrawal Request</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f7fa; font-family: Arial, sans-serif;">

    <table width="100%" cellspacing="0" cellpadding="0" style="padding: 30px 0;">
        <tr>
            <td align="center">

                <!-- Container -->
                <table width="100%" cellpadding="0" cellspacing="0"
                    style="max-width: 600px; background:#ffffff; border-radius:8px; padding:20px;">

                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding-top: 20px;">
                            <img src="https://res.cloudinary.com/ddv0ffqnj/image/upload/v1762004111/logo_sdumpf.png"
                                alt="EduFund Logo" width="200" style="max-width: 200px; height: auto; display: block;">
                        </td>
                    </tr>

                    <!-- Title -->
                    <tr>
                        <td align="center" style="padding: 20px 10px 0;">
                            <h1 style="margin:0; font-size:26px; font-weight:800; color:#222222;">
                                Student Withdrawal Request
                            </h1>
                            <p style="margin:10px 0 0; font-size:14px; color:#777777;">
                                A new request requires your attention.
                            </p>
                        </td>
                    </tr>

                    <!-- Intro Text -->
                    <tr>
                        <td
                            style="padding: 25px 15px 10px; font-size:14px; color:#333333; text-align:center; line-height:22px;">
                            Hello Admin, a student has submitted a request to withdraw. Please review the details below
                            and take the appropriate action.
                        </td>
                    </tr>

                    <!-- Details Box -->
                    <tr>
                        <td style="padding: 20px;">
                            <table width="100%" cellspacing="0" cellpadding="0"
                                style="background:#f7f9fc; border:1px solid #e5e7eb; border-radius:6px; padding:15px;">
                                <tr>
                                    <td style="font-size:13px; color:#555;">Student Name:</td>
                                    <td style="text-align:right; font-size:13px; font-weight:bold; color:#222;">${fullName}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" height="10"></td>
                                </tr>

                                <tr>
                                    <td style="font-size:13px; color:#555;">Student ID:</td>
                                    <td style="text-align:right; font-size:13px; font-weight:bold; color:#222;">
                                        ${studentId}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" height="10"></td>
                                </tr>

                                <tr>
                                    <td style="font-size:13px; color:#555;">Request Date:</td>
                                    <td style="text-align:right; font-size:13px; font-weight:bold; color:#222;">${formattedDate}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" height="10"></td>
                                </tr>

                                <tr>
                                    <td style="font-size:13px; color:#555;">Status:</td>
                                    <td style="text-align:right;">
                                        <span
                                            style="font-size:12px; font-weight:bold; background:#fff3cd; color:#8a6d3b; padding:4px 10px; border-radius:12px;">
                                            ${status}
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Button -->
                    <tr>
                        <td align="center" style="padding: 20px 0 10px;">
                            <p style="font-size:13px; color:#777777; margin-bottom:10px;">
                                Click the button below to review the full request.
                            </p>
                            <a href="#" style="background:#007BFF; color:#ffffff; text-decoration:none;
                padding:12px 28px; border-radius:6px; font-size:15px; font-weight:bold; display:inline-block;">
                                Review Request
                            </a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 40px 10px 10px;">
                            <p style="font-size:12px; color:#999999; margin:0;">© 2024 EduFunds. All rights reserved.
                            </p>
                            <p style="font-size:12px; color:#999999; margin:3px 0;">123 Education Ave, Learning City,
                                12345</p>
                            <a href="#" style="font-size:12px; color:#007BFF; text-decoration:underline;">Notification
                                Settings</a>
                        </td>
                    </tr>

                </table>
                <!-- End Container -->

            </td>
        </tr>
    </table>

</body>

</html>
`;
};
module.exports = withdrawalRequestTemplate;
