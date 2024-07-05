const express = require('express');
const router = express.Router();
const CandidateApplication = require('../models/CandidateApplication');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/role');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const jobPosting = require("../models/JobPosting")

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new candidate application
router.post('/apply', authMiddleware, checkRole(['applicant']), upload.array("media"), async (req, res) => {
  const { name, coverLetter, jobPosting } = req.body;
  try {
    // Upload media files to Cloudinary
    const mediaUrls = await Promise.all(
      req.files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          uploadStream.end(file.buffer);
        });
      })
    );
    const newApplication = new CandidateApplication({
      name, coverLetter, jobPosting,
      resume: mediaUrls.filter(
        (url) => url.endsWith(".pdf")
      ),
      user: req.userId,
    });
    console.log(newApplication)
    await newApplication.save();
    const application = await CandidateApplication.findOne({ _id: newApplication._id }).populate('jobPosting');
    res.status(201).json({ message: "Application sent", application: application });
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all candidate applications
router.get('/applications', authMiddleware, checkRole(['admin', 'employee', 'applicant']), async (req, res) => {
  try {
    const applications = await CandidateApplication.find().populate('jobPosting');
    // .populate('appliedJobs')
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all candidate applications
router.get('/application/user', authMiddleware, checkRole(['applicant']), async (req, res) => {
  try {
    const applications = await CandidateApplication.find({ user: req.userId }).populate('jobPosting');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific candidate application by ID
router.get('/applications/:applicationId', authMiddleware, checkRole(['admin', 'employee', 'applicant']), async (req, res) => {
  try {

    const applications = await CandidateApplication.findById(req.params.applicationId)
    // const applications = await CandidateApplication.find({ appliedJobs: jobId }).populate('appliedJobs');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a candidate application by ID
router.put('/applications/:applicationId', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {

    const updates = req.body;
    const updatedApplication = await CandidateApplication.findByIdAndUpdate(req.params.applicationId, updates);
    if (!updatedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a candidate application by ID
router.delete('/applications/:applicationId', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {

    const deletedApplication = await CandidateApplication.findByIdAndDelete(req.params.applicationId);
    if (!deletedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;












// Get all candidate applications
router.get('/applications', authMiddleware, checkRole(['admin', 'user']), async (req, res) => {
  try {
    const applications = await CandidateApplication.find().populate('appliedJobs');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});