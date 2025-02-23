import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function LandingPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState(null);


  useEffect(() => {
    fetchJobs();
  }, [page]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token)
    checkUser(token);
  }, [])

  const checkUser = async (token) => {
    if (token) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data.name)
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user profile", error);
        localStorage.removeItem("token"); // Remove invalid token
      }
    }
  };
  

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/job/`, {
        params: { search, page }
      });
      setJobs(res.data.jobs);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching jobs", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col bg-[#f0f8ff]">
      {/* Navbar */}
      <nav className="bg-[#023047] shadow-md py-3 px-6 flex justify-between items-center sticky top-0">
        <Link to="/" className="text-2xl font-bold text-[#ffb703]">Job Portal</Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-[#ffb703] font-semibold">Hi, {user.name}</span>
              
              {/* Profile Button */}
              <button 
                onClick={() => navigate('/auth/profile')} 
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
              >
                Profile
              </button>

              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">
                Logout
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => navigate('/auth/register')} className="text-[#bbdefb] hover:text-[#fb8500]">Signup</button>
              <button onClick={() => navigate('/auth/login')} className="bg-[#fb8500] text-white px-4 py-2 rounded-full hover:bg-[#219ebc] transition">Login</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[32vh] bg-gradient-to-r from-[#219ebc] to-[#bbdefb] flex flex-col justify-center items-center text-center px-4 shadow-md">
        <h1 className="text-5xl font-extrabold text-[#023047]">Find Your Dream Job</h1>
        <p className="mt-2 text-lg text-white">Opportunities that match your skills and passion</p>
        <div className="mt-6 flex items-center bg-white p-2 rounded-lg shadow-md w-full max-w-lg">
          <input type="text" placeholder="Search jobs..." className="p-2 text-black flex-grow focus:outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button onClick={fetchJobs} className="bg-[#ffb703] text-white px-4 py-2 rounded-md hover:bg-[#fb8500] transition">Search</button>
        </div>
      </header>

      {/* Job Listings */}
      <section className="flex-grow overflow-hidden p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className="bg-white p-5 rounded-lg shadow-lg border-l-4 border-[#fb8500] text-left hover:shadow-xl transition min-h-[250px] self-start">
              <h2 className="text-xl font-bold text-[#023047]">{job.title}</h2>
              <p className="text-[#219ebc] mt-1">{job.location}</p>
              <p className="mt-2 text-gray-700">{job.desc}</p>
              <button
                onClick={() => navigate(`/job/${job._id}`)}
                className="mt-4 bg-[#219ebc] text-white px-4 py-2 rounded hover:bg-[#fb8500] transition">Apply
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">No jobs found</p>
        )}
      </section>

      {/* Pagination */}
      <div className="py-4 flex justify-center shadow-md text-black">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} className={`mx-2 px-4 py-2 rounded ${page === 1 ? "bg-gray-500 cursor-not-allowed" : "bg-[#ffb703] text-white hover:bg-[#fb8500]"}`} disabled={page === 1}>Prev</button>
        <span className="mx-2">Page {page} of {totalPages}</span>
        <button onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))} className={`mx-2 px-4 py-2 rounded ${page === totalPages ? "bg-gray-500 cursor-not-allowed" : "bg-[#ffb703] text-white hover:bg-[#fb8500]"}`} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default LandingPage;