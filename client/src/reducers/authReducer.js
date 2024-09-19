import { 
    REGISTER_SUCCESS, 
    REGISTER_FAIL, 
    LOGIN_SUCCESS, 
    LOGIN_FAIL, 
    LOGOUT, 
    OTP_SENT, 
    OTP_VERIFIED, 
    OTP_FAILED, 
    PASSWORD_RESET_SUCCESS, 
    PASSWORD_RESET_FAIL 
  } from '../actions/types';
  
  const initialState = {
    token: null,
    isAuthenticated: false,
    loading: true,
    user: null,
    otpSent: false,
    error: null,
    message: null,
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
        return {
          ...state,
          token: payload.token,
          isAuthenticated: true,
          loading: false,
          user: payload.user,
        };
      case REGISTER_FAIL:
      case LOGIN_FAIL:
      case LOGOUT:
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
          error: payload,
        };
      case OTP_SENT:
        return {
          ...state,
          otpSent: true,
          message: payload,
        };
      case OTP_FAILED:
        return {
          ...state,
          otpSent: false,
          error: payload,
        };
      case PASSWORD_RESET_SUCCESS:
        return {
          ...state,
          message: payload,
        };
      case PASSWORD_RESET_FAIL:
        return {
          ...state,
          error: payload,
        };
      default:
        return state;
    }
  }
  