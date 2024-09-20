import React, { useState, useEffect } from 'react';
import './BusinessListingPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusinesses, fetchCategories } from '../utils/api';

const BusinessListingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const dispatch = useDispatch();
  
  const businesses = useSelector(state => state.businesses);
  const categories = useSelector(state => state.categories);

  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredBusinesses = businesses.filter(business => 
    selectedCategory === '' || business.category === selectedCategory
  );

  return (
    <div className="business-listing-page">
      <h2>Business Listings</h2>

      <div className="filter-container">
        <label>Filter by Category:</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="businesses-container">
        {filteredBusinesses.map((business) => (
          <div key={business._id} className="business-item">
            <h3>{business.name}</h3>
            <p>{business.description}</p>
            <p>Category: {business.category}</p>
            {/* You can add more business details here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessListingPage;
