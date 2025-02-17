import { useEffect, useState } from "react";
import axios from "axios";

const ViewApplicants = ({ token }) => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/recruiter/applicants`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplicants(res.data.applicants);
    } catch (error) {
      console.error("Error fetching applicants", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#023047]">Applicants</h2>
      <ul className="mt-4 space-y-2">
        {applicants.map((applicant) => (
          <li key={applicant.applicantId} className="p-4 border rounded bg-white shadow">
            <h3 className="font-bold text-lg">{applicant.name}</h3>
            <p className="text-gray-600">{applicant.email}</p>
            <p className="text-gray-500">Applied for: {applicant.jobTitle}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewApplicants;
