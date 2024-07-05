const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/role');
const Employee = require('../models/Employee');
const CandidateApplication = require('../models/CandidateApplication');
const Interview = require('../models/Interview');
const JobPosting = require('../models/JobPosting');
const LeaveRequest = require('../models/LeaveRequest');
const Performance = require('../models/Performance');
async function calculateTurnoverRate(startDate, endDate) {
  const employeesAtStart = await Employee.countDocuments({ active: true, createdAt: { $lte: startDate } });
  const employeesAtEnd = await Employee.countDocuments({ active: true, createdAt: { $lte: endDate } });
  const employeesWhoLeft = await Employee.countDocuments({ active: false, updatedAt: { $gte: startDate, $lte: endDate } });
  const averageEmployees = (employeesAtStart + employeesAtEnd) / 2;
  const turnoverRate = (employeesWhoLeft / averageEmployees) * 100;
  return turnoverRate;
}
router.get('/metrics', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {

    const present = await Attendance.countDocuments({ status: 'present' });
    const absent = await Attendance.countDocuments({ status: 'absent' });
    const employeeCount = await Employee.countDocuments({ active: true });
    const candidateCount = await CandidateApplication.find().count();
    const employeeTurnOver = await calculateTurnoverRate('2024-07-01', '2024-07-31');
    const candidateHired = await CandidateApplication.aggregate([{
      $group: {
        _id: '$hired',
        count: { $sum: 1 }
      }
    }]);
    const performance = await Performance.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$ratings" }
        }
      }
    ]);
    let performanceAverage = 0
    if (performance.length > 0) {
      performanceAverage = performance[0].averageRating;
    }
    res.json({
      employeeCount,
      candidateCount,
      candidateHired,
      performanceAverage,
      employeeTurnOver,
      present,
      absent,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
