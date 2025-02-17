import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RecruiterProfile from "../components/RecruiterProfile";
import ApplicantProfile from "../components/ApplicantProfile";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
  if (!user) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="">
      {user.role === "recruiter" ? (
        <RecruiterProfile user={user} />
      ) : (
        <ApplicantProfile user={user} />
      )}
    </div>
  );
};

export default ProfilePage;