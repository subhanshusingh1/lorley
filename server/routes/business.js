// import express from 'express';
// import { getBusinesses, addBusiness, verifyBusiness, updateBusinessCustomization } from '../controllers/businessController';
// import auth from '../middleware/auth';
// import multer from 'multer';

// const router = express.Router();

// // Multer setup for file uploads
// const upload = multer({ dest: 'uploads/' });

// // Get all businesses
// router.get('/', getBusinesses);

// // Add a new business
// router.post('/', auth, addBusiness);

// // Route to handle verification document submission
// router.post('/:id/verify', upload.single('document'), verifyBusiness);

// // Update business customization
// router.put('/customization/:id', auth, updateBusinessCustomization);

// export default router;