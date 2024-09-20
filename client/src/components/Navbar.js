import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-logo">
        <Link to="/">Lorley</Link>
      </div>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for businesses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </form>
      <ul className="navbar-links">
        <li><Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link></li>
        <li><Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>Register</Link></li>
        <li><Link to="/business" className={location.pathname === '/business' ? 'active' : ''}>Businesses</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
