const ApplicantProfile = ({ user }) => {
    return (
      <div className="bg-[#8ecae6] p-6 shadow-lg rounded-xl max-w-3xl mx-auto text-[#023047]">
        <h2 className="text-4xl font-extrabold text-center text-[#023047]">Applicant Profile</h2>
        <p className="text-lg font-medium text-center mt-2">{user.name}</p>
  
        {/* Profile Update Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-6">
          <h3 className="text-2xl font-semibold text-[#fb8500] border-b-2 border-[#ffb703] pb-2">Profile Section</h3>
          <p className="text-gray-700 mt-2">Update your profile details here...</p>
        </div>
  
        {/* Applied Jobs */}
        <h3 className="text-2xl font-semibold text-[#fb8500] mt-6 border-b-2 border-[#ffb703] pb-2">Applied Jobs</h3>
        <div className="mt-4 space-y-3">
          {user.appliedJobs && user.appliedJobs.length > 0 ? (
            user.appliedJobs.map((job) => (
              <div key={job._id} className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold text-[#219ebc]">{job.title}</h4>
                <p className="text-gray-600">Status: {job.status}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-700 text-center">No jobs applied yet.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default ApplicantProfile;
  