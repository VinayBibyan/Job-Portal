const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["recruiter"], default: "recruiter" },
  postedJobs: [
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    },
  ]
});

const Recruiter = mongoose.model("Recruiter", recruiterSchema);
module.exports = Recruiter;