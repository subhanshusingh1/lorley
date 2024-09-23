const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Business name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value); // Validate email format
            },
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    businessType: {
        type: String, // Product or Service
        required: [true, 'Business type is required'],
        enum: ['Product', 'Service'], // Valid options
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
        validate: {
            validator: function (value) {
                return validator.isMobilePhone(value, 'en-IN'); // Validate for Indian mobile numbers
            },
            message: 'Invalid contact number format',
        },
    },
    address: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    logo: {
        type: String, // URL for logo
        validate: {
            validator: function (value) {
                return value ? validator.isURL(value) : true; // Validate logo URL
            },
            message: 'Invalid URL for logo',
        },
    },
    photos: [{
        type: String, // Array of URLs for business photos
        validate: {
            validator: function (value) {
                return value ? validator.isURL(value) : true; // Validate each photo URL
            },
            message: 'Invalid URL for photo',
        },
    }],
    openingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String },
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending',
    },
    views: {
        type: Number,
        default: 0,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
}, {
    timestamps: true,
});

// Hashing Password before saving
businessSchema.pre('save', async function (next) {
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
businessSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Creating JWT Token and storing it in cookie
businessSchema.methods.createJwt = async function (res) {
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
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            }
        );

        return token;
    } catch (error) {
        throw new Error(`Token can't be created: ${error.message}`);
    }
};

module.exports = mongoose.model('Business', businessSchema);
