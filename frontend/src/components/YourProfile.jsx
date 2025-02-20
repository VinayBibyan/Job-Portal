import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaFileAlt,
  FaBriefcase,
  FaGraduationCap,
  FaTools,
  FaPhone,
  FaEdit,
  FaSave,
} from "react-icons/fa";

const YourProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profile: {
      resume: "",
      skills: [],
      experience: "",
      education: "",
      contact: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data);
        setFormData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("profile.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          skills: [...prev.profile.skills, newSkill.trim()],
        },
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(response.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 mb-6">
      <h1 className="text-lg font-bold text-[#023047] mb-4 flex items-center">
        Your Profile
      </h1>

      {/* Profile Header */}
      <div className="flex items-center justify-between bg-[#bbdefb] p-4 rounded-lg shadow-sm border-l-4 border-[#219ebc]">
        <div className="flex items-center">
          <FaUser className="text-[#fb8500] mr-3" size={48} />
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 text-xl font-bold text-[#023047]"
            />
          ) : (
            <h2 className="text-3xl font-bold text-[#023047]">{user.name}</h2>
          )}
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-[#219ebc] text-xl"
        >
          {isEditing ? <FaSave size={24} /> : <FaEdit size={24} />}
        </button>
      </div>

      {/* Email */}
      <p className="text-gray-600 flex items-center mt-3">
        <FaEnvelope className="text-[#fb8500] mr-2" />
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
          />
        ) : (
          user.email
        )}
      </p>

      {/* Profile Details */}
      <div className="mt-4">
        <h3 className="text-lg font-bold text-[#023047] mb-2 border-b pb-2 flex items-center">
          <FaBriefcase className="text-[#219ebc] mr-2" /> Profile Details
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            {/* Resume */}
            <p className="text-[#023047] font-medium flex items-center">
              <FaFileAlt className="text-[#fb8500] mr-2" />
              <span className="font-semibold pr-1">Resume: </span>
              {isEditing ? (
                <input
                  type="text"
                  name="profile.resume"
                  value={formData.profile.resume}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                />
              ) : (
                user.profile.resume
              )}
            </p>

            {/* Skills */}
            <p className="text-[#023047] font-medium flex items-center">
              <FaTools className="text-[#fb8500] mr-2" />
              <span className="font-semibold">Skills:</span>
              {isEditing ? (
                <div className="ml-2 flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 flex-1"
                      placeholder="Type a skill"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-[#219ebc] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#176582]"
                    >
                      Add Skill
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-[#e3f2fd] text-[#023047] px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="text-red-500 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <span className="ml-1">
                  {user.profile.skills.join(", ")}
                </span>
              )}
            </p>

            {/* Experience */}
            <p className="text-[#023047] font-medium flex items-center">
              <FaBriefcase className="text-[#219ebc] mr-2" />
              <span className="font-semibold pr-1">Experience: </span>
              {isEditing ? (
                <input
                  type="text"
                  name="profile.experience"
                  value={formData.profile.experience}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                />
              ) : (
                user.profile.experience
              )}
            </p>

            {/* Education */}
            <p className="text-[#023047] font-medium flex items-center">
              <FaGraduationCap className="text-[#fb8500] mr-2" />
              <span className="font-semibold pr-1">Education: </span>
              {isEditing ? (
                <input
                  type="text"
                  name="profile.education"
                  value={formData.profile.education}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                />
              ) : (
                user.profile.education
              )}
            </p>

            {/* Contact */}
            <p className="text-[#023047] font-medium flex items-center">
              <FaPhone className="text-[#219ebc] mr-2" />
              <span className="font-semibold pr-1">Contact: </span>
              {isEditing ? (
                <input
                  type="text"
                  name="profile.contact"
                  value={formData.profile.contact}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                />
              ) : (
                user.profile.contact
              )}
            </p>
          </div>
          {isEditing && (
            <button
              type="submit"
              className="mt-4 bg-[#219ebc] text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default YourProfile;
