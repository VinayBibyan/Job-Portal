import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Job Portal
        </Link>

        {/* Authentication Buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/auth/register')}
            className="text-gray-700 hover:text-blue-600"
          >
            Signup
          </button>
          <button
            onClick={() => navigate('/auth/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
