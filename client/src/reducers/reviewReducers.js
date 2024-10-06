import {
    REVIEW_SUBMIT_REQUEST,
    REVIEW_SUBMIT_SUCCESS,
    REVIEW_SUBMIT_FAIL,
  } from '../actions/types';
  
  // Initial state for review submission
  const initialState = {
    loading: false,
    success: false,
    error: null,
  };
  
  // Reducer to handle review submission actions
  export const reviewReducers = (state = initialState, action) => {
    switch (action.type) {
      case REVIEW_SUBMIT_REQUEST:
        return { ...state, loading: true, success: false, error: null };
  
      case REVIEW_SUBMIT_SUCCESS:
        return { ...state, loading: false, success: true, error: null };
  
      case REVIEW_SUBMIT_FAIL:
        return { ...state, loading: false, error: action.payload, success: false };
  
      default:
        return state;
    }
  };
  