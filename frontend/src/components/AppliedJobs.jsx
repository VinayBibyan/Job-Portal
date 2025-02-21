import React, { useEffect, useState } from "react";
import axios from "axios";

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/job/applied`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setJobs(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch applied jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  if (loading) return <div>Loading applied jobs...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <>
    <h1 className="text-lg font-bold text-[#023047] mb-4 p-4">
        Applied Jobs
      </h1>
    <div className=" shadow-lg rounded-lg border border-gray-200">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-[#bbdefb] text-gray-700 text-left">
              <th className="py-3 px-6">Title</th>
              <th className="py-3 px-6">Company</th>
              <th className="py-3 px-6">Location</th>
              <th className="py-3 px-6">Salary</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr
                key={job.jobId}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-[#f1f8fe] transition-all`}
              >
                <td className="py-3 px-6">{job.title}</td>
                <td className="py-3 px-6">{job.company}</td>
                <td className="py-3 px-6">{job.location}</td>
                <td className="py-3 px-6">${job.salary}</td>
                <td className="py-3 px-6 font-semibold text-blue-600">
                  {job.applicationStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default AppliedJobs;
