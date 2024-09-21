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
  USER_RESET_PASSWORD_FAIL
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
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case OTP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null, 
      };

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
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: payload,
      };

    case OTP_VERIFIED:
      return {
        ...state,
        otpVerified: true,
        loading: false,
        message: payload,
      };

    case OTP_FAILED:
      return {
        ...state,
        otpVerified: false,
        loading: false,
        error: payload,
      };

    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        otpSent: false,
        otpVerified: false,
        error: null,
        message: null,
      };


    case USER_FORGOT_PASSWORD_REQUEST:
        return { loading: true };
    case USER_FORGOT_PASSWORD_SUCCESS:
        return { loading: false, success: true };
    case USER_FORGOT_PASSWORD_FAIL:
        return { loading: false, error: action.payload };  

    case USER_RESET_PASSWORD_REQUEST:
          return { loading: true };
    case USER_RESET_PASSWORD_SUCCESS:
          return { loading: false, success: true };
    case USER_RESET_PASSWORD_FAIL:
          return { loading: false, error: action.payload };
  

    default:
      return state;
  }
}
