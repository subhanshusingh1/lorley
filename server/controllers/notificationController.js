const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// Send email notification
exports.sendEmailNotification = asyncHandler(async (email, subject, message) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password',
        },
    });

    let mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: subject,
        text: message,
    };

    await transporter.sendMail(mailOptions);
});

// Create in-app notification
exports.createInAppNotification = asyncHandler(async (userId, message) => {
    const notification = new Notification({
        user: userId,
        message: message,
    });
    await notification.save();
});
