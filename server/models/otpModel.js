// import modules
const mongoose = require("mongoose");
const validate = require("validator");


const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please Enter Your Email!!!'],
        lowercase: true,
        validate: [validate.isEmail, 'Please Provide Valid Email'],
        index: true,
        unique: true
    },
    otp: {
        type: String,
        required: [true, 'OTP is required'],
        maxlength: 8
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('OTP', OtpSchema);
