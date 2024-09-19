import React, { useEffect, useState } from 'react';
import './BusinessListingPage.css';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const BusinessListingPage = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await api.get('/businesses');
        setBusinesses(response.data);
      } catch (error) {
        console.error('Error fetching businesses', error);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="business-listing-page">
      <h2>Businesses</h2>
      <ul>
        {businesses.map((business) => (
          <li key={business.id}>
            <Link to={`/business/${business.id}`}>{business.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusinessListingPage;
