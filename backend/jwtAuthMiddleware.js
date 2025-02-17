const jwt = require("jsonwebtoken");
const Applicant = require("./models/applicantSchema");
const Recruiter = require("./models/recruiterSchema");

const jwtAuthMiddleware = async (req, res, next) => {
    try {
        //check if req header has token or not
        const authorization = req.headers.authorization;
        if(!authorization) return res.status(401).json({error: 'header does not have token'});
        
        // Extract jwt token from req header
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info (id, role) to request object
  
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
  };
  
  module.exports = jwtAuthMiddleware;