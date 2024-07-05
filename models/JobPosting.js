const mongoose = require('mongoose');

const JobPostingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salaryRange: { type: String, required: true },
  postedAt: {type: String, required: true },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CandidateApplication' }],
});

module.exports = mongoose.model('JobPosting', JobPostingSchema);