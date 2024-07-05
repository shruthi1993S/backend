const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const checkrole = require("../middleware/role")
const JobPosting = require("../models/JobPosting")

// Create a new job posting
router.post('/job', authMiddleware, checkrole(['admin']), async (req, res) => {
  const { title, description, location, salaryRange, postedAt, requirements } = req.body;
  try {
    const newJob = new JobPosting({ title, description, location, salaryRange, postedAt, requirements });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Get all job postings
router.get('/jobs', authMiddleware, checkrole(['admin', 'employee', 'applicant']), async (req, res) => {
  try {
    const jobs = await JobPosting.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// // Get a specific job posting by ID
// router.get('/job/:jobId', authMiddleware, checkRole(['admin', 'user']), async (req, res) => {
//   try {
//     const job = await JobPosting.findById(req.params.jobId);
//     if (!job) {
//       return res.status(404).json({ message: 'Job posting not found' });
//     }
//     res.json(job);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update a job posting by ID
// router.put('/job/:jobId', authMiddleware, checkRole(['admin']), validateJobPosting, async (req, res) => {
//   try {
//     const updates = req.body;
//     const updatedJob = await JobPosting.findByIdAndUpdate(req.params.jobId, updates, { new: true });
//     if (!updatedJob) {
//       return res.status(404).json({ message: 'Job posting not found' });
//     }
//     res.json(updatedJob);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Delete a job posting by ID
router.delete('/job/:jobId', authMiddleware, checkrole(['admin']), async (req, res) => {
  try {
    const deletedJob = await JobPosting.findByIdAndDelete(req.params.jobId);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    res.json({ message: 'Job posting deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;