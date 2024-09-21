import React, { useState, useEffect } from 'react';
import './BusinessListingPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusinesses, fetchCategories } from '../utils/api';

const BusinessListingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const dispatch = useDispatch();

  const { businesses, loading: loadingBusinesses, error: errorBusinesses } = useSelector(state => state.businesses);
  const { categories, loading: loadingCategories, error: errorCategories } = useSelector(state => state.categories);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchBusinesses());
      await dispatch(fetchCategories());
    };
    fetchData();
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

      {loadingBusinesses || loadingCategories ? (
        <p>Loading...</p>
      ) : errorBusinesses || errorCategories ? (
        <p className="error">{errorBusinesses || errorCategories}</p>
      ) : (
        <>
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
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((business) => (
                <div key={business._id} className="business-item">
                  <h3>{business.name}</h3>
                  <p>{business.description}</p>
                  <p>Category: {business.category}</p>
                  {/* Additional business details can be added here */}
                </div>
              ))
            ) : (
              <p>No businesses found for the selected category.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessListingPage;
