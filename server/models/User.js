const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validate = require('validator');

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
        validate: [validate.isEmail, 'Please Provide Valid Email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please Enter Your Password!!!'],
        minlength: 6
    },
    mobile: {
        type: String,
        required: [true, 'Please Provide Your Mobile Number'],
        unique: true,
        validate: {
            validator: function (v) {
                return validate.isMobilePhone(v, 'en-IN'); // 'en-IN' for Indian format
            },
            message: 'Please Provide a Valid Mobile Number'
        }
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

}, {
    timestamps: true
});

// Hashing Password using Bcrypt
UserSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(new Error(`Password can't be hashed: ${error.message}`));
    }
});

// Comparing Password
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Creating Json Web Token and storing it in cookie
UserSchema.methods.createJwt = async function (res) {
    try {
        const token = jwt.sign(
            { _id: this._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie(
            'jwt',
            token,
            {
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 24 * 60 * 60 * 1000
            }
        );

        return token;
    } catch (error) {
        throw new Error(`Token can't be created: ${error.message}`);
    }
};

// User model
module.exports = mongoose.model('User', UserSchema);
