const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtAuthMiddleware = require("../jwtAuthMiddleware");
const Job = require("../models/jobSchema");
const Recruiter = require("../models/recruiterSchema");
const router = express.Router();

//to create a new job(recruiter only)
router.post("/newJob", jwtAuthMiddleware, async (req, res) => {
    try {
      const { id, role } = req.user;
  
      // Only recruiters can post jobs
      if (role !== "recruiter") {
        return res.status(403).json({ message: "Access denied. Only recruiters can post jobs." });
      }
  
      // Extract job details from request body
      const { title, desc, company, location, salary, jobType, skillsRequired } = req.body;
  
      // Ensure required fields are present
      if (!title || !desc || !company || !location || !jobType) {
        return res.status(400).json({ message: "Missing required fields." });
      }
  
      // Validate jobType
      const validJobTypes = ["Full-Time", "Part-Time", "Contract", "Internship"];
      if (!validJobTypes.includes(jobType)) {
        return res.status(400).json({ message: "Invalid job type." });
      }
  
      // Create new job
      const newJob = new Job({
        title,
        desc,
        company,
        location,
        salary,
        jobType,
        skillsRequired,
        recruiter: id, // Associate job with recruiter
      });
  
      // Save job to database
      const savedJob = await newJob.save();

      await Recruiter.findByIdAndUpdate(id, {
        $push: { postedJobs: { jobId: savedJob._id, postedAt: new Date() } },
      });
  
      res.status(201).json({ message: "Job posted successfully", job: newJob });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
});

//to update any job(recruiter only)
router.put("/:id", jwtAuthMiddleware, async (req, res) => {
    try {
      const { id: jobId } = req.params;
      const { id: userId, role } = req.user;
  
      // Only recruiters can update jobs
      if (role !== "recruiter") {
        return res.status(403).json({ message: "Access denied. Only recruiters can update jobs." });
      }
  
      // Find the job
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      // Ensure the recruiter owns the job
      if (job.recruiter.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized: You can only update jobs you have posted." });
      }
  
      // Extract fields to update
      const { title, desc, company, location, salary, jobType, skillsRequired } = req.body;
  
      // Update job fields
      if (title) job.title = title;
      if (desc) job.desc = desc;
      if (company) job.company = company;
      if (location) job.location = location;
      if (salary) job.salary = salary;
      if (jobType) job.jobType = jobType;
      if (skillsRequired) job.skillsRequired = skillsRequired;
  
      // Save updated job
      await job.save();
  
      res.status(200).json({ message: "Job updated successfully", job });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
});


// to get all applicants who applied for jobs created by a particular recruiter
router.get("/applicants", jwtAuthMiddleware, async (req, res) => {
  try {
    // Extract recruiter ID from JWT payload
    const recruiterId = req.user.id;

    // Find jobs posted by the recruiter
    const jobs = await Job.find({ recruiter: recruiterId })
    .populate("applicants.applicantId", "name email profile");

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found." });
    }

    // Extract applicants from jobs
    const applicants = jobs.flatMap(job => job.applicants.map(applicant => ({
      jobTitle: job.title,
      jobId: job._id,
      applicantId: applicant.applicantId._id,
      name: applicant.applicantId.name,
      email: applicant.applicantId.email,
      profile: applicant.applicantId.profile,
      status: applicant.status,
    })));

    if (!applicants.length) {
      return res.status(404).json({ message: "No applicants found." });
    }

    res.status(200).json({ applicants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

//to delete any job(recruiter only)
router.delete("/:id", jwtAuthMiddleware, async (req, res) => {
    try {
      const { id: jobId } = req.params;
      const { id: userId, role } = req.user;
  
      // Only recruiters can delete jobs
      if (role !== "recruiter") {
        return res.status(403).json({ message: "Access denied. Only recruiters can delete jobs." });
      }
  
      // Find the job
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      // Ensure the recruiter owns the job before deletion
      if (job.recruiter.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized: You can only delete jobs you have posted." });
      }
  
      // Delete the job
      await Job.findByIdAndDelete(jobId);
  
      res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
});

//to get list of all the applicants applied for any particular job
router.get("/:id/applicants", jwtAuthMiddleware, async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { id: userId, role } = req.user;

    // Only recruiters can access this route
    if (role !== "recruiter") {
      return res.status(403).json({ message: "Access denied. Only recruiters can view applicants." });
    }

    // Find the job
    const job = await Job.findById(jobId).populate("applicants.applicantId", "name email skills resume"); // Populate applicant details
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ensure the recruiter owns the job
    if (job.recruiter.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: You can only view applicants for your own jobs." });
    }

    // Send list of applicants
    res.status(200).json({ applicants: job.applicants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//to change status of any applicant applied for any particular job
router.put("/:id/applicants/:applicantId", jwtAuthMiddleware, async (req, res) => {
  try {
    const { id: jobId, applicantId } = req.params;
    const { id: userId, role } = req.user;
    const { status } = req.body;

    // Allowed status values
    const allowedStatuses = ["applied", "shortlisted", "rejected", "hired"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Only recruiters can update application statuses
    if (role !== "recruiter") {
      return res.status(403).json({ message: "Access denied. Only recruiters can update application statuses." });
    }

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ensure the recruiter owns the job
    if (job.recruiter.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: You can only update applications for jobs you posted." });
    }

    // Find the applicant in the job's applicants array
    const applicant = job.applicants.find(app => app.applicantId.toString() === applicantId);
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found for this job" });
    }

    // Update the status
    applicant.status = status;
    await job.save();

    res.status(200).json({ message: "Application status updated successfully", updatedApplicant: applicant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;