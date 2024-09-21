import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import './ReviewActions.css';
import { likeReview, commentOnReview } from '../utils/api';

const ReviewActions = ({ reviewId, isBusinessOwner }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleLike = async () => {
    try {
      await dispatch(likeReview(reviewId));
      // Show success message or update UI if needed
    } catch (error) {
      console.error('Error liking the review', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setIsSubmitting(true);
      try {
        await dispatch(commentOnReview(reviewId, comment));
        setComment('');
        // Show success message or update UI if needed
      } catch (error) {
        console.error('Error commenting on the review', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="review-actions">
      <button onClick={handleLike}>Like</button>
      {isBusinessOwner && (
        <form onSubmit={handleComment}>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Reply to this review"
            disabled={isSubmitting}
          />
          <button type="submit" disabled={!comment.trim() || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Comment'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewActions;
