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
  LOGOUT,
  USER_FORGOT_PASSWORD_REQUEST, 
  USER_FORGOT_PASSWORD_SUCCESS, 
  USER_FORGOT_PASSWORD_FAIL,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_FAIL,
  UPDATE_PROFILE_REQUEST, // Add this type
  UPDATE_PROFILE_SUCCESS, 
  UPDATE_PROFILE_FAIL, 
  DELETE_ACCOUNT_REQUEST, // Add this type
  DELETE_ACCOUNT_SUCCESS,
  DELETE_ACCOUNT_FAIL 
} from './types';

// Register a User
export const registerUser = ({ name, email, mobile, password }) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });
    
    console.log("Registering user with data:", { name, email, mobile, password });
    
    // Sending registration request to the backend
    const res = await axios.post('http://localhost:5000/api/v1/users/register', { name, email, mobile, password });
    
    console.log("Response from backend:", res.data);

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
    console.error('Registration error:', error);
    const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
    dispatch({
      type: REGISTER_FAIL,
      payload: errorMessage,
    });
    return { success: false, message: errorMessage };
  }
};



// Verify OTP
export const verifyOtp = (email, otp) => async (dispatch) => {
  try {
    dispatch({ type: OTP_REQUEST });
    const res = await axios.post('http://localhost:5000/api/v1/users/verify-otp', { email, otp });
    
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


// login User
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const res = await axios.post('http://localhost:5000/api/v1/users/login', { email, password });
    
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

// Forgot Password Action
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: USER_FORGOT_PASSWORD_REQUEST });
    const config = { headers: { 'Content-Type': 'application/json' } };
    
    await axios.post('http://localhost:5000/api/v1/users/forgot-password', { email }, config);
    
    dispatch({ type: USER_FORGOT_PASSWORD_SUCCESS });

    return { success: true, message: 'OTP sent to your email for verification!' };
  } catch (error) {
    dispatch({
      type: USER_FORGOT_PASSWORD_FAIL,
      payload: error.response?.data?.message || error.message,
    });

    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// Reset Password 
export const resetPassword = (email, otp, newPassword) => async (dispatch) => {
  try {
      dispatch({ type: USER_RESET_PASSWORD_REQUEST });
      const config = { headers: { 'Content-Type': 'application/json' } };
      await axios.post('http://localhost:5000/api/v1/users/reset-password', { email, otp, newPassword }, config);
      dispatch({ type: USER_RESET_PASSWORD_SUCCESS });
      
      return { success: true, message: 'Password reset successful!' }; 
  } catch (error) {
      dispatch({
          type: USER_RESET_PASSWORD_FAIL,
          payload: error.response?.data?.message || error.message,
      });
      return { success: false, message: error.response?.data?.message || error.message };
  }
};

// Update User Profile
export const updateUserProfile = (userData) => async (dispatch) => {
  try {
      dispatch({ type: UPDATE_PROFILE_REQUEST }); // Dispatch loading state
      const response = await axios.put('http://localhost:5000/api/v1/users/update-profile', userData, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userData.token}` // Include the token if necessary
          },
      });
      
      dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: response.data });
      return { success: true, message: 'Profile updated successfully!' };
  } catch (error) {
      dispatch({
          type: UPDATE_PROFILE_FAIL,
          payload: error.response?.data?.message || error.message,
      });
      return { success: false, message: error.response?.data?.message || error.message };
  }
};

// Delete User Account
export const deleteUserAccount = (userId, password) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ACCOUNT_REQUEST }); // Dispatch loading state
    await axios.delete(`http://localhost:5000/api/v1/users/profile/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: { password },
    });

    dispatch({ type: DELETE_ACCOUNT_SUCCESS });
    return { success: true, message: 'Account deleted successfully!' };
  } catch (error) {
    dispatch({
      type: DELETE_ACCOUNT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    return { success: false, message: error.response?.data?.message || error.message };
  }
};


// Fetch user profile 
export const fetchUserProfile = () => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const { data } = await axios.get('http://localhost:5000/api/v1/users/profile'); // Adjust this API as per your backend

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};
