import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/authActions';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/business?search=${searchQuery}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
<nav className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'} p-4`}>
    <div className="container mx-auto flex items-center justify-between">
        <div className="navbar-logo">
          <Link to="/" className="text-2xl font-bold text-blue-500">Lorley</Link>
        </div>
        <form onSubmit={handleSearch} className="flex flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search for businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-l-lg py-2 px-4 w-full focus:outline-none focus:ring focus:border-blue-300"
          />
          <button type="submit" className="bg-blue-500 text-white rounded-r-lg px-4 hover:bg-blue-600 transition">
            <i className="fas fa-search"></i>
          </button>
        </form>
        <ul className="flex space-x-4">
          {!isAuthenticated && (
            <>
              <li>
                <Link to="/login" className={`text-gray-700 hover:text-blue-500 ${location.pathname === '/login' ? 'font-bold' : ''}`}>Login</Link>
              </li>
              <li>
                <Link to="/register" className={`text-gray-700 hover:text-blue-500 ${location.pathname === '/register' ? 'font-bold' : ''}`}>Register</Link>
              </li>
            </>
          )}
          <li>
            <Link to="/business" className={`text-gray-700 hover:text-blue-500 ${location.pathname === '/business' ? 'font-bold' : ''}`}>Businesses</Link>
          </li>
          {isAuthenticated && (
            <li>
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-500">Logout</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
