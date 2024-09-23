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
  DELETE_ACCOUNT_SUCCESS
} from '../actions/types';

const initialState = {
  token: null,
  isAuthenticated: false,
  loading: true,
  user: null,
  otpSent: false,
  otpVerified: false,
  error: null,
  message: null,
  success: false,
  email: null, // Add email field to store user's email
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case OTP_REQUEST:
    case USER_FORGOT_PASSWORD_REQUEST:
    case USER_RESET_PASSWORD_REQUEST:
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
        user: payload.user,
        success: true,
        message: 'Operation successful!',
      };

    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case USER_FORGOT_PASSWORD_FAIL:
    case USER_RESET_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
        success: false,
      };

    case OTP_VERIFIED:
      return {
        ...state,
        otpVerified: true,
        loading: false,
        success: true,
        email: payload.email || state.email, // Store email if available in payload
        message: payload.message || 'OTP verified successfully!',
      };

    case OTP_FAILED:
      return {
        ...state,
        otpVerified: false,
        loading: false,
        error: payload,
        success: false,
      };

    case LOGOUT:
      return {
        ...initialState,
        loading: false,
      };

    case USER_FORGOT_PASSWORD_SUCCESS:
    case USER_RESET_PASSWORD_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        success: true,
        message: payload?.message || 'Operation successful!',
      };

    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        user: { ...state.user, ...payload },
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
      };

    case DELETE_ACCOUNT_SUCCESS:
      return {
        ...initialState,
        loading: false,
      };

    default:
      return state;
  }
}



 
   
