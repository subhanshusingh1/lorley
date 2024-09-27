const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Business schema
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
        validate: [validator.isEmail, 'Invalid email format'],
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        validate: {
            validator: function(v) {
                // Regex for Indian mobile numbers
                return /^(?:\+91|91|0)?[789]\d{9}$/.test(v);
            },
            message: 'Invalid mobile number format. Please enter a valid Indian mobile number.'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
    },
    businessType: {
        type: String,
        required: [true, 'Business type is required'],
        enum: ['Product', 'Service'],
    },
    address: {
        houseFlatBlockNo: {
            type: String,
            required: [true, 'House/Flat/Block No is required'],
        },
        areaStreetVillage: {
            type: String,
            required: [true, 'Area/Street/Village is required'],
        },
        landmark: {
            type: String,
            required: [true, 'Landmark is required'],
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
            validate: {
                validator: function(v) {
                    // Regex for Indian pincode (6 digits)
                    return /^[1-9][0-9]{5}$/.test(v);
                },
                message: 'Invalid pincode format. Please enter a valid 6-digit Indian pincode.'
            }
        },
        city: {
            type: String,
            required: [true, 'City is required'],
        },
        state: {
            type: String,
            required: [true, 'State is required'],
        }
    },
    description: String,
    logo: {
        type: String,
        validate: [validator.isURL, 'Invalid URL for logo'],
    },
    photos: [{
        type: String,
        validate: [validator.isURL, 'Invalid URL for photo'],
        default: []
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    openingHours: {
        monday: { open: { type: String, required: true }, close: { type: String, required: true } },
        tuesday: { open: { type: String, required: true }, close: { type: String, required: true } },
        wednesday: { open: { type: String, required: true }, close: { type: String, required: true } },
        thursday: { open: { type: String, required: true }, close: { type: String, required: true } },
        friday: { open: { type: String, required: true }, close: { type: String, required: true } },
        saturday: { open: { type: String, required: true }, close: { type: String, required: true } },
        sunday: { open: { type: String, required: true }, close: { type: String, required: true } },
    },
    views: {
        type: Number,
        default: 0, // Track business views
    },
    searchCount: {
        type: Number,
        default: 0, // Track how many times the business has been searched
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
    refreshToken: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

// Hashing Password using Bcrypt
businessSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Comparing Password
businessSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generating Access Token
businessSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Generating Refresh Token
businessSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Creating JWT Token and storing it in cookies
businessSchema.methods.createJwt = async function (res) {
    const accessToken = this.generateAccessToken();
    const refreshToken = this.generateRefreshToken();

    this.refreshToken = refreshToken;
    await this.save();

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return { accessToken, refreshToken };
};

module.exports = mongoose.model('Business', businessSchema);
