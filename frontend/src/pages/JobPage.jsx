import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function JobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchJobDetails();
  }, []);

  const fetchJobDetails = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/job/${jobId}`);
      setJob(res.data.job);
    } catch (error) {
      console.error("Error fetching job details", error);
    }
  };

  const applyForJob = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/job/apply/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error applying for job", error);
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!job) {
    return <p className="text-center text-gray-500 mt-10">Loading job details...</p>;
  }

  return (
    <div className="h-screen w-screen p-8 bg-gradient-to-br from-[#8ecae6] to-[#ffb703] flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white shadow-md p-6 rounded-lg mb-6">
        <h1 className="text-5xl font-extrabold text-[#023047]">{job.title}</h1>
        <button 
          onClick={applyForJob} 
          className="bg-[#fb8500] text-white px-8 py-3 rounded-full hover:bg-[#023047] transition"
        >
          Apply
        </button>
      </div>

      {/* Job Details Section */}
      <div className="flex flex-row gap-6">
        {/* Main Job Description */}
        <div className="flex-1 bg-white shadow-lg p-8 rounded-lg border-l-8 border-[#ffb703]">
          <h2 className="text-3xl font-semibold text-[#023047] mb-4">Job Description</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{job.desc}</p>
        </div>

        {/* Job Info Sidebar */}
        <div className="w-1/3 bg-white shadow-lg p-6 rounded-lg border-l-8 border-[#219ebc]">
          <h2 className="text-2xl font-semibold text-[#023047] mb-4">Job Details</h2>
          <p className="text-lg text-gray-700"><strong>Company:</strong> {job.company}</p>
          <p className="text-lg text-gray-700"><strong>Location:</strong> {job.location}</p>
          <p className="text-lg text-gray-700"><strong>Salary:</strong> ${job.salary}</p>
          <p className="text-lg text-gray-700"><strong>Job Type:</strong> {job.jobType}</p>
          <p className="text-lg text-gray-700"><strong>Recruiter:</strong> {job.recruiter.name}</p>
        </div>
      </div>

      {/* Skills Required */}
      <div className="mt-8 p-6 bg-white shadow-lg rounded-lg border-l-8 border-[#ffb703]">
        <h2 className="text-2xl font-semibold text-[#023047] mb-4">Skills Required</h2>
        <div className="flex flex-wrap gap-3">
          {job.skillsRequired.map((skill, index) => (
            <span key={index} className="bg-[#023047] text-white px-4 py-2 rounded-full text-sm">{skill}</span>
          ))}
        </div>
      </div>

      {/* Application Message */}
      {message && <p className="mt-6 text-center text-lg font-semibold text-[#023047]">{message}</p>}
    </div>
  );
}

export default JobPage;
