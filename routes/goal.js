const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/role');

// Create a new goal
router.post('/goal', authMiddleware, checkRole(['admin']), async (req, res) => {
  const { employeeId, goalDescription, completionDate, status } = req.body;
  try {
    const newGoal = new Goal({
      employeeId,
      goalDescription,
      completionDate,
      status
    });
    await newGoal.save();
    const goals = await Goal.find({ _id: newGoal._id }).populate('user');

    res.status(201).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all goals
router.get('/goal', authMiddleware, checkRole(['admin', 'employee']), async (req, res) => {
  try {
    const goals = await Goal.find().populate('employeeId');
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all goals
router.get('/goal/user', authMiddleware, checkRole(['employee']), async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.userId }).populate('employeeId');
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific goal by ID
router.get('/goal/:goalId', authMiddleware, checkRole(['admin', 'employee']), async (req, res) => {
  try {
    // const { goalId } = req.params;
    const goal = await Goal.findById(req.params.goalId).populate('employeeId');
    if (!goal) {
      return res.status(404).json({ message: 'There is no goals assigned' });
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a goal by ID
router.put('/goal/:goalId', authMiddleware, checkRole(['admin', 'hr']), async (req, res) => {
  try {
    // const { goalId } = req.params;
    const updates = req.body;
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.goalId, updates, { new: true });
    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a goal by ID
router.delete('/goal/:goalId', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {
    // const { goalId } = req.params;
    const deletedGoal = await Goal.findByIdAndDelete(req.params.goalId);
    if (!deletedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
