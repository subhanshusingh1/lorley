// redux/review/reviewReducer.js
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
} from '../actions/types';

const initialState = {
    reviews: [],
    loading: false,
    success: false,
    error: null,
};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_REVIEW_REQUEST:
        case FETCH_REVIEWS_REQUEST:
        case DELETE_REVIEW_REQUEST:
        case EDIT_REVIEW_REQUEST:
            return { ...state, loading: true, error: null };

        case SUBMIT_REVIEW_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                success: true, 
                reviews: [...state.reviews, action.payload.review] // Add new review to the list
            };

        case FETCH_REVIEWS_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                reviews: action.payload // Set fetched reviews
            };

        case DELETE_REVIEW_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                reviews: state.reviews.filter(review => review._id !== action.payload) // Remove deleted review
            };

        case EDIT_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                reviews: state.reviews.map(review =>
                    review._id === action.payload.review._id ? action.payload.review : review // Update edited review
                ),
            };

        case SUBMIT_REVIEW_FAILURE:
        case FETCH_REVIEWS_FAILURE:
        case DELETE_REVIEW_FAILURE:
        case EDIT_REVIEW_FAILURE:
            return { 
                ...state, 
                loading: false, 
                success: false, 
                error: action.payload 
            };

        default:
            return state;
    }
};

export default reviewReducer;
