import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, handleLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="bg-[#000428] shadow-md py-3 px-6 flex justify-between items-center sticky top-0">
      <Link to="/" className="text-2xl font-bold text-[#ffb703]">Job Portal</Link>
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-[#ffb703] font-semibold">Hi, {user.name}</span>
            <button
              onClick={() => navigate('/auth/profile')}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate('/auth/register')}
              className="text-[#bbdefb] hover:text-[#fb8500]"
            >
              Signup
            </button>
            <button
              onClick={() => navigate('/auth/login')}
              className="bg-[#fb8500] text-white px-4 py-2 rounded-full hover:bg-[#219ebc] transition"
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;