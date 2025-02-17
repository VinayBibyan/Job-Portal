const express = require("express");
const Job = require('../models/jobSchema');
const jwtAuthMiddleware = require("../jwtAuthMiddleware");
const router = express.Router();

//get list of all jobs
router.get("/list", async (req, res) => {
    try {
      // Fetch all jobs and populate recruiter details (excluding password)
      const jobs = await Job.find().populate("recruiter", "name");
      res.status(200).json({ jobs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
});

//to get all jobs with filtering and pagination feature included
router.get("/", async (req, res) => {
  try {
    const { search, location, jobType, page = 1, limit = 6 } = req.query;
    const query = {};

    // Search by job title, description, or company
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Filter by job type (Full-Time, Part-Time, etc.)
    if (jobType) {
      query.jobType = { $regex: jobType, $options: "i" };
    }

    // Pagination values
    const pageNumber = parseInt(page, 6);
    const limitNumber = parseInt(limit, 6);
    const skip = (pageNumber - 1) * limitNumber;

    // Get total count for pagination
    const totalNumberOfJobs = await Job.countDocuments(query);

    // Fetch jobs with filtering & pagination
    const jobs = await Job.find(query)
      .sort({ postedAt: -1 }) // Sort by latest jobs
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      totalNumberOfJobs,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalNumberOfJobs / limitNumber),
      jobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get all jobs created by a recruiter
router.get("/recruiter/list",jwtAuthMiddleware, async (req, res) => {
  try {
    // Extract recruiter ID from JWT payload
    const recruiterId = req.user.id;

    // Find jobs posted by the recruiter
    const jobs = await Job.find({ recruiter: recruiterId });

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found." });
    }

    res.status(200).json({ jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

//to get all the jobs an applicant have applied for 
router.get("/applied", jwtAuthMiddleware, async (req, res) => {
  try {
    const { id: applicantId, role } = req.user;

    // Ensure only job seekers can access this route
    if (role !== "applicant") {
      return res.status(403).json({ message: "Access denied. Applicants only." });
    }

    // Find all jobs where the applicant has applied
    const jobs = await Job.find({ "applicants.applicantId": applicantId })
      .populate("recruiter", "name email company") // Populate recruiter details
      .select("title company location jobType applicants"); // Select relevant fields

    // Format response to include application status
    const appliedJobs = jobs.map(job => {
      const application = job.applicants.find(app => app.applicantId.toString() === applicantId);
      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        jobType: job.jobType,
        recruiter: job.recruiter,
        applicationStatus: application ? application.status : "Unknown",
      };
    });

    res.status(200).json(appliedJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//to get a specific job by id
router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find job by ID and populate recruiter details
      const job = await Job.findById(id).populate("recruiter", "name");
  
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      res.status(200).json({ job });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
});

//to apply for any particular job
router.post("/apply/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { id: userId, role } = req.user;

    // Only applicants can apply for jobs
    if (role !== "applicant") {
      return res.status(403).json({ message: "Access denied. Only applicants can apply for jobs." });
    }

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the applicant has already applied
    const alreadyApplied = job.applicants.some(app => app.applicantId.toString() === userId);
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    // Add applicant to the job's applicants list
    job.applicants.push({ applicantId: userId });
    await job.save();

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//to get status of a particular job
router.get("/status/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const { id: userId, role } = req.user; // Extract user details from token

    // Ensure only applicants can check application status
    if (role !== "applicant") {
      return res.status(403).json({ message: "Access denied. Only applicants can check application status." });
    }

    // Find the job that contains this application
    const job = await Job.findOne({ "applicants.applicantId": userId })
      .populate("applicants.applicantId", "name email") // Populate applicant details
      .select("title company applicants"); // Select relevant fields

    if (!job) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Find the applicant's specific application
    const application = job.applicants.find(app => app.applicantId._id.toString() === userId);

    if (!application) {
      return res.status(404).json({ message: "Application not found in this job" });
    }

    res.status(200).json({
      jobTitle: job.title,
      company: job.company,
      status: application.status,
      appliedAt: application.appliedAt,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;