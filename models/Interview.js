const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'CandidateApplication', required: true },
  interviewDate: {  type: String, required: true },
  interviewer: { type: String, required: true },
  feedback: { type: String }
});

module.exports = mongoose.model('Interview', InterviewSchema);