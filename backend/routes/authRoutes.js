const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtAuthMiddleware = require("../jwtAuthMiddleware")
const Applicant = require("../models/applicantSchema");
const Recruiter = require("../models/recruiterSchema");
const router = express.Router();

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

//to update data into user profile
router.put("/profile", jwtAuthMiddleware, async (req, res) => {
    try {
      const { id, role } = req.user;
      const updateData = req.body; // Data sent from the frontend
  
      let user;
      if (role === "applicant") {
        user = await Applicant.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
      } else if (role === "recruiter") {
        user = await Recruiter.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
      }
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;