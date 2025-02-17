import { useState } from "react";
import axios from "axios";

const AddJobs = ({ token, fetchJobs }) => {
  const [skillInput, setSkillInput] = useState("");
  const [jobData, setJobData] = useState({
    title: "",
    desc: "",
    company: "",
    location: "",
    salary: "",
    jobType: "Full-Time",
    skillsRequired: [],
  });

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (skillInput.trim() && !jobData.skillsRequired.includes(skillInput.trim())) {
      setJobData({
        ...jobData,
        skillsRequired: [...jobData.skillsRequired, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setJobData({
      ...jobData,
      skillsRequired: jobData.skillsRequired.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/recruiter/newJob`,
        jobData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Job posted successfully");
      setJobData({
        title: "",
        desc: "",
        company: "",
        location: "",
        salary: "",
        jobType: "Full-Time",
        skillsRequired: [],
      });
      if (fetchJobs) fetchJobs();
    } catch (error) {
      console.error("Error posting job", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#023047]">Post a New Job</h2>
      <form onSubmit={handleJobSubmit} className="space-y-4 mt-4">
        <input
          type="text"
          name="title"
          value={jobData.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="desc"
          value={jobData.desc}
          onChange={handleChange}
          placeholder="Job Description"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="company"
          value={jobData.company}
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="location"
          value={jobData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="salary"
          value={jobData.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="w-full p-2 border rounded"
        />
        <select
          name="jobType"
          value={jobData.jobType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>

        {/* Skills Input */}
        <div className="w-full p-2 border rounded flex flex-wrap items-center gap-2">
          {jobData.skillsRequired.map((skill, index) => (
            <span key={index} className="bg-gray-200 px-2 py-1 rounded-full flex items-center">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="ml-2 text-red-500">
                &times;
              </button>
            </span>
          ))}
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add a skill"
            className="p-2 rounded flex-1"
          />
          <button type="button" onClick={addSkill} className="px-4 py-2 bg-[#fb8500] text-white rounded">
            Add Skill
          </button>
        </div>

        <button type="submit" className="w-full py-3 bg-[#fb8500] text-white font-bold rounded">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default AddJobs;
