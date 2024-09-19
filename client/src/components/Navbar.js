import React, { useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/business?search=${searchQuery}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Lorley</Link>
      </div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for businesses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul className="navbar-links">
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/business">Businesses</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
