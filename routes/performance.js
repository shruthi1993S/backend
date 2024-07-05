const express = require('express');
const router = express.Router();
const Performance = require('../models/Performance');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/role');

// Create a new performance evaluation
router.post('/performance', authMiddleware, checkRole(['admin']), async (req, res) => {
  const { user, feedback, ratings } = req.body;
  try {
    const newPerformance = new Performance({
      user,
      feedback,
      ratings
    });
    await newPerformance.save();
    const performances = await Performance.findOne({ _id: newPerformance._id }).populate('user');

    res.status(201).json(performances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all performance evaluations
router.get('/performance', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {
    const performances = await Performance.find().populate('user');
    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all performance by user evaluations
router.get('/performance/user', authMiddleware, checkRole(['employee']), async (req, res) => {
  try {
    const performances = await Performance.find({ user: req.userId }).populate('user');
    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get a specific performance evaluation by ID
router.get('/performance/:performanceId', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {

    const performance = await Performance.findById(req.params.performanceId).populate('user');
    if (!performance) {
      return res.status(404).json({ message: 'Performance evaluation not found' });
    }
    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a performance evaluation by ID
router.put('/performance/:performanceId', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {

    const updates = req.body;
    const updatedPerformance = await Performance.findByIdAndUpdate(req.params.performanceId, updates, { new: true });
    if (!updatedPerformance) {
      return res.status(404).json({ message: 'Performance evaluation not found' });
    }
    res.json(updatedPerformance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a performance evaluation by ID
router.delete('/performance/:performanceId', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {

    const deletedPerformance = await Performance.findByIdAndDelete(req.params.performanceId);
    if (!deletedPerformance) {
      return res.status(404).json({ message: 'Performance evaluation not found' });
    }
    res.json({ message: 'Performance evaluation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
