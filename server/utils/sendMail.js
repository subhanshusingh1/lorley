// Import modules
const nodemailer = require('nodemailer');
const mailgen = require('mailgen');

// Create transporter function
const createTransport = () => {
    // Ensure environment variables are set
    if (!process.env.MAIL_HOST || !process.env.MAIL_PORT || !process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
        throw new Error('Email configuration environment variables are missing');
    }

    return nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        },
    });
};

// Generate Email Content
const generateEmailContent = (email, otp) => {
    return {
        body: {
            name: email,
            intro: "Welcome to Lorley! We're very excited to have you on board.",
            outro: `Your OTP for verification is ${otp}. It will expire in 10 minutes.`
        }
    };
};

// Create HTML Email Body
const generateHtmlEmailContent = (emailContent) => {
    const mailGenerator = new mailgen({
        theme: 'default',
        product: {
            name: 'Lorley',
            link: 'https://yourapp.com', // Update with your actual app link
        }
    });
    return mailGenerator.generate(emailContent);
};

// Main function to send email
const sendMail = async (email, otp) => {
    try {
        console.log('Sending email to:', email); // Debug log

        if (!email) {
            throw new Error('No recipient email provided');
        }

        // Generate HTML email content
        const emailContent = generateEmailContent(email, otp);
        const emailBody = generateHtmlEmailContent(emailContent);

        const transport = createTransport();

        const message = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP for Verification',
            html: emailBody,
        };

        // Send email
        await transport.sendMail(message);

        return { success: true, message: 'OTP email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(error.message || 'Error sending OTP email');
    }
};


module.exports = sendMail;
