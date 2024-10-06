import {
    BUSINESS_REGISTER_REQUEST,
    BUSINESS_REGISTER_SUCCESS,
    BUSINESS_REGISTER_FAIL,
    OTP_REQUEST,
    OTP_VERIFIED_SUCCESS,
    OTP_VERIFIED_FAILED,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    BUSINESS_FORGOT_PASSWORD_REQUEST,
    BUSINESS_FORGOT_PASSWORD_SUCCESS,
    BUSINESS_FORGOT_PASSWORD_FAIL,
    BUSINESS_RESET_PASSWORD_REQUEST,
    BUSINESS_RESET_PASSWORD_SUCCESS,
    BUSINESS_RESET_PASSWORD_FAIL,
    FETCH_BUSINESS_REQUEST,
    FETCH_BUSINESS_SUCCESS,
    FETCH_BUSINESS_FAIL,
    LOGOUT,
    UPDATE_BUSINESS_SUCCESS,
    UPDATE_BUSINESS_FAIL,
    DELETE_BUSINESS_REQUEST,
    DELETE_BUSINESS_SUCCESS,
    DELETE_BUSINESS_FAIL,
  } from '../actions/types';
  
  const initialState = {
    business: null,
    loading: false,
    isAuthenticated: false,
    success: false,
    error: null,
    message: null,
  };
  
  export default function businessReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      // Business registration, login, and OTP actions
      case BUSINESS_REGISTER_REQUEST:
      case LOGIN_REQUEST:
      case OTP_REQUEST:
      case BUSINESS_FORGOT_PASSWORD_REQUEST:
      case BUSINESS_RESET_PASSWORD_REQUEST:
      case FETCH_BUSINESS_REQUEST: // Loading state for fetching business profile
        return {
          ...state,
          loading: true,
          error: null,
          success: false,
          message: null,
        };
  
      case BUSINESS_REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
        return {
          ...state,
          business: payload.business,
          isAuthenticated: true,
          loading: false,
          success: true,
          message: 'Business operation successful!',
        };
  
      case OTP_VERIFIED_SUCCESS:
        return {
          ...state,
          loading: false,
          success: true,
          message: 'OTP verified successfully!',
        };
  
      case OTP_VERIFIED_FAILED:
      case BUSINESS_REGISTER_FAIL:
      case LOGIN_FAIL:
      case BUSINESS_FORGOT_PASSWORD_FAIL:
      case BUSINESS_RESET_PASSWORD_FAIL:
      case FETCH_BUSINESS_FAIL: // Error handling for business fetch
        return {
          ...state,
          loading: false,
          error: payload,
          success: false,
          message: 'Operation failed. Please try again.',
        };
  
      case BUSINESS_FORGOT_PASSWORD_SUCCESS:
        return {
          ...state,
          loading: false,
          success: true,
          message: payload?.message || 'Password reset email sent successfully!',
        };
  
      case BUSINESS_RESET_PASSWORD_SUCCESS:
        return {
          ...initialState, // Reset to initial state after password reset
          loading: false,
          success: true,
          message: payload?.message || 'Password reset successfully! Please log in.',
        };
  
      // Fetch Business Success
      case FETCH_BUSINESS_SUCCESS:
        return {
          ...state,
          business: payload, // Set the business data from profile fetch
          loading: false,
          success: true,
          message: 'Business profile retrieved successfully!',
        };
  
      // Update Business Success and Failure
      case UPDATE_BUSINESS_SUCCESS:
        return {
          ...state,
          business: { ...state.business, ...payload }, // Merge updated fields into business object
          loading: false,
          success: true,
          message: 'Business profile updated successfully!',
        };
  
      case UPDATE_BUSINESS_FAIL:
        return {
          ...state,
          loading: false,
          error: payload,
          success: false,
          message: 'Business update failed.',
        };
  
      // Delete Business Request, Success, and Failure
      case DELETE_BUSINESS_REQUEST:
        return {
          ...state,
          loading: true,
        };
  
      case DELETE_BUSINESS_SUCCESS:
        return {
          ...initialState, // Reset the state after business deletion
          loading: false,
        };
  
      case DELETE_BUSINESS_FAIL:
        return {
          ...state,
          loading: false,
          error: payload,
          success: false,
          message: 'Business deletion failed.',
        };
  
      // Logout
      case LOGOUT:
        return initialState;
  
      default:
        return state;
    }
  }
  