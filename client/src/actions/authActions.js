import axios from 'axios';
import { 
  REGISTER_REQUEST,
  REGISTER_SUCCESS, 
  REGISTER_FAIL, 
  LOGIN_REQUEST,
  LOGIN_SUCCESS, 
  LOGIN_FAIL, 
  LOGOUT, 
  SEND_OTP_REQUEST,
  SEND_OTP_SUCCESS,
  SEND_OTP_FAIL,
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL 
} from './types';

// Send OTP to email or mobile
export const sendOtp = (emailOrMobile) => async (dispatch) => {
  try {
    dispatch({ type: SEND_OTP_REQUEST });
    const res = await axios.post('/api/auth/send-otp', { emailOrMobile });
    dispatch({
      type: SEND_OTP_SUCCESS,
      payload: res.data.message,
    });
  } catch (error) {
    dispatch({
      type: SEND_OTP_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Register user with OTP verification
export const registerUser = ({ name, emailOrMobile, otp, password }) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });
    const res = await axios.post('/api/auth/register', { name, emailOrMobile, otp, password });
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Log in user
export const loginUser = (emailOrMobile, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const res = await axios.post('/api/auth/login', { emailOrMobile, password });
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Log out user
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

// Reset password with OTP
export const resetPassword = (emailOrMobile, otp, newPassword) => async (dispatch) => {
  try {
    dispatch({ type: PASSWORD_RESET_REQUEST });
    const res = await axios.post('/api/auth/reset-password', { emailOrMobile, otp, newPassword });
    dispatch({
      type: PASSWORD_RESET_SUCCESS,
      payload: res.data.message,
    });
  } catch (error) {
    dispatch({
      type: PASSWORD_RESET_FAIL,
      payload: error.response.data.message,
    });
  }
};
