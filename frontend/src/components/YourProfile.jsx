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
  FaUpload,
  FaDownload,
  FaTimes
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
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

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

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setUploadStatus("Only PDF files are allowed!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus("File size exceeds 5MB limit!");
        return;
      }
      setResumeFile(file);
      setUploadStatus(`Selected: ${file.name}`);
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
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      
      // Add form data fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      
      // Add profile fields
      if (formData.profile.experience) {
        formDataToSend.append("profile[experience]", formData.profile.experience);
      }
      if (formData.profile.education) {
        formDataToSend.append("profile[education]", formData.profile.education);
      }
      if (formData.profile.contact) {
        formDataToSend.append("profile[contact]", formData.profile.contact);
      }
      
      // Add skills as an array
      formData.profile.skills.forEach((skill, index) => {
        formDataToSend.append(`profile[skills][${index}]`, skill);
      });
      
      // Add resume file if selected
      if (resumeFile) {
        formDataToSend.append("resume", resumeFile);
      }
      
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      setUser(response.data.user);
      setIsEditing(false);
      setResumeFile(null);
      setUploadStatus("");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDownloadResume = () => {
    if (user?.profile?.resume) {
      window.open(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/resume/${user.profile.resume}`,
      );
    }
  };

  const clearResumeSelection = () => {
    setResumeFile(null);
    setUploadStatus("");
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <>
    <h1 className="text-lg font-bold text-[#023047] mb-4 flex items-center">
        Your Profile
      </h1>
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 mb-6">
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
            <div className="text-[#023047] font-medium">
              <div className="flex items-center">
                <FaFileAlt className="text-[#fb8500] mr-2" />
                <span className="font-semibold pr-1">Resume: </span>
                
                {!isEditing ? (
                  <>
                    {user.profile.resume ? (
                      <div className="flex items-center">
                        <span className="ml-1">{user.profile.resume}</span>
                        <button
                          type="button"
                          onClick={handleDownloadResume}
                          className="ml-2 text-[#219ebc]"
                          title="Download Resume"
                        >
                          <FaDownload />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 ml-1">No resume uploaded</span>
                    )}
                  </>
                ) : (
                  <div className="ml-1 flex-1">
                    {uploadStatus ? (
                      <div className="flex items-center bg-blue-50 p-2 rounded">
                        <span className="flex-1">{uploadStatus}</span>
                        <button
                          type="button"
                          onClick={clearResumeSelection}
                          className="text-red-500"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <>
                        {user.profile.resume ? (
                          <div className="flex items-center bg-blue-50 p-2 rounded">
                            <span className="flex-1">{user.profile.resume}</span>
                            <button
                              type="button"
                              onClick={handleDownloadResume}
                              className="text-[#219ebc] mr-2"
                              title="Download Resume"
                            >
                              <FaDownload />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500">No resume uploaded</span>
                        )}
                      </>
                    )}
                    <div className="mt-2">
                      <label className="flex items-center p-2 rounded-lg bg-[#219ebc] text-white cursor-pointer hover:bg-[#176582] w-fit">
                        <FaUpload className="mr-2" />
                        <span>Upload New Resume</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleResumeChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Only PDF files up to 5MB are allowed
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                  {user.profile.skills && user.profile.skills.length > 0 
                    ? user.profile.skills.join(", ") 
                    : "No skills added"}
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
                  value={formData.profile.experience || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                />
              ) : (
                user.profile.experience || "Not specified"
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
                  value={formData.profile.education || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                />
              ) : (
                user.profile.education || "Not specified"
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
                  value={formData.profile.contact || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                />
              ) : (
                user.profile.contact || "Not specified"
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
    </>
  );
};

export default YourProfile;
