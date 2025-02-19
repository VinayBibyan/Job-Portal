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
  

// App.js
// // App.js
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';

// const ApplicantProfile = () => {
//   const [isOpen, setIsOpen] = useState(false); // Toggle form visibility
//   const [profiles, setProfiles] = useState([]); // Store profiles
//   const [formData, setFormData] = useState({ name: '', email: '', age: '' });

//   // Handle form input change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setProfiles([...profiles, formData]);
//     setFormData({ name: '', email: '', age: '' }); // Reset form
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex flex-col items-center justify-center p-6">
//       {/* Update Profile Section */}
//       <motion.div
//         className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl"
//         initial={{ opacity: 0, height: 0 }}
//         animate={{ opacity: 1, height: isOpen ? 'auto' : '60px' }}
//         transition={{ duration: 0.8, ease: 'easeInOut' }}
//       >
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-800">Update Profile</h2>
//           <button
//             className="text-blue-600 hover:text-blue-800 font-semibold"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? 'Close' : 'Update'}
//           </button>
//         </div>

//         {/* Form (only visible when isOpen is true) */}
//         {isOpen && (
//           <form className="mt-4" onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">Age</label>
//               <input
//                 type="number"
//                 name="age"
//                 value={formData.age}
//                 onChange={handleInputChange}
//                 className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               Save Profile
//             </button>
//           </form>
//         )}
//       </motion.div>

//       {/* Profile List Section */}
//       <div className="w-full max-w-lg mt-6 p-6 bg-white rounded-lg shadow-xl">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile List</h2>
//         {profiles.length === 0 ? (
//           <p className="text-gray-600">No profiles added yet.</p>
//         ) : (
//           <ul className="space-y-4">
//             {profiles.map((profile, index) => (
//               <li
//                 key={index}
//                 className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-md"
//               >
//                 <h3 className="text-xl font-semibold text-gray-800">{profile.name}</h3>
//                 <p className="text-gray-600">Email: {profile.email}</p>
//                 <p className="text-gray-600">Age: {profile.age}</p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ApplicantProfile;
