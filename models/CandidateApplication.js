
const mongoose = require('mongoose');

const CandidateApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resume: [String],
  coverLetter: { type: String, required: true },
  jobPosting: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting' },
  hired: { type: String, default: "PENDING", enum: ['PENDING', 'HIRED', 'REJECTED'] },

});

module.exports = mongoose.model('CandidateApplication', CandidateApplicationSchema);
