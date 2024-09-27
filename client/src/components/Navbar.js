import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faUserTie, faSignInAlt, faSignOutAlt, faUserCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../actions/authActions'; // Import your logout action
import { logoutBusiness } from '../actions/businessAction';
import Cookies from 'js-cookie'; // Import js-cookie for cookie handling

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  // Check if user or business is logged in
  const isUserLoggedIn = !!Cookies.get('accessToken'); // Check for user access token
  const isBusinessLoggedIn = !!Cookies.get('refreshToken'); // Check for business refresh token

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/business?search=${searchQuery}`);
};

  const toggleBusinessDropdown = () => {
    setIsBusinessDropdownOpen(!isBusinessDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('You have logged out successfully!');
    setTimeout(() => {
      navigate('/'); // Redirect after logout
    }, 2000);
  };

  const handleBusinessLogout = () => {
    dispatch(logoutBusiness());
    toast.success('Business logged out successfully!');
    setTimeout(() => {
      navigate('/'); // Redirect after logout
    }, 2000);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsBusinessDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="bg-gray-900 w-full z-50 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between space-x-12">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" className="text-3xl font-bold text-white hover:text-blue-400 transition duration-300">
            Lorley
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex-grow mx-8">
          <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search for best local businesses & services near you."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-400 rounded-l-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-r-lg px-4 hover:bg-blue-700 transition duration-300"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center space-x-8">
          {/* User Links */}
          {!isUserLoggedIn && !isBusinessLoggedIn && (
            <>
              <li>
                <Link
                  to="/login"
                  className={`text-white hover:text-blue-400 transition duration-300 ${location.pathname === '/login' ? 'font-bold' : ''}`}
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className={`text-white hover:text-blue-400 transition duration-300 ${location.pathname === '/register' ? 'font-bold' : ''}`}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                  Register
                </Link>
              </li>
            </>
          )}

          {/* User Profile Link */}
          {isUserLoggedIn && (
            <li>
              <Link
                to="/profile"
                className={`text-white hover:text-blue-400 transition duration-300 ${location.pathname === '/profile' ? 'font-bold' : ''}`}
              >
                <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                Profile
              </Link>
            </li>
          )}

          {/* Business Dropdown */}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={toggleBusinessDropdown}
              className={`text-white hover:text-blue-400 transition duration-300 flex items-center ${isBusinessDropdownOpen ? 'font-bold' : ''}`}
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
                {!isBusinessLoggedIn && (
                  <>
                    <li>
                      <Link
                        to="/business/register"
                        className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                        onClick={() => setIsBusinessDropdownOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUserPlus} />
                        <span>Register Business</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/business/login"
                        className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                        onClick={() => setIsBusinessDropdownOpen(false)}
                      >
                        <FontAwesomeIcon icon={faSignInAlt} />
                        <span>Login to Business</span>
                      </Link>
                    </li>
                  </>
                )}
                {isBusinessLoggedIn && (
                  <>
                    <li>
                      <Link
                        to="/business/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                        onClick={() => setIsBusinessDropdownOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUserTie} aria-hidden="true" />
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
                    {/* Logout for Business */}
                    <li>
                      <button
                        onClick={handleBusinessLogout} // Connect logout function
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-red-500" />
                        <span className="text-red-500">Logout</span>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            )}
          </li>

          {/* Add Review Link - Only show if a user is logged in */}
          {isUserLoggedIn && (
            <li>
              <Link
                to="/business/review"
                className={`text-white hover:text-blue-400 transition duration-300 flex items-center space-x-2 ${location.pathname === '/business/review' ? 'font-bold' : ''}`}
              >
                <FontAwesomeIcon icon={faStar} />
                <span>Add Review</span>
              </Link>
            </li>
          )}

          {/* Logout Link */}
          {isUserLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className="text-white hover:text-blue-400 transition duration-300 flex items-center"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
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
