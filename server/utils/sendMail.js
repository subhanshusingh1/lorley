// Import modules
const nodemailer = require('nodemailer');
const mailgen = require('mailgen');
// const generateOtp = require('./path-to-generateOtp'); 

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
const sendMail = async (req, res, email, otp) => {
    try {
        // Generate OTP
        // const otp = generateOtp(); // Uncomment this if OTP generation is needed

        if (!otp) {
            return res.status(500).send({ message: 'Error Generating OTP' });
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

        // Respond with success
        res.status(200).send({ message: 'OTP email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: error.message || 'Error sending OTP email' });
    }
};

module.exports = sendMail;
