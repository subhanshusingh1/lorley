import axios from 'axios';
import { 
  REGISTER_REQUEST,
  REGISTER_SUCCESS, 
  REGISTER_FAIL, 
  LOGIN_REQUEST,
  LOGIN_SUCCESS, 
  LOGIN_FAIL, 
  OTP_REQUEST,
  OTP_VERIFIED,
  OTP_FAILED,
  LOGOUT
} from './types';


// Register user
export const registerUser = ({ name, email, mobile, password }) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });
    const res = await axios.post('/api/auth/register', { name, email, mobile, password });
    
    if (res.data.success) {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      return { success: true };
    } else {
      dispatch({
        type: REGISTER_FAIL,
        payload: res.data.message || 'Registration failed. Please try again.',
      });
      return { success: false, message: res.data.message || 'Registration failed.' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
    dispatch({
      type: REGISTER_FAIL,
      payload: errorMessage,
    });
    return { success: false, message: errorMessage };
  }
};

// Verify OTP
export const verifyOtp = (otp) => async (dispatch) => {
  try {
    dispatch({ type: OTP_REQUEST });
    const res = await axios.post('/api/auth/verify-otp', { otp });
    
    if (res.data.success) {
      dispatch({
        type: OTP_VERIFIED,
        payload: res.data.message,
      });
      return { success: true };
    } else {
      dispatch({
        type: OTP_FAILED,
        payload: res.data.message || 'OTP verification failed.',
      });
      return { success: false, message: res.data.message || 'OTP verification failed.' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'An error occurred during OTP verification.';
    dispatch({
      type: OTP_FAILED,
      payload: errorMessage,
    });
    return { success: false, message: errorMessage };
  }
};

// Password-based login
export const loginUser = (emailOrMobile, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const res = await axios.post('/api/auth/login', { emailOrMobile, password });
    
    if (res.data.success) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,  
      });
      return { success: true };
    } else {
      dispatch({
        type: LOGIN_FAIL,
        payload: res.data.message || 'Login failed. Please try again.',
      });
      return { success: false, message: res.data.message || 'Login failed.' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'An error occurred during login.';
    dispatch({
      type: LOGIN_FAIL,
      payload: errorMessage,
    });
    return { success: false, message: errorMessage };
  }
};

// Logout action
export const logout = () => {
  return {
    type: LOGOUT,
  };
};
