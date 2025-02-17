const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["applicant"], default: "applicant" },
  profile: {
    resume: { type: String }, // URL to resume file
    skills: [{ type: String }],
    experience: { type: String },
    education: { type: String },
    contact: { type: String },
  },
  appliedJobs: [
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
      status: {
        type: String,
        enum: ["applied", "shortlisted", "rejected", "hired"],
        default: "applied",
      },
    },
  ]
});

const Applicant = mongoose.model("Applicant", applicantSchema);
module.exports = Applicant;