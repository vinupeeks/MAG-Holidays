const db = require('../models/index');
const Roles = db.roles;


exports.rolesList = async (req, res) => {
    try {
        const roles = await Roles.findAll({
        })
        if (roles.length === 0) {
            return res.status(400).json({ success: false, message: 'No roles found..!' });
        }

        res.status(200).json({ success: true, data: roles, message: 'Roles fetched Successfully..!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// const mailer = async (req, res) => {
//     try {
//         transporter.sendMail({
//             from: {
//                 name: process.env.SMTPENAME,
//                 address: process.env.SMTPEMAIL
//             },
//             to: "vineeth@solminds.com",
//             subject: "M&G OTP for Secure Access",
//             // body: "Working"
//             html: `
//             <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
//                 <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #dddddd;">
//                 <h2 style="color: #333333; text-align: center;">Your One-Time Password (OTP)</h2>
//                 <p style="color: #555555; font-size: 16px; line-height: 1.5;">Hi,</p>
//                 <p style="color: #555555; font-size: 16px; line-height: 1.5;">
//                     Your OTP for accessing your account is:
//                 </p>
//                 <p style="font-size: 24px; font-weight: bold; text-align: center; color: #4CAF50; margin: 20px 0;">
//                     000 000 000
//                 </p>
//                 <p style="color: #555555; font-size: 16px; line-height: 1.5;">
//                     This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.
//                 </p>
//                 <p style="color: #555555; font-size: 16px; line-height: 1.5;">
//                     If you did not request this OTP, please ignore this email or contact us at
//                 <a href="mailto:support@example.com" style="color: #4CAF50; text-decoration: none;">support@example.com</a>.
//                 </p>
//                 <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;" />
//                 <p style="font-size: 14px; color: #999999; text-align: center;">
//                     Thank you, <br />
//                 <strong>M&G Travels</strong>
//                 </p>
//                 </div>
//             </body>
//                 `,
//         });
//     } catch (error) {
//         console.log(error);

//     }
// }

// mailer()