const campaignTargetMetTemplate = (target, firstName, campaignTitle) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>Goal Achieved!</title>
</head>

<body style="margin:0; padding:0; background-color:#f0f4f8; font-family: Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0"
        style="max-width:600px; margin: 0 auto; padding:20px; background-color:#f0f4f8;">

        <!-- LOGO -->
        <tr>
            <td align="center" style="padding: 30px 0;">
                <img src="https://res.cloudinary.com/ddv0ffqnj/image/upload/v1762004111/logo_sdumpf.png"
                    alt="EduFund Logo" width="200" style="max-width: 200px; height: auto; display: block;">
            </td>
        </tr>

        <!-- MAIN CARD -->
        <tr>
            <td>
                <table width="100%" cellpadding="0" cellspacing="0"
                    style="background-color:#ffffff; border-radius:8px; padding:30px;">

                    <!-- Celebration Icon -->
                    <tr>
                        <td align="center" style="padding-bottom:20px;">
                            <div style="width:60px; height:60px; background:#22C55E1A; border-radius:50%;
                          display:flex; align-items:center; justify-content:center; margin:0 auto;">
                                <span style="font-size:32px; color:#22C55E;">🎉</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Title -->
                    <tr>
                        <td align="center" style="font-size:26px; font-weight:900; color:#333; padding-bottom:10px;">
                            Goal Achieved!
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="font-size:15px; color:#777;">
                            Hi ${firstName}, we have amazing news to share.
                        </td>
                    </tr>

                    <!-- MAIN MESSAGE -->
                    <tr>
                        <td style="padding:30px 0; text-align:center;">
                            <p style="font-size:16px; color:#555; margin-bottom:15px;">
                                Your campaign <strong>"${campaignTitle}"</strong> has successfully
                                reached its funding goal.
                            </p>

                            <div style="margin-top:10px;">
                                <span style="font-size:34px; font-weight:bold; color:#2563EB;">₦${target?.toLocaleString()}</span>
                                <span style="background:#22C55E1A; color:#22C55E; font-size:12px;
                             padding:4px 10px; border-radius:20px; font-weight:bold; margin-left:5px;">
                                    FUNDED
                                </span>
                            </div>
                        </td>
                    </tr>

                    <!-- MESSAGE BLOCK -->
                    <tr>
                        <td style="border-top:1px solid #e5e5e5; padding-top:25px; text-align:left;">
                            <h3 style="font-size:20px; font-weight:bold; color:#333; margin:0 0 20px 0;">What Happens
                                Next?</h3>
                            <p style="font-size:15px; color:#555; line-height:22px; margin-bottom:25px;">
                                Now that your campaign has reached its funding goal, here’s what you can expect:
                            </p>
                            <ol>
                                <li style="margin-bottom:20px;">
                                    <h4 style="font-size:16px; font-weight:bold; color:#333; margin:0 0 5px 0;">Request
                                        Withdrawal</h4>
                                    <p style="font-size:15px; color:#555; line-height:22px; margin:0;">
                                        Log in to your EduFund dashboard and submit a withdrawal request for your funded
                                        amount.
                                    </p>
                                    </div>

                                <li style="margin-bottom:20px;">
                                    <h4 style="font-size:16px; font-weight:bold; color:#333; margin:0 0 5px 0;">Admin
                                        Processing</h4>
                                    <p style="font-size:15px; color:#555; line-height:22px; margin:0;">
                                        Our admin team will review and process your withdrawal request to ensure
                                        everything is in order.
                                    </p>
                                    </div>

                                <li style="margin-bottom:20px;">
                                    <h4 style="font-size:16px; font-weight:bold; color:#333; margin:0 0 5px 0;">Funds
                                        Disbursed to Your School Account</h4>
                                    <p style="font-size:15px; color:#555; line-height:22px; margin:0;">
                                        Once approved, the money will be securely transferred directly to your school
                                        account to cover your educational expenses.
                                    </p>
                                    </div>
                            </ol>

                        </td>
                    </tr>

                    <!-- CTA BUTTON -->
                    <tr>
                        <td align="center" style="padding-top:20px; border-top:1px solid #e5e5e5;">
                            <p style="font-size:13px; color:#777; margin-bottom:15px;">
                                Want to see the impact you've made?
                            </p>

                            <a href="https://edu-fund-gamma.vercel.app/student-dashbord/campaigns" style="background:#2563EB; color:#ffffff; padding:12px 28px; text-decoration:none;
                        border-radius:6px; font-size:15px; font-weight:bold; display:inline-block;">
                                View Campaign Page
                            </a>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>

        <!-- FOOTER -->
        <tr>
            <td style="text-align:center; padding:30px 0; font-size:12px; color:#777;">
                <p style="margin:0;">© 2024 EduFunds. All rights reserved.</p>
                <p style="margin:3px 0;">123 Giving Way, Charity City, 12345</p>
                <a href="#" style="color:#777; text-decoration:underline;">Unsubscribe</a>
            </td>
        </tr>

    </table>

</body>

</html>
    `;
module.exports = campaignTargetMetTemplate
