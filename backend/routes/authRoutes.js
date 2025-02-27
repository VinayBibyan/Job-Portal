const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtAuthMiddleware = require("../jwtAuthMiddleware");
const Applicant = require("../models/applicantSchema");
const Recruiter = require("../models/recruiterSchema");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/resumes';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original name and timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure file filter for PDF only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

//to register new applicant or recruiter
router.post('/register', async(req, res) =>{
    try {
        const data = req.body
        console.log("Received data:", req.body);
        // check if user already exist
        const existingApplicant = await Applicant.findOne({email: data.email})
        const existingRecruiter = await Recruiter.findOne({email: data.email})
        if (existingApplicant || existingRecruiter) {
            return res.status(400).json({ message: "User already exists" });
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        let user;
        if(data.role == "recruiter"){
            user = new Recruiter({
                name: data.name,
                email: data.email,
                password: hashedPassword,
            })
        }else if(data.role == "applicant"){
            user = new Applicant({
                name: data.name,
                email: data.email,
                password: hashedPassword,
            });
        }else{
            return res.status(400).json({ message: "Invalid role" });
        }
        //save user
        await user.save();
        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).json({ message: "User registered successfully", token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

//to login applicant or recruiter
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists in Applicant or Recruiter model
        let user = await Applicant.findOne({ email }) || await Recruiter.findOne({ email });

        if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
        });

        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

//to get user information 
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
    try {
      const { id, role } = req.user;
  
      let user;
      if (role === "applicant") {
        user = await Applicant.findById(id)
          .select("-password") // Exclude password
          .populate("appliedJobs.jobId", "title company location");  // Populate job details
      } else if (role === "recruiter") {
        user = await Recruiter.findById(id)
          .select("-password")
          .populate("postedJobs.jobId", "title company location salary jobType");

        // Transform postedJobs to remove the extra 'jobId' nesting
        user = user.toObject(); // Convert Mongoose document to plain object
        user.postedJobs = user.postedJobs.map(job => job.jobId); 
        
      }
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
});

// Update profile route to handle file upload
router.put("/profile", jwtAuthMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const { id, role } = req.user;
    const updateData = req.body;
    
    // Handle file upload for applicants
    if (role === "applicant" && req.file) {
      // If profile doesn't exist in updateData, create it
      if (!updateData.profile) {
        updateData.profile = {};
      }
      
      // Store the file path in the resume field
      updateData.profile.resume = req.file.filename;
    }

    let user;
    if (role === "applicant") {
      // Handle nested profile object correctly
      if (updateData.profile) {
        const existingUser = await Applicant.findById(id);
        if (existingUser && existingUser.profile) {
          // Merge existing profile with updates
          updateData.profile = { ...existingUser.profile, ...updateData.profile };
        }
      }
      
      user = await Applicant.findByIdAndUpdate(id, updateData, { new: true })
        .select("-password")
        .populate("appliedJobs.jobId", "title company location");
    } else if (role === "recruiter") {
      user = await Recruiter.findByIdAndUpdate(id, updateData, { new: true })
        .select("-password")
        .populate("postedJobs.jobId", "title company location salary jobType");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add a route to serve resume files
router.get("/resume/:filename", (req, res) => {
  const filename = req.params.filename;
  if (filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ message: "Invalid filename" });
  }
  
  const filePath = path.join(__dirname, "../uploads/resumes", filename);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.contentType("application/pdf");
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

module.exports = router;