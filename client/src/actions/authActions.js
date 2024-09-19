import axios from 'axios';
import { USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_SEND_OTP, USER_RESET_PASSWORD } from '../constants/userConstants';

export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    const { data } = await axios.post('/api/users/register', userData);
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_REGISTER_FAIL, payload: error.response.data.message });
  }
};

export const sendOtp = (otpData) => async (dispatch) => {
  await axios.post('/api/users/send-otp', otpData);
  dispatch({ type: USER_SEND_OTP });
};

export const resetPassword = (resetData) => async (dispatch) => {
  await axios.post('/api/users/reset-password', resetData);
  dispatch({ type: USER_RESET_PASSWORD });
};
