const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  jobType: { 
    type: String, 
    enum: ["Full-Time", "Part-Time", "Internship"], 
    required: true 
  },
  skillsRequired: [{ type: String }],
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
  applicants: [
    {
      applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "Applicant" },
      status: {
        type: String,
        enum: ["applied", "shortlisted", "rejected", "hired"],
        default: "applied",
      },
      appliedAt: { type: Date, default: Date.now },
    },
  ],
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;