import React, { useState } from 'react';
import './ReviewPage.css';
import api from '../utils/api';

const ReviewPage = () => {
  const [businessId, setBusinessId] = useState('');
  const [review, setReview] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { businessId, review });
      alert('Review submitted!');
    } catch (error) {
      console.error('Error submitting review', error);
    }
  };

  return (
    <div className="review-page">
      <h2>Submit a Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Business ID</label>
          <input
            type="text"
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ReviewPage;
