// mailgun.js
const mailgun = require('mailgun-js'); // Ensure you have the mailgun-js package installed
require('dotenv').config(); // Ensure you're using dotenv for environment variables

// Initialize Mailgun with your API key and domain
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY, // Your Mailgun API key
  domain: process.env.MAILGUN_DOMAIN, // Your Mailgun domain
});

// Function to send email
const sendEmail = (to, subject, text) => {
  const data = {
    from: `Your Business Name <noreply@${process.env.MAILGUN_DOMAIN}>`, // Customize the "from" field
    to,
    subject,
    text,
  };

  return mg.messages().send(data); // This returns a promise
};

// Export the sendEmail function for use in other files
module.exports = { sendEmail };
