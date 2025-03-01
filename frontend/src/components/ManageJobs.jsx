import React, { useState } from "react";
import axios from "axios";

const ManageJobs = ({ jobs, token, fetchJobs }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [editJobData, setEditJobData] = useState(null);
  const [newSkill, setNewSkill] = useState(""); 

  const handleEdit = (job) => {
    setSelectedJob(job._id);
    setEditJobData({ ...job });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditJobData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding skills
  const handleAddSkill = () => {
    if (newSkill.trim() && !editJobData.skillsRequired.includes(newSkill.trim())) {
      setEditJobData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  // Handle removing skills
  const handleRemoveSkill = (skillToRemove) => {
    setEditJobData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleUpdate = async (jobId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/recruiter/${jobId}`,
        editJobData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchJobs();
      setSelectedJob(null);
      window.alert("Job updated successfully! ✅"); 
    } catch (error) {
      console.error("Error updating job", error);
      window.alert("Failed to update job. Please try again. ❌"); 
    }
  };

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/recruiter/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job", error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-[#023047] mb-6">Manage Jobs</h2>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full border border-gray-300 bg-white rounded-lg">
          <thead>
            <tr className="bg-[#fb8500] text-white text-left">
              <th className="p-4 border-b">#</th>
              <th className="p-4 border-b">Job Title</th>
              <th className="p-4 border-b">Company</th>
              <th className="p-4 border-b">Location</th>
              <th className="p-4 border-b">Salary</th>
              <th className="p-4 border-b">Job Type</th>
              <th className="p-4 border-b">Skills</th> 
              <th className="p-4 border-b">Applicants</th>
              <th className="p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr
                key={job._id}
                className={`border-t hover:bg-[#ffedd5] transition duration-200 ${
                  selectedJob === job._id ? "bg-yellow-100" : ""
                }`}
              >
                <td className="p-4 font-semibold">{index + 1}</td>
                <td className="p-4 font-medium text-[#023047]">
                  {selectedJob === job._id ? (
                    <input
                      type="text"
                      name="title"
                      value={editJobData.title}
                      onChange={handleEditChange}
                      className="border p-1 rounded"
                    />
                  ) : (
                    job.title
                  )}
                </td>
                <td className="p-4">
                  {selectedJob === job._id ? (
                    <input
                      type="text"
                      name="company"
                      value={editJobData.company}
                      onChange={handleEditChange}
                      className="border p-1 rounded"
                    />
                  ) : (
                    job.company
                  )}
                </td>
                <td className="p-4">
                  {selectedJob === job._id ? (
                    <input
                      type="text"
                      name="location"
                      value={editJobData.location}
                      onChange={handleEditChange}
                      className="border p-1 rounded"
                    />
                  ) : (
                    job.location
                  )}
                </td>
                <td className="p-4">
                  {selectedJob === job._id ? (
                    <input
                      type="text"
                      name="salary"
                      value={editJobData.salary}
                      onChange={handleEditChange}
                      className="border p-1 rounded"
                    />
                  ) : (
                    `$${job.salary}`
                  )}
                </td>
                <td className="p-4 text-[#219ebc] font-semibold">{job.jobType}</td>

                <td className="p-4">
                  {selectedJob === job._id ? (
                    <div className="flex flex-wrap gap-2">
                      {editJobData.skillsRequired.map((skill, idx) => (
                        <span key={idx} className="bg-gray-200 px-2 py-1 rounded-full flex items-center">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-red-500"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        placeholder="Add skill"
                        className="p-1 border rounded"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-2 bg-green-500 text-white rounded"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    job.skillsRequired.join(", ")
                  )}
                </td>

                <td className="p-4 font-semibold text-[#d00000]">{job.applicants.length}</td>
                <td className="p-4 flex space-x-2">
                  {selectedJob === job._id ? (
                    <button
                      onClick={() => handleUpdate(job._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(job)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageJobs;
