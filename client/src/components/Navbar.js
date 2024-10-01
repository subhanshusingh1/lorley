import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faUserTie, faSignInAlt, faSignOutAlt, faUserCircle, faStar, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../actions/authActions';
import { logoutBusiness } from '../actions/businessAction';
import { searchBusinesses } from '../actions/businessAction';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu toggle
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const isUserLoggedIn = !!Cookies.get('accessToken');
  const isBusinessLoggedIn = !!Cookies.get('refreshToken');

  const handleSearch = async (e) => {
    e.preventDefault();
    const results = await dispatch(searchBusinesses(searchQuery));
    if (results.length > 0) {
      navigate('/business-listing', { state: { results } });
    } else {
      navigate('/');
      toast.info('No results found, please try another search.');
    }
  };

  const toggleBusinessDropdown = () => {
    setIsBusinessDropdownOpen(!isBusinessDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('You have logged out successfully!');
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleBusinessLogout = () => {
    dispatch(logoutBusiness());
    toast.success('Business logged out successfully!');
    setTimeout(() => {
      navigate('/');
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
      <div className="container mx-auto">
        {/* Desktop and Tablet Navbar */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-white hover:text-blue-400 transition duration-300">
            Lorley
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-grow mx-8 max-w-lg flex items-center">
            <input
              type="text"
              placeholder="Search for businesses & services near you."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-400 rounded-l-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-r-lg px-4 py-2 hover:bg-blue-700 transition duration-300"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>

          {/* Navigation Links */}
          <ul className="flex items-center space-x-8">
            {!isUserLoggedIn && !isBusinessLoggedIn && (
              <>
                <li>
                  <Link to="/login" className="text-white hover:text-blue-400 transition duration-300">
                    <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-white hover:text-blue-400 transition duration-300">
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                    Register
                  </Link>
                </li>
              </>
            )}
            {isUserLoggedIn && (
              <>
                <li>
                  <Link to="/profile" className="text-white hover:text-blue-400 transition duration-300">
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/business/review" className="text-white hover:text-blue-400 transition duration-300">
                    <FontAwesomeIcon icon={faStar} />
                    Add Review
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-white hover:text-blue-400 transition duration-300">
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </li>
              </>
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
                      <li>
                        <button
                          onClick={handleBusinessLogout}
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
          </ul>
        </div>

        {/* Mobile Navbar */}
        <div className="flex md:hidden items-center justify-between">
          <Link to="/" className="text-3xl font-bold text-white">
            Lorley
          </Link>

          {/* Hamburger menu for mobile */}
          <button
            className="text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>

        {/* Mobile Menu (Sliding from the left) */}
        {/* Mobile Menu (Sliding from the left) */}
        <div className={`fixed top-0 left-0 h-full bg-gray-900 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 w-64`}>
          <div className="flex flex-col p-4 space-y-4">
            <button
              className="self-end text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>

            {/* Logo */}
            <Link to="/" className="text-3xl font-bold text-white">
              Lorley
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mt-4 flex">
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-400 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg px-4 py-2 ml-2 hover:bg-blue-700 transition duration-300"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>

            {/* User Section */}
            <h2 className="text-lg text-white font-semibold mt-6">User</h2>
            <ul className="flex flex-col space-y-4">
              {!isUserLoggedIn && (
                <>
                  <li>
                    <Link to="/login" className="text-white hover:text-blue-400 transition duration-300">
                      <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-white hover:text-blue-400 transition duration-300">
                      <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                      Register
                    </Link>
                  </li>
                </>
              )}
              {isUserLoggedIn && (
                <>
                  <li>
                    <Link to="/profile" className="text-white hover:text-blue-400 transition duration-300">
                      <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/business/review" className="text-white hover:text-blue-400 transition duration-300">
                      <FontAwesomeIcon icon={faStar} />
                      Add Review
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-white hover:text-blue-400 transition duration-300">
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>

            {/* Business Section */}
            <h2 className="text-lg text-white font-semibold mt-6">Business</h2>
            <ul className="flex flex-col space-y-4">
              <li>
                <Link to="/business/register" className="text-white hover:text-blue-400 transition duration-300">
                  <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                  Register Business
                </Link>
              </li>
              <li>
                <Link to="/business/login" className="text-white hover:text-blue-400 transition duration-300">
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                  Login to Business
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
