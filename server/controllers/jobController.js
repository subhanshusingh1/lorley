const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const Business = require('../models/Business');

// Create a new job posting
exports.createJob = asyncHandler(async (req, res) => {
    const { title, description, requirements, location } = req.body;

    // Input validation
    if (!title || !description || !requirements || !location) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const { businessId } = req.user; // Destructuring user data

    const business = await Business.findById(businessId);
    if (!business) {
        return res.status(404).json({ message: 'Business not found' });
    }

    const job = new Job({
        business: businessId,
        title,
        description,
        requirements,
        location,
    });

    await job.save();
    res.status(201).json({ success: true, job });
});

// Get all jobs for a business
exports.getJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ business: req.params.businessId });
    res.json({ success: true, jobs });
});

// Delete a job posting
exports.deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }

    if (job.business.toString() !== req.user.businessId) {
        return res.status(401).json({ message: 'Not authorized to delete this job' });
    }

    await job.remove();
    res.json({ success: true, message: 'Job removed' });
});
