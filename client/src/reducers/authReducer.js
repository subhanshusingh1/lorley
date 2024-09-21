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
  LOGOUT
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

    default:
      return state;
  }
}
