import axios from 'axios';
import Cookies from 'js-cookie'; 

import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  OTP_REQUEST,
  OTP_SENT_SUCCESS,
  OTP_SENT_FAILED,
  OTP_VERIFIED_SUCCESS,
  OTP_VERIFIED_FAILED,
  // OTP_VERIFIED,
  // OTP_FAILED,
  LOGOUT,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
  USER_FORGOT_PASSWORD_FAIL,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  DELETE_ACCOUNT_REQUEST, 
  DELETE_ACCOUNT_SUCCESS,
  DELETE_ACCOUNT_FAIL,
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL,
  // FETCH_PROFILE_REQUEST,
  // FETCH_PROFILE_SUCCESS,
  // FETCH_PROFILE_FAIL,
} from './types';

import { setAccessToken, setRefreshToken, getAccessToken, getRefreshToken } from '../utils/tokenUtils';
import axiosInstance from '../pages/users/axiosInstance'; 
import { toast } from 'react-toastify';

// Register a User
export const registerUser = ({ name, email, password }) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });

    // Use the environment variable to set the API base URL
    const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/users/register`;

    // Sending registration request to the backend
    const res = await axios.post(apiUrl, { name, email, password });

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


// send OTP
export const sendOtp = (email) => async (dispatch) => {
  try {
    dispatch({ type: OTP_REQUEST }); // Dispatch OTP request action
    
    // Sending OTP request to the backend
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/send-otp`, { email });
    
    if (res.data.success) {
      dispatch({
        type: OTP_SENT_SUCCESS, // Dispatch OTP sent success action
        payload: res.data.message,
      });

      // Return success response
      return { success: true, message: res.data.message };
    } else {
      dispatch({
        type: OTP_SENT_FAILED, // Dispatch OTP sent failed action
        payload: res.data.message || 'Failed to send OTP.',
      });

      // Return failure response
      return { success: false, message: res.data.message || 'Failed to send OTP.' };
    }
  } catch (error) {
    // Handle errors during sending OTP
    const errorMessage = error.response?.data?.message || 'An error occurred while sending OTP.';
    dispatch({
      type: OTP_SENT_FAILED, // Dispatch OTP sent failed action
      payload: errorMessage,
    });

    // Return failure response with error message
    return { success: false, message: errorMessage };
  }
};

// Verify Otp
export const verifyOtp = (email, otp) => async (dispatch) => {
  try {
    dispatch({ type: OTP_REQUEST });

    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/users/verify-otp`,
      { email, otp },
      { withCredentials: true } // Include withCredentials here
    );

    if (res.data.success) {
      dispatch({
        type: OTP_VERIFIED_SUCCESS,
        payload: res.data.message,
      });

      // Save access and refresh tokens
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);

      return { success: true, message: res.data.message };
    } else {
      dispatch({
        type: OTP_VERIFIED_FAILED,
        payload: res.data.message || 'OTP verification failed.',
      });

      return { success: false, message: res.data.message || 'OTP verification failed.' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'An error occurred during OTP verification.';
    dispatch({
      type: OTP_VERIFIED_FAILED,
      payload: errorMessage,
    });

    return { success: false, message: errorMessage };
  }
};


// login
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    // Login request
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/users/login`,
      { email, password },
      { withCredentials: true } // Include withCredentials here
    );

    if (res.data.success) {
      // Extracting tokens and user
      const { accessToken, refreshToken, user } = res.data.data; 


      // Save access and refresh tokens using utility functions
      setAccessToken(accessToken); // Utility to set the access token
      setRefreshToken(refreshToken); // Utility to set the refresh token

      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user }, // You can also store tokens if needed
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


// Logout 
export const logout = () => (dispatch) => {
    // Remove access and refresh tokens from cookies
    Cookies.remove('jwt'); // Remove the access token
    Cookies.remove('refreshToken'); // Remove the refresh token, adjust the key as needed
    
    // Dispatch logout action
    dispatch({ type: LOGOUT });
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: USER_FORGOT_PASSWORD_REQUEST });
    const config = { headers: { 'Content-Type': 'application/json' } };

    await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/forgot-password`, { email }, config);

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
export const resetPassword = (email, newPassword) => async (dispatch) => {
  try {
    dispatch({ type: USER_RESET_PASSWORD_REQUEST });
    const config = { headers: { 'Content-Type': 'application/json' } };

    // No OTP in the payload anymore
    await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/reset-password`, { email, newPassword }, config);

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

// Fetch user profile by ID 
export const fetchUserProfile = (userId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_PROFILE_REQUEST });

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/profile/${userId}`, {
      withCredentials: true,
    });

    console.log("fetch user hit....")

    dispatch({
      type: FETCH_PROFILE_SUCCESS,
      payload: response.data.data, // Assuming response structure
    });
  } catch (error) {
    if (error.response?.status === 401) {
      // If access token expired, try refreshing
      const refreshResponse = await dispatch(refreshAccessToken());

      if (refreshResponse.success) {
        // Retry fetching profile after refreshing token
        const retryResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/profile/${userId}`, {
          withCredentials: true,
        });

        dispatch({
          type: FETCH_PROFILE_SUCCESS,
          payload: retryResponse.data.data,
        });
      } else {
        // Handle token refresh failure, possibly log out the user
        dispatch({ type: FETCH_PROFILE_FAIL, payload: "Session expired, please log in again." });
      }
    } else {
      dispatch({
        type: FETCH_PROFILE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  }
};


// Update User Profile
export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/users/update-profile`, userData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: response.data });
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshResponse = await dispatch(refreshAccessToken());

      if (refreshResponse.success) {
        // Retry updating profile after refreshing token
        const retryResponse = await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/users/update-profile`, userData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: retryResponse.data });
      } else {
        dispatch({ type: UPDATE_PROFILE_FAIL, payload: "Session expired, please log in again." });
      }
    } else {
      dispatch({
        type: UPDATE_PROFILE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  }
};



// Delete User Account
export const deleteUserAccount = (userId, password) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ACCOUNT_REQUEST });

    await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/users/profile/${userId}`, {
      withCredentials: true, // Include cookies (JWTs) in the request
      data: { password },
    });

    dispatch({ type: DELETE_ACCOUNT_SUCCESS });
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshResponse = await dispatch(refreshAccessToken());

      if (refreshResponse.success) {
        // Retry account deletion after refreshing token
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/users/profile/${userId}`, {
          withCredentials: true,
          data: { password },
        });

        dispatch({ type: DELETE_ACCOUNT_SUCCESS });
      } else {
        dispatch({ type: DELETE_ACCOUNT_FAIL, payload: "Session expired, please log in again." });
      }
    } else {
      dispatch({
        type: DELETE_ACCOUNT_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  }
};



// get refresh token from backend
export const refreshAccessToken = () => async (dispatch) => {
  try {
    const res = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/v1/users/refresh-token`);

    if (res.data.success) {
      // Store the new access token if needed
      return {
        success: true,
        accessToken: res.data.accessToken,
      };
    } else {
      // Handle refresh token failure (e.g., log the user out)
      return {
        success: false,
      };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to refresh token.';
    return {
      success: false,
      message: errorMessage,
    };
  }
};


// upload profile image
export const uploadProfileImage = (file) => async (dispatch) => {
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/upload-profile-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });

        const profileImageUrl = response.data.profileImageUrl;

        // Dispatch action to update the user profile with the new image URL
        dispatch(updateUserProfile({ profileImage: profileImageUrl }));

        // Success toast
        toast.success('Profile image updated successfully!');
        return profileImageUrl;
    } catch (error) {
        // Error toast
        toast.error('Failed to upload image');
        throw error;
    }
};










