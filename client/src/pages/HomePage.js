import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessListing from '../pages/business/BusinessListing';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faTshirt, faMedkit, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { fetchCategories } from '../actions/categoryActions'; 
import { toast } from 'react-toastify';

const HomePage = () => {
  const navigate = useNavigate();
  const businessListingRef = useRef(null);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);
  const loading = useSelector((state) => state.category.loading);
  const error = useSelector((state) => state.category.error);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Map categories to icons
  const categoryIcons = {
    Food: faUtensils,
    Clothing: faTshirt,
    Medicine: faMedkit,
    Grocery: faShoppingCart,
  };

  const handleExploreClick = () => {
    if (businessListingRef.current) {
      businessListingRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Banner Section */}
      <div className="relative w-full h-96 bg-cover bg-center" style={{ backgroundImage: "url('https://via.placeholder.com/1920x700?text=Welcome+to+Lorley')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
          <h2 className="text-4xl font-bold">Welcome to Lorley</h2>
          <p className="text-lg">Your one-stop platform for discovering businesses.</p>
          <div className="mt-4 space-x-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition duration-200 ease-in-out transform hover:scale-105"
              onClick={() => navigate('/business/register')}
            >
              Join Us
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow transition duration-200 ease-in-out transform hover:scale-105"
              onClick={handleExploreClick}
            >
              Explore Businesses
            </button>
          </div>
        </div>
      </div>

      {/* Business Listing Section */}
      <div className="py-5 mb-10" ref={businessListingRef}>
        <BusinessListing />
      </div>

      {/* Categories Section */}
      <div className="py-10">
        <h2 className="text-4xl text-center font-semibold mb-8">Categories</h2>
        {loading && <p>Loading categories...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((category) => (
            <div key={category._id} className="border rounded-lg shadow-md p-6 text-center bg-white w-60 h-60 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <FontAwesomeIcon icon={categoryIcons[category.name]} className="text-5xl text-blue-500 mb-2" />
                <h3 className="text-lg font-semibold">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
