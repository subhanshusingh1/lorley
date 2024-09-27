import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {/* User Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">User</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-400 hover:text-blue-400 transition duration-300">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-blue-400 transition duration-300">Register</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-blue-400 transition duration-300">Profile</Link>
              </li>
            </ul>
          </div>

          {/* Business Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Business</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/business/register" className="text-gray-400 hover:text-blue-400 transition duration-300">Register Business</Link>
              </li>
              <li>
                <Link to="/business/login" className="text-gray-400 hover:text-blue-400 transition duration-300">Business Login</Link>
              </li>
              <li>
                <Link to="/business/listing" className="text-gray-400 hover:text-blue-400 transition duration-300">Business Listing</Link>
              </li>
              <li>
                <Link to="/business/profile" className="text-gray-400 hover:text-blue-400 transition duration-300">Business Profile</Link>
              </li>
              <li>
                <Link to="/business/dashboard" className="text-gray-400 hover:text-blue-400 transition duration-300">Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Review Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Reviews</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/business/review" className="text-gray-400 hover:text-blue-400 transition duration-300">Add Review</Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 transition duration-300">Home</Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright Notice Below User Column */}
        <p className="text-center text-sm mt-6">
          &copy; {new Date().getFullYear()} Lorley. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
