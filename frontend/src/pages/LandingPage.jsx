import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import JobListing from '../components/JobListing';
import '../styles/animation.css';

function LandingPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    checkUser(token);
  }, []);

  const checkUser = async (token) => {
    if (token) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user profile', error);
        localStorage.removeItem('token');
      }
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/job/`, {
        params: { search, page },
      });
      setJobs(res.data.jobs);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching jobs', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col bg-[#f0f8ff]">
      <Navbar user={user} handleLogout={handleLogout} />
      <HeroSection search={search} setSearch={setSearch} fetchJobs={fetchJobs} />
      <JobListing jobs={jobs} page={page} totalPages={totalPages} setPage={setPage} navigate={navigate} />
    </div>
  );
}

export default LandingPage;