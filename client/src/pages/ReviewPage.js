import React, { useState, useEffect } from 'react';
import './ReviewPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { postReview } from '../utils/api';
import ReviewActions from '../components/ReviewActions';

const ReviewPage = ({ businessId }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews); // Assuming reviews are stored in Redux state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('reviewText', reviewText);
    formData.append('rating', rating);
    formData.append('image', image);

    try {
      await dispatch(postReview(businessId, formData));
      alert('Review submitted!');
      setReviewText('');
      setRating(1);
      setImage(null);
    } catch (error) {
      setError('Error submitting review. Please try again.');
      console.error('Error submitting review', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="review-page">
      <h2>Submit a Review</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Write a Review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
            {[1, 2, 3, 4, 5].map((rate) => (
              <option key={rate} value={rate}>{rate}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Upload Image:</label>
          <input type="file" onChange={handleImageChange} />
          {image && <img src={URL.createObjectURL(image)} alt="Preview" className="image-preview" />}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      <h2>Reviews for Business</h2>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div className="review-item" key={review._id}>
            <p>{review.text}</p>
            {review.image && <img src={review.image} alt="Review" />}
            <p>Rating: {review.rating}</p>
            <ReviewActions reviewId={review._id} isBusinessOwner={review.isBusinessOwner} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewPage;
