const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// User schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Your Name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please Enter Your Email!!!'],
        lowercase: true,
        validate: [validator.isEmail, 'Please Provide Valid Email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please Enter Your Password!!!'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String,
        default: ''
    },
    refreshToken: {
        type: String, // Storing refresh token
        default: '',
    }
}, {
    timestamps: true
});

// Hashing Password using Bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Comparing Password
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generating Access Token
UserSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Generating Refresh Token
UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Creating Json Web Token and storing it in cookies
UserSchema.methods.createJwt = async function (res) {
    const accessToken = this.generateAccessToken(); // Generate access token
    const refreshToken = this.generateRefreshToken(); // Generate refresh token

    this.refreshToken = refreshToken; // Store refresh token in the user document
    await this.save(); // Save user document

    // Set access token cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return { accessToken, refreshToken }; // Return tokens
};

module.exports = mongoose.model('User', UserSchema);
