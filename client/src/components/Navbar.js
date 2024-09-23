import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faSignInAlt, faUserCircle, faListAlt, faStar } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/business?search=${searchQuery}`);
  };

  const toggleBusinessDropdown = () => {
    setIsBusinessDropdownOpen(!isBusinessDropdownOpen);
  };

  return (
    <nav className="bg-gray-900 w-full z-50 p-4 shadow-lg">
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
          {/* Login and Register Links */}
          <li>
            <Link
              to="/login"
              className={`text-white hover:text-blue-500 ${location.pathname === '/login' ? 'font-bold' : ''}`}
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className={`text-white hover:text-blue-500 ${location.pathname === '/register' ? 'font-bold' : ''}`}
            >
              Register
            </Link>
          </li>

          {/* User Profile Link */}
          <li>
            <Link
              to="/profile"
              className={`text-white hover:text-blue-500 flex items-center space-x-2 ${location.pathname === '/profile' ? 'font-bold' : ''}`}
            >
              <FontAwesomeIcon icon={faUserCircle} />
              <span>User Profile</span>
            </Link>
          </li>

          {/* Business Dropdown */}
          <li className="relative">
            <button
              onClick={toggleBusinessDropdown}
              className={`text-white hover:text-blue-500 focus:outline-none flex items-center ${isBusinessDropdownOpen ? 'font-bold' : ''}`}
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
                    onClick={() => setIsBusinessDropdownOpen(false)}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} />
                    <span>Add a Business</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/business/login"
                    className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => setIsBusinessDropdownOpen(false)}
                  >
                    <FontAwesomeIcon icon={faSignInAlt} />
                    <span>Login to Business Account</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/business/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => setIsBusinessDropdownOpen(false)}
                  >
                    <span>Business Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/business/profile"
                    className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => setIsBusinessDropdownOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUserCircle} />
                    <span>Business Profile</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Business Listing Link */}
          <li>
            <Link
              to="/business/listing"
              className={`text-white hover:text-blue-500 flex items-center space-x-2 ${location.pathname === '/business/listing' ? 'font-bold' : ''}`}
            >
              <FontAwesomeIcon icon={faListAlt} />
              <span>Business Listing</span>
            </Link>
          </li>

          {/* Add Review Link */}
          <li>
            <Link
              to="/business/review"
              className={`text-white hover:text-blue-500 flex items-center space-x-2 ${location.pathname === '/business/review' ? 'font-bold' : ''}`}
            >
              <FontAwesomeIcon icon={faStar} />
              <span>Add Review</span>
            </Link>
          </li>

          {/* Logout Link (Visible for testing) */}
          <li>
            <button
              className="text-white hover:text-red-500"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
