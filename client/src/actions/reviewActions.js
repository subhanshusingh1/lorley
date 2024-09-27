import axios from 'axios';
import {
    SUBMIT_REVIEW_REQUEST,
    SUBMIT_REVIEW_SUCCESS,
    SUBMIT_REVIEW_FAILURE,
    REVIEW_SUBMIT_REQUEST,
    REVIEW_SUBMIT_SUCCESS,
    REVIEW_SUBMIT_FAIL,
    FETCH_REVIEWS_REQUEST,
    FETCH_REVIEWS_SUCCESS,
    FETCH_REVIEWS_FAILURE,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAILURE,
    EDIT_REVIEW_REQUEST,
    EDIT_REVIEW_SUCCESS,
    EDIT_REVIEW_FAILURE,
} from './types';


// Submit Review
export const submitReview = ({ businessId, reviewData }) => async (dispatch, getState) => {
  try {
    dispatch({ type: REVIEW_SUBMIT_REQUEST });

    // Get user token from the Redux state (assuming userLogin contains token)
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`, // Attach the token for authorization
      },
    };

    // Make the POST request to submit the review
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/business/${businessId}/reviews`, // Example API endpoint
      reviewData,
      config
    );

    dispatch({
      type: REVIEW_SUBMIT_SUCCESS,
      payload: data, // Data returned from the API (usually the new review object)
    });
  } catch (error) {
    dispatch({
      type: REVIEW_SUBMIT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


// Fetch reviews for a specific business
export const fetchReviews = (businessId) => async (dispatch) => {
    dispatch({ type: FETCH_REVIEWS_REQUEST });

    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/businesses/${businessId}/reviews`);
        dispatch({ type: FETCH_REVIEWS_SUCCESS, payload: response.data.reviews });
    } catch (error) {
        dispatch({
            type: FETCH_REVIEWS_FAILURE,
            payload: error.response ? error.response.data : 'Failed to fetch reviews.',
        });
    }
};

// Delete a review
export const deleteReview = (reviewId) => async (dispatch) => {
    dispatch({ type: DELETE_REVIEW_REQUEST });

    try {
        await axios.delete(`/api/reviews/${reviewId}`); // Adjust the endpoint if necessary
        dispatch({ type: DELETE_REVIEW_SUCCESS, payload: reviewId });
    } catch (error) {
        dispatch({
            type: DELETE_REVIEW_FAILURE,
            payload: error.response ? error.response.data : 'Failed to delete review.',
        });
    }
};

// Edit a review
export const editReview = (reviewId, formData) => async (dispatch) => {
    dispatch({ type: EDIT_REVIEW_REQUEST });

    try {
        const response = await axios.put(`http://localhost:5000/api/reviews/${reviewId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        dispatch({ type: EDIT_REVIEW_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({
            type: EDIT_REVIEW_FAILURE,
            payload: error.response ? error.response.data : 'Failed to edit review.',
        });
    }
};
