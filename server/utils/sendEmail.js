const nodemailer = require('nodemailer');

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};

module.exports = sendEmail;
