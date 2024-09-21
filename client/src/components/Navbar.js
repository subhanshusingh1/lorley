import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/authActions';

// Import Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/business?search=${searchQuery}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Toggle Business Dropdown
  const toggleBusinessDropdown = () => {
    setIsBusinessDropdownOpen(!isBusinessDropdownOpen);
  };

  return (
    <nav className="bg-gray-900 fixed top-0 left-0 w-full z-50 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between space-x-12">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" className="text-2xl font-bold text-white">
            Lorley
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex-grow mx-8">
          <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search for businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-l-lg py-2 px-4 w-full focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-r-lg px-4 hover:bg-blue-600 transition"
            >
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center space-x-8">
          {!isAuthenticated && (
            <>
              <li>
                <Link
                  to="/login"
                  className={`text-white hover:text-blue-500 ${
                    location.pathname === '/login' ? 'font-bold' : ''
                  }`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className={`text-white hover:text-blue-500 ${
                    location.pathname === '/register' ? 'font-bold' : ''
                  }`}
                >
                  Register
                </Link>
              </li>
            </>
          )}

          {/* Business Dropdown */}
          <li className="relative">
            <button
              onClick={toggleBusinessDropdown}
              className={`text-white hover:text-blue-500 focus:outline-none flex items-center ${
                isBusinessDropdownOpen ? 'font-bold' : ''
              }`}
            >
              Business
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {isBusinessDropdownOpen && (
              <ul className="absolute bg-white text-gray-800 right-0 mt-2 shadow-lg rounded-lg overflow-hidden w-48">
                <li>
                  <Link
                    to="/business/register"
                    className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => setIsBusinessDropdownOpen(false)} // Close dropdown when clicked
                  >
                    <FontAwesomeIcon icon={faPlusCircle} /> {/* Add Business Icon */}
                    <span>Add a Business</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/business/login"
                    className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => setIsBusinessDropdownOpen(false)} // Close dropdown when clicked
                  >
                    <FontAwesomeIcon icon={faSignInAlt} /> {/* Login Icon */}
                    <span>Login to Business Account</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {isAuthenticated && (
            <li>
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-500"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
