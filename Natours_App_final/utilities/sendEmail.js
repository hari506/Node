const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create transporter

  let emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 25,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //prepare options to send mail

  let mailoptions = {
    from: ' sreehari <sreehari.b6@gmail.com>',
    to: 'sreehari.b6@gmail.com',
    subject: options.subject,
    text: options.message,
  };
  //send mail using options
  await emailTransporter.sendMail(mailoptions);
};

module.exports = sendEmail;
