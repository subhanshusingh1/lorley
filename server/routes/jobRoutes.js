const express = require('express');
const { createJob, getJobs, deleteJob } = require('../controllers/jobController');
const {protect} = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to get jobs for specific business
router.route('/business/:businessId').get(getJobs);

// Route to create a new job
router.route('/').post(protect, createJob);

// Route to delete a specific job
router.route('/:jobId').delete(protect, deleteJob);

module.exports = router;
