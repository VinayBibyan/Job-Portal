import React from "react";
import YourProfile from "./YourProfile";
import AppliedJobs from "./AppliedJobs";

const ApplicantProfile = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <YourProfile />
      <AppliedJobs />
    </div>
  );
};

export default ApplicantProfile;
