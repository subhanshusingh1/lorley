import axios from 'axios';
import {
    SUBMIT_REVIEW_REQUEST,
    SUBMIT_REVIEW_SUCCESS,
    SUBMIT_REVIEW_FAILURE,
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

// Submit a new review
export const submitReview = (businessId, formData) => async (dispatch) => {
    dispatch({ type: SUBMIT_REVIEW_REQUEST });

    try {
        const response = await axios.post(`/api/businesses/${businessId}/review`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        dispatch({ type: SUBMIT_REVIEW_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({
            type: SUBMIT_REVIEW_FAILURE,
            payload: error.response ? error.response.data : 'Failed to submit review.',
        });
    }
};

// Fetch reviews for a specific business
export const fetchReviews = (businessId) => async (dispatch) => {
    dispatch({ type: FETCH_REVIEWS_REQUEST });

    try {
        const response = await axios.get(`/api/businesses/${businessId}/reviews`);
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
        const response = await axios.put(`/api/reviews/${reviewId}`, formData, {
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
