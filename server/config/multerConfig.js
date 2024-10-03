const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Configure Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_profiles', 
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed image formats
  },
});

// Create the multer upload middleware
const upload = multer({ storage: storage });

module.exports = upload;
