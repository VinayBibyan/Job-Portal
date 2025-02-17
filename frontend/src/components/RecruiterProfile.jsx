import { useState, useEffect } from "react";
import axios from "axios";
import AddJobs from "../components/AddJobs";
import ManageJobs from "../components/ManageJobs";
import ViewApplicants from "../components/ViewApplicants";

const RecruiterProfile = () => {
  const [activeTab, setActiveTab] = useState("addJob");
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/job/recruiter/list`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(res.data.jobs);
    } catch (error) {
      console.error("Error fetching jobs", error);
    }
  };

  // Refresh jobs when switching to Manage Jobs tab.
  useEffect(() => {
    if (activeTab === "manageJobs") {
      fetchJobs();
    }
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-[#f0f8ff]">
      {/* Sidebar */}
      <div className="w-1/5 bg-[#023047] text-white p-6 space-y-4">
        <button
          className="w-full py-3 text-lg font-bold bg-[#fb8500] rounded-lg"
          onClick={() => setActiveTab("addJob")}
        >
          Add Job
        </button>
        <button
          className="w-full py-3 text-lg font-bold bg-[#219ebc] rounded-lg"
          onClick={() => setActiveTab("manageJobs")}
        >
          Manage Jobs
        </button>
        <button
          className="w-full py-3 text-lg font-bold bg-[#ffb703] rounded-lg"
          onClick={() => setActiveTab("viewApplicants")}
        >
          View Applicants
        </button>
      </div>
      {/* Main Content */}
      <div className="w-4/5 p-6 overflow-y-auto">
        {activeTab === "addJob" && <AddJobs token={token} fetchJobs={fetchJobs} />}
        {activeTab === "manageJobs" && (
          <ManageJobs jobs={jobs} token={token} fetchJobs={fetchJobs} />
        )}
        {activeTab === "viewApplicants" && <ViewApplicants token={token} />}
      </div>
    </div>
  );
};

export default RecruiterProfile;