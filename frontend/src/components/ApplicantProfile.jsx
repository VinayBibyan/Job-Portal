import React from "react";
import { useNavigate } from "react-router-dom";
import YourProfile from "./YourProfile";
import AppliedJobs from "./AppliedJobs";

const ApplicantProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      <YourProfile />
      <AppliedJobs />

      {/* Search Job Button */}
      <div className="mt-10 flex justify-center">
        <button 
          onClick={() => navigate("/")} 
          className="mt-6 bg-[#ffb703] text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#fb8500] transition duration-300 ease-in-out"
        >
          🔍 Search Job
        </button>
        </div>
    </div>
  );
};

export default ApplicantProfile;
