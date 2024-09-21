// import modules
const mongoose = require("mongoose");
const validator = require("validator");

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please Enter Your Email'],
        lowercase: true,
        validate: [validator.isEmail, 'Please Provide Correct Email'],
        index : true // for faster lookup
    },
    otp: {
        type: String,
        required: [true, 'OTP is required'],
        maxlength : 8
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('OTP', OtpSchema);
