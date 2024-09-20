import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import './ReviewActions.css';
import { likeReview, commentOnReview } from '../utils/api';

const ReviewActions = ({ reviewId, isBusinessOwner }) => {
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();

  const handleLike = () => {
    dispatch(likeReview(reviewId));
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      dispatch(commentOnReview(reviewId, comment));
      setComment('');
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
          />
          <button type="submit">Comment</button>
        </form>
      )}
    </div>
  );
};

export default ReviewActions;
