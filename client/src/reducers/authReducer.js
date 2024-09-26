import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  OTP_REQUEST,
  OTP_VERIFIED,
  OTP_FAILED,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
  USER_FORGOT_PASSWORD_FAIL,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_FAIL,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  DELETE_ACCOUNT_SUCCESS,
  DELETE_ACCOUNT_REQUEST,
  DELETE_ACCOUNT_FAIL,
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL,
} from '../actions/types';

const initialState = {
  token: null,
  isAuthenticated: false,
  loading: true,
  user: null,
  otpVerified: false,
  error: null,
  message: null,
  success: false,
  email: null, // Field to store user's email
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case OTP_REQUEST:
    case USER_FORGOT_PASSWORD_REQUEST:
    case USER_RESET_PASSWORD_REQUEST:
    case FETCH_PROFILE_REQUEST: // Add this line for loading state
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
        success: false,
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: payload.token,
        isAuthenticated: true,
        loading: false,
        user: payload.user, // Ensure user data is set
        success: true,
        message: 'Login successful!',
      };

    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case USER_FORGOT_PASSWORD_FAIL:
    case USER_RESET_PASSWORD_FAIL:
    case FETCH_PROFILE_FAIL: // Add error handling
      return {
        ...state,
        loading: false,
        error: payload,
        success: false,
        message: 'Operation failed. Please try again.', // General error message
      };

    case OTP_VERIFIED:
      return {
        ...state,
        otpVerified: true,
        loading: false,
        success: true,
        email: payload.email || state.email,
        message: 'OTP verified successfully!',
      };

    case OTP_FAILED:
      return {
        ...state,
        otpVerified: false,
        loading: false,
        error: payload,
        success: false,
        message: 'OTP verification failed.',
      };

    case LOGOUT:
      return {
        ...initialState,
        loading: false,
      };

    case USER_FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: payload?.message || 'Password reset email sent successfully!',
      };

    case USER_RESET_PASSWORD_SUCCESS:
      return {
        ...initialState,
        loading: false,
        success: true,
        message: payload?.message || 'Password reset successfully! Please log in.',
      };

    case FETCH_PROFILE_SUCCESS:
      console.log("Setting user in reducer:", payload); // Check what payload is being set
      return {
          ...state,
          user: payload,
          loading: false,
          success: true,
          message: 'Profile retrieved successfully!',
      };
  


    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        user: { ...state.user, ...payload }, // Merge updated fields into user object
        loading: false,
        success: true,
        message: 'Profile updated successfully!',
      };

    case UPDATE_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
        success: false,
        message: 'Profile update failed.',
      };

      case DELETE_ACCOUNT_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case DELETE_ACCOUNT_SUCCESS:
        return {
          ...initialState, // Clear the state after account deletion
          loading: false,
        };
      case DELETE_ACCOUNT_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };

    default:
      return state;
  }
}
