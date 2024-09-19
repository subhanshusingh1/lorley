import React, { useState, useEffect } from 'react';
import './BusinessPage.css';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const BusinessPage = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [claimRequested, setClaimRequested] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await api.get(`/businesses/${id}`);
        setBusiness(response.data);
      } catch (error) {
        console.error('Error fetching business details', error);
      }
    };

    fetchBusiness();
  }, [id]);

  const requestClaim = async () => {
    await api.post(`/businesses/${business._id}/claim`);
    setClaimRequested(true);
  };

  if (!business) {
    return <p>Loading...</p>;
  }

  return (
    <div className="business-page">
      <h2>{business.name}</h2>
      <p>{business.description}</p>
      <p>Address: {business.address}</p>
      <p>Contact: {business.contact}</p>

      {!claimRequested ? (
        <button onClick={requestClaim}>Claim this Business</button>
      ) : (
        <p>Claim request sent!</p>
      )}
    </div>
  );
};

export default BusinessPage;
