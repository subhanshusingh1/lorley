import axios from 'axios';
import { 
    BUSINESS_REGISTER_REQUEST,
    BUSINESS_REGISTER_SUCCESS,
    BUSINESS_REGISTER_FAIL,
    OTP_REQUEST,
    OTP_SENT_SUCCESS,
    OTP_SENT_FAILED,
    OTP_VERIFIED_SUCCESS,
    OTP_VERIFIED_FAILED,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    BUSINESS_FORGOT_PASSWORD_REQUEST,
    BUSINESS_FORGOT_PASSWORD_SUCCESS,
    BUSINESS_FORGOT_PASSWORD_FAIL,
    BUSINESS_RESET_PASSWORD_REQUEST,
    BUSINESS_RESET_PASSWORD_SUCCESS,
    BUSINESS_RESET_PASSWORD_FAIL,
    FETCH_BUSINESS_REQUEST,
    FETCH_BUSINESS_SUCCESS,
    FETCH_BUSINESS_FAIL,  
      // BUSINESS_LOGIN_SUCCESS,
    // BUSINESS_LOGIN_FAIL,
    // BUSINESS_LOGOUT,
    LOGOUT,
    UPDATE_BUSINESS_REQUEST,
    UPDATE_BUSINESS_SUCCESS,
    UPDATE_BUSINESS_FAIL,
    FETCH_ALL_BUSINESSES_REQUEST,
    FETCH_ALL_BUSINESSES_SUCCESS,
    FETCH_ALL_BUSINESSES_FAILURE,
    SEARCH_BUSINESS_REQUEST,
    SEARCH_BUSINESS_SUCCESS,
    SEARCH_BUSINESS_FAILURE,
    DELETE_BUSINESS_REQUEST,
    DELETE_BUSINESS_SUCCESS,
    DELETE_BUSINESS_FAIL,
    FETCH_BUSINESS_DETAILS_REQUEST, 
    FETCH_BUSINESS_DETAILS_SUCCESS, 
    FETCH_BUSINESS_DETAILS_FAILURE 
    // SEARCH_BUSINESS_RESET,
    // UPDATE_BUSINESS_FAILURE,
    // UPLOAD_BUSINESS_PHOTO_REQUEST,
    // UPLOAD_BUSINESS_PHOTO_SUCCESS,
    // UPLOAD_BUSINESS_PHOTO_FAILURE,
} from '../actions/types';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { setAccessToken, setRefreshToken } from '../utils/tokenUtils';
import axiosInstance from '../pages/business/axiosInstance'; 

// Register Business Action
export const registerBusiness = (businessData) => async (dispatch) => {
    try {
        dispatch({ type: BUSINESS_REGISTER_REQUEST });

        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/business/register`, businessData);

        dispatch({
            type: BUSINESS_REGISTER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: BUSINESS_REGISTER_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};




// Send OTP for Business Registration
export const sendBusinessOtp = (email) => async (dispatch) => {
    try {
        dispatch({ type: OTP_REQUEST }); // Dispatch OTP request action
        
        // Sending OTP request to the backend
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/business/send-otp`, { email });
        
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


// Verify OTP for Business
export const verifyBusinessOtp = (email, otp) => async (dispatch) => {
    try {
        dispatch({ type: OTP_REQUEST }); // Dispatch OTP request action

        // Sending OTP verification request to the backend with withCredentials
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/v1/business/verify-otp`, 
            { email, otp }, 
            { withCredentials: true } // Include withCredentials here
        );

        if (res.data.success) {
            dispatch({
                type: OTP_VERIFIED_SUCCESS, // Dispatch OTP verified success action
                payload: res.data.message,
            });

            // Save access and refresh tokens
            setAccessToken(res.data.accessToken); // Ensure you have a function to set the access token
            setRefreshToken(res.data.refreshToken); // Ensure you have a function to set the refresh token

            // Return success response
            return { success: true, message: res.data.message };
        } else {
            dispatch({
                type: OTP_VERIFIED_FAILED, // Dispatch OTP verified failed action
                payload: res.data.message || 'OTP verification failed.',
            });

            // Return failure response
            return { success: false, message: res.data.message || 'OTP verification failed.' };
        }
    } catch (error) {
        // Handle errors during OTP verification
        const errorMessage = error.response?.data?.message || 'An error occurred during OTP verification.';
        dispatch({
            type: OTP_VERIFIED_FAILED, // Dispatch OTP verified failed action
            payload: errorMessage,
        });

        // Return failure response with error message
        return { success: false, message: errorMessage };
    }
};




// Login Business
export const loginBusiness = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });

        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/v1/business/login`, 
            { email, password }, 
            { withCredentials: true } 
        );

        if (res.data.success) {
            const { accessToken, refreshToken, business } = res.data.data; 

            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            dispatch({
                type: LOGIN_SUCCESS,
                payload: { business },
            });
            return { success: true };
        } else {
            console.log("Login failed:", res.data.message);
            dispatch({
                type: LOGIN_FAIL,
                payload: res.data.message || 'Login failed. Please try again.',
            });
            return { success: false, message: res.data.message || 'Login failed.' };
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'An error occurred during business login.';
        dispatch({
            type: LOGIN_FAIL,
            payload: errorMessage,
        });
        return { success: false, message: errorMessage };
    }
};


  

// Forgot Password for Business
export const forgotBusinessPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: BUSINESS_FORGOT_PASSWORD_REQUEST }); // Dispatch request action

        const config = { headers: { 'Content-Type': 'application/json' } };
        await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/business/forgot-password`, { email }, config); // API call

        dispatch({ type: BUSINESS_FORGOT_PASSWORD_SUCCESS }); // Dispatch success action

        return { success: true, message: 'An OTP has been sent to your registered Business Email!' }; // Updated success message
    } catch (error) {
        dispatch({
            type: BUSINESS_FORGOT_PASSWORD_FAIL, // Dispatch fail action
            payload: error.response?.data?.message || error.message,
        });

        return { success: false, message: error.response?.data?.message || 'Failed to send OTP. Please try again.' }; // Default error message
    }
};


  // Reset Business Password  
  export const resetBusinessPassword = (email, newPassword) => async (dispatch) => {
      try {
          dispatch({ type: BUSINESS_RESET_PASSWORD_REQUEST });
          const config = { headers: { 'Content-Type': 'application/json' } };
  
          // No OTP in the payload anymore
          await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/business/reset-password`, { email, newPassword }, config);
  
          dispatch({ type: BUSINESS_RESET_PASSWORD_SUCCESS });
          return { success: true, message: 'Business password reset successful!' };
      } catch (error) {
          dispatch({
              type: BUSINESS_RESET_PASSWORD_FAIL,
              payload: error.response?.data?.message || error.message,
          });
          return { success: false, message: error.response?.data?.message || error.message };
      }
  };
  

// Fetch Business Details
export const fetchBusinessProfile = (businessId) => async (dispatch) => {
    try {
      dispatch({ type: FETCH_BUSINESS_REQUEST });
  
      // Make the API request to fetch the business profile
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/business/${businessId}`,
        { withCredentials: true }
      );

      const data = await response.json();
  
      console.log("fetch business hit...." + data);
  
      // Assuming the controller sends the business data inside 'data'
      dispatch({
        type: FETCH_BUSINESS_SUCCESS,
        payload: response.data.data, // Access the business data like in user action
      });
  
    } catch (error) {
      if (error.response?.status === 401) {
        // If access token expired, try refreshing
        const refreshResponse = await dispatch(refreshAccessToken());
  
        if (refreshResponse.success) {
          // Retry fetching business profile after refreshing token
          const retryResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/v1/business/${businessId}`,
            { withCredentials: true }
          );
  
          dispatch({
            type: FETCH_BUSINESS_SUCCESS,
            payload: retryResponse.data.data, // Retry response business data
          });
        } else {
          // Handle token refresh failure, possibly log out the user
          dispatch({
            type: FETCH_BUSINESS_FAIL,
            payload: "Session expired, please log in again.",
          });
        }
      } else {
        // Handle other errors
        dispatch({
          type: FETCH_BUSINESS_FAIL,
          payload: error.response?.data?.message || 'Failed to fetch business details.',
        });
      }
    }
  };
  










// Fetch all Business 
export const fetchAllBusinesses = () => async (dispatch) => {
    try {
        dispatch({ type: FETCH_ALL_BUSINESSES_REQUEST });

        const accessToken = Cookies.get('jwt'); // Get the access token
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
        };

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/business`, config);

        dispatch({
            type: FETCH_ALL_BUSINESSES_SUCCESS,
            payload: response.data.businesses, // Assuming the API response structure includes businesses in an array
        });
    } catch (error) {
        dispatch({
            type: FETCH_ALL_BUSINESSES_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};




// generate refresh token 
export const refreshAccessToken = () => async (dispatch) => {
    try {
      const res = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/v1/business/refresh-token`); // Ensure this is the correct endpoint
  
      if (res.data.success) {
        // Store the new access token if needed
        setAccessToken(res.data.accessToken);
        return {
          success: true,
          accessToken: res.data.accessToken,
        };
      } else {
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
  

  // Logout
  export const logoutBusiness = () => (dispatch) => {
      // Remove access and refresh tokens from cookies for the business
      Cookies.remove('jwt'); // Remove the access token
      Cookies.remove('refreshToken'); // Remove the refresh token, adjust the key as needed
      
      // Dispatch logout action for business
      dispatch({ type: LOGOUT });
  };


// Update Business Details
export const updateBusinessDetails = (businessData) => async (dispatch, getState) => {
    try {
        dispatch({ type: UPDATE_BUSINESS_REQUEST });

        const { businessLogin } = getState(); // Fetching current state for business login data
        const { accessToken, refreshToken } = businessLogin; // Ensure this is where you store tokens in the state

        // Setting up headers with accessToken
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true, // Including credentials to handle cookies
        };

        const res = await axios.put(
            `${process.env.REACT_APP_API_URL}/api/v1/business/:id`, 
            businessData, // Sending updated business data
            config
        );

        if (res.data.success) {
            // Update access and refresh tokens if available
            const { newAccessToken, newRefreshToken } = res.data.data;
            if (newAccessToken) setAccessToken(newAccessToken);
            if (newRefreshToken) setRefreshToken(newRefreshToken);

            dispatch({
                type: UPDATE_BUSINESS_SUCCESS,
                payload: res.data.data.business, // Assuming the updated business data is returned here
            });

            return { success: true };
        } else {
            dispatch({
                type: UPDATE_BUSINESS_FAIL,
                payload: res.data.message || 'Failed to update business details.',
            });
            return { success: false, message: res.data.message || 'Update failed.' };
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'An error occurred while updating business details.';
        dispatch({
            type: UPDATE_BUSINESS_FAIL,
            payload: errorMessage,
        });
        return { success: false, message: errorMessage };
    }
};


// search businesses
export const searchBusinesses = (searchTerm) => async (dispatch) => {
    dispatch({ type: SEARCH_BUSINESS_REQUEST });
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/businesses/search?query=${searchTerm}`, {
            withCredentials: true,
        });
        dispatch({
            type: SEARCH_BUSINESS_SUCCESS,
            payload: response.data.businesses,
        });
        return response.data.businesses; // Return results for the HomePage component
    } catch (error) {
        dispatch({
            type: SEARCH_BUSINESS_FAILURE,
            payload: error.response ? error.response.data.message : error.message,
        });
        toast.error('Error fetching businesses. Please try again.');
        return []; // Return an empty array for error handling
    }
};

  
// delete business
export const deleteBusiness = (businessId, password) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_BUSINESS_REQUEST });

        await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/business/${businessId}`, {
            withCredentials: true, // Include cookies (JWTs) in the request
            data: { password },
        });

        dispatch({ type: DELETE_BUSINESS_SUCCESS });
    } catch (error) {
        if (error.response?.status === 401) {
            const refreshResponse = await dispatch(refreshAccessToken());

            if (refreshResponse.success) {
                // Retry business deletion after refreshing token
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/business/${businessId}`, {
                    withCredentials: true,
                    data: { password },
                });

                dispatch({ type: DELETE_BUSINESS_SUCCESS });
            } else {
                dispatch({ type: DELETE_BUSINESS_FAIL, payload: "Session expired, please log in again." });
            }
        } else {
            dispatch({
                type: DELETE_BUSINESS_FAIL,
                payload: error.response?.data?.message || error.message,
            });
        }
    }
};

