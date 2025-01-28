const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: process.env.SMTPHOST,
    port: process.env.SMTPPORT,
    auth: {
      user: process.env.SMTPUSER,
      pass: process.env.SMTPPASS,
    },
});

module.exports = transporter