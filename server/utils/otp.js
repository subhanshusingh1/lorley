// Importing otp generator module
const OTP = require('otp-generator');

// Function to generate 8 digit otp with numbers and Uppercase letters only
const generateOtp = () => {
    return OTP.generate(
        8, // Length of otp
        {
            upperCaseAlphabets: true, // Include Uppercase Letter
            lowerCaseAlphabets: false, // Exclude Lowercase Letter
            specialChars: false, // Exclude special characters
            digits: true // Include Numbers
        }
    );
};

module.exports = generateOtp;
