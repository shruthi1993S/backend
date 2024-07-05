const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/role');

router.post('/attendance', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {
    const { employeeId, date, status, remarks } = req.body;

    const newAttendance = new Attendance({ employeeId, date, status, remarks });
    console.log(newAttendance)
    await newAttendance.save();
    const attendances = await Attendance.findOne({ _id: newAttendance._id }).populate('employeeId')

    res.status(201).json(attendances);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all attendance records
router.get('/attendance', authMiddleware, checkRole(['admin', 'employee']), async (req, res) => {
  try {
    const attendances = await Attendance.find().populate('employeeId')
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance records for a specific employee by employeeId
router.get('/attendance/:attendanceId', authMiddleware, checkRole(['admin', 'employee']), async (req, res) => {
  try {
    // const { employeeId } = req.params;
    const attendances = await Attendance.findById(req.params.attendanceId);
    if (!attendances) {
      return res.status(404).json({ message: 'attendances not found' });
    }
    console.log(attendances)
    res.json(attendances);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update an attendance record by ID
router.put('/attendance/:attendanceId', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {
    // const { attendanceId } = req.params;
    const updates = req.body;
    const updatedAttendance = await Attendance.findByIdAndUpdate(req.params.attendanceId, updates, { new: true });
    if (!updatedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an attendance record by ID
router.delete('/attendance/:attendanceId', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {
    // const { attendanceId } = req.params;
    const deletedAttendance = await Attendance.findByIdAndDelete(req.params.attendanceId);
    if (!deletedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
