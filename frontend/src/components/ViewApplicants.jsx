import { useEffect, useState } from "react";
import axios from "axios";

const ViewApplicants = ({ token }) => {
  const [applicants, setApplicants] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/recruiter/applicants`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
      setApplicants(res.data.applicants);
    } catch (error) {
      console.error("Error fetching applicants", error);
    }
  };

  const handleStatusChange = (jobId, applicantId, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [`${jobId}-${applicantId}`]: newStatus }));
  };

  const updateStatus = async (jobId, applicantId) => {
    const statusKey = `${jobId}-${applicantId}`;
    if (!statusUpdates[statusKey]) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/recruiter/${jobId}/applicants/${applicantId}`,
        { status: statusUpdates[statusKey] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplicants();
      window.alert("Application status updated successfully!");
    } catch (error) {
      console.error("Error updating applicant status", error);
    }
  };

  // Function to handle downloading the resume
  const downloadResume = (resumeFilename) => {
    if (resumeFilename) {
      const resumeUrl = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/resume/${resumeFilename}`;
      window.open(resumeUrl, "_blank");
    } else {
      alert("No resume available for this applicant.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-[#023047] mb-6 text-left">Applicants</h2>
      <ul className="space-y-4">
        {applicants.map((applicant) => (
          <li
            key={`${applicant.jobId}-${applicant.applicantId}`}
            className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="space-y-3">
              <h3 className="font-bold text-xl text-[#023047]">{applicant.name}</h3>
              <p className="text-gray-600">{applicant.email}</p>
              <p className="text-gray-700 font-semibold">
                Applied for: <span className="font-normal">{applicant.jobTitle}</span>
              </p>
              <p className="text-gray-700 font-semibold">
                Company: <span className="font-normal">{applicant.company}</span>
              </p>
              <p className="text-gray-700 font-semibold">
                Skills: <span className="text-[#219ebc] font-normal">{applicant.skills.join(", ")}</span>
              </p>

              {/* Updated Resume Section */}
              <div className="flex items-center space-x-3">
                <p className="text-gray-700 font-semibold">Resume:</p>
                {applicant.resume ? (
                  <button
                    onClick={() => downloadResume(applicant.resume)}
                    className="bg-[#219ebc] text-white px-3 py-1 rounded-lg hover:bg-[#1a759f] transition text-sm"
                  >
                    Download Resume
                  </button>
                ) : (
                  <p className="text-gray-500 text-sm">No resume uploaded</p>
                )}
              </div>

              {/* Status Update Section */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
                <label className="font-semibold text-gray-700">Status:</label>
                <select
                  value={statusUpdates[`${applicant.jobId}-${applicant.applicantId}`] || applicant.status}
                  onChange={(e) =>
                    handleStatusChange(applicant.jobId, applicant.applicantId, e.target.value)
                  }
                  className="border rounded-lg p-2 bg-white focus:ring-2 focus:ring-[#fb8500] transition w-full sm:w-auto"
                >
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
                <button
                  onClick={() => updateStatus(applicant.jobId, applicant.applicantId)}
                  className="bg-[#fb8500] text-white px-4 py-2 rounded-lg hover:bg-[#d97706] transition w-full sm:w-auto"
                >
                  Update
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewApplicants;