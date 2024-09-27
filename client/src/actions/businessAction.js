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
    FETCH_BUSINESS_FAILURE,
    BUSINESS_LOGIN_SUCCESS,
    BUSINESS_LOGIN_FAIL,
    BUSINESS_LOGOUT,
    LOGOUT,
    UPDATE_BUSINESS_REQUEST,
    UPDATE_BUSINESS_SUCCESS,
    UPDATE_BUSINESS_FAIL,
    FETCH_ALL_BUSINESSES_REQUEST,
    FETCH_ALL_BUSINESSES_SUCCESS,
    FETCH_ALL_BUSINESSES_FAILURE,
    UPDATE_BUSINESS_FAILURE,
    UPLOAD_BUSINESS_PHOTO_REQUEST,
    UPLOAD_BUSINESS_PHOTO_SUCCESS,
    UPLOAD_BUSINESS_PHOTO_FAILURE,
} from '../actions/types';

// import { 
//     fetchBusinessByIdApi, 
//     updateBusinessApi, 
//     uploadBusinessPhotoApi 
// } from '../utils/api'; // Importing API functions

import Cookies from 'js-cookie';
import { setAccessToken, setRefreshToken } from '../utils/tokenUtils';
import axiosInstance from '../pages/business/axiosInstance'; 

// Register a Business
export const registerBusiness = ({ businessName, email, password, businessType, mobile, category }) => async (dispatch) => {
    try {
        dispatch({ type: BUSINESS_REGISTER_REQUEST });

        const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/business/register`;

        const res = await axios.post(apiUrl, {
            name: businessName,
            email,
            password,
            mobile,
            businessType,
            category, // Send the selected category ObjectId
        });

        if (res.data.business) {
            dispatch({
                type: BUSINESS_REGISTER_SUCCESS,
                payload: res.data,
            });
            return { success: true };
        } else {
            dispatch({
                type: BUSINESS_REGISTER_FAIL,
                payload: res.data.message || 'Business registration failed. Please try again.',
            });
            return { success: false, message: res.data.message || 'Business registration failed.' };
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
        dispatch({
            type: BUSINESS_REGISTER_FAIL,
            payload: errorMessage,
        });
        return { success: false, message: errorMessage };
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


// Verify OTP
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
        console.log("Dispatching login request for business:", { email, password });
  
        // Use the business login endpoint
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/v1/business/login`, 
            { email, password }, 
            { withCredentials: true } // Include withCredentials here
        );
  
        console.log("Login response:", res.data); // Log the full response for debugging
  
        if (res.data.success) {
            // Extracting tokens and business
            const { accessToken, refreshToken, business } = res.data.data; // Adjust according to your API response structure
  
            console.log("Login successful! Business:", business); // Log business
  
            // Save access and refresh tokens
            setAccessToken(accessToken); // Utility to set the access token
            setRefreshToken(refreshToken); // Utility to set the refresh token
  
            dispatch({
                type: LOGIN_SUCCESS,
                payload: { business }, // Send business data in the payload
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
        console.error("Login error:", error);
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
      dispatch({ type: BUSINESS_FORGOT_PASSWORD_REQUEST }); // Dispatch business-specific request action
      const config = { headers: { 'Content-Type': 'application/json' } };
  
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/businesses/forgot-password`, { email }, config); // Use the correct business API endpoint
  
      dispatch({ type: BUSINESS_FORGOT_PASSWORD_SUCCESS }); // Dispatch business-specific success action
  
      return { success: true, message: 'OTP sent to your business email for verification!' };
    } catch (error) {
      dispatch({
        type: BUSINESS_FORGOT_PASSWORD_FAIL, // Dispatch business-specific fail action
        payload: error.response?.data?.message || error.message,
      });
  
      return { success: false, message: error.response?.data?.message || error.message };
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
export const fetchBusinessById = (businessId) => async (dispatch) => { 
    try {
        dispatch({ type: FETCH_BUSINESS_REQUEST }); // Indicate loading state
        
        // Get the access token from cookies
        const accessToken = Cookies.get('jwt'); // Adjust the key if your access token is stored differently

        // Set the authorization header if the token exists
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Include the access token in the headers
            },
            withCredentials: true, // Include withCredentials to send cookies
        };

        // Directly hit the route to fetch business details
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/business/${businessId}`, config); 
        
        // Dispatch business data on success
        dispatch({
            type: FETCH_BUSINESS_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_BUSINESS_FAILURE,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Fetch all Business Detail
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

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/business`, config); // Adjust the URL to your API

        dispatch({
            type: FETCH_ALL_BUSINESSES_SUCCESS,
            payload: response.data,
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

  
  
  


// // Business logout action
// export const businessLogout = () => (dispatch) => {
//     localStorage.removeItem('businessInfo');
//     dispatch({ type: BUSINESS_LOGOUT });
// };

// // Fetch business details by ID
// export const fetchBusinessById = (businessId) => async (dispatch) => {
//     try {
//         dispatch({ type: FETCH_BUSINESS_REQUEST });
        
//         const response = await fetchBusinessByIdApi(businessId); // Make API call
//         dispatch({
//             type: FETCH_BUSINESS_SUCCESS,
//             payload: response.data, // Response should contain business data
//         });
//     } catch (error) {
//         dispatch({
//             type: FETCH_BUSINESS_FAILURE,
//             payload: error.response && error.response.data.message
//                 ? error.response.data.message
//                 : error.message,
//         });
//     }
// };

// // Fetch all businesses
// export const fetchAllBusinesses = () => async (dispatch) => {
//     try {
//         dispatch({ type: FETCH_BUSINESS_REQUEST });

//         const { data } = await axios.get('/api/v1/businesses'); // API call to get all businesses

//         dispatch({
//             type: FETCH_BUSINESS_SUCCESS,
//             payload: data, // Response should contain an array of businesses
//         });
//     } catch (error) {
//         dispatch({
//             type: FETCH_BUSINESS_FAILURE,
//             payload: error.response && error.response.data.message
//                 ? error.response.data.message
//                 : error.message,
//         });
//     }
// };

// // Update business details
// export const updateBusiness = (businessData, businessId) => async (dispatch) => {
//     try {
//         dispatch({ type: UPDATE_BUSINESS_REQUEST });
        
//         const response = await updateBusinessApi(businessData, businessId); // Make API call to update
//         dispatch({
//             type: UPDATE_BUSINESS_SUCCESS,
//             payload: response.data, // Updated business data
//         });
//     } catch (error) {
//         dispatch({
//             type: UPDATE_BUSINESS_FAILURE,
//             payload: error.response && error.response.data.message
//                 ? error.response.data.message
//                 : error.message,
//         });
//     }
// };

// // Upload business logo or photos
// export const uploadBusinessPhoto = (photoFile, businessId) => async (dispatch) => {
//     try {
//         dispatch({ type: UPLOAD_BUSINESS_PHOTO_REQUEST });
        
//         const formData = new FormData();
//         formData.append('photo', photoFile);

//         const config = {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         };

//         const response = await uploadBusinessPhotoApi(formData, businessId, config); // API call for photo upload
        
//         dispatch({
//             type: UPLOAD_BUSINESS_PHOTO_SUCCESS,
//             payload: response.data, // Uploaded photo details
//         });
//     } catch (error) {
//         dispatch({
//             type: UPLOAD_BUSINESS_PHOTO_FAILURE,
//             payload: error.response && error.response.data.message
//                 ? error.response.data.message
//                 : error.message,
//         });
//     }
// };
