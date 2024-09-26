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
    BUSINESS_LOGIN_SUCCESS,
    BUSINESS_LOGIN_FAIL,
    BUSINESS_LOGOUT,
    FETCH_BUSINESS_REQUEST,
    FETCH_BUSINESS_SUCCESS,
    FETCH_BUSINESS_FAILURE,
    UPDATE_BUSINESS_REQUEST,
    UPDATE_BUSINESS_SUCCESS,
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
export const verifyBusinessOtp = (email, otp) => async (dispatch) => {
    try {
        dispatch({ type: OTP_REQUEST }); // Dispatch OTP request action

        // Sending OTP verification request to the backend
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/business/verify-otp`, { email, otp });

        if (res.data.success) {
            dispatch({
                type: OTP_VERIFIED_SUCCESS, // Dispatch OTP verified success action
                payload: res.data.message,
            });

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
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/business/login`, { email, password }, { withCredentials: true });

        console.log("Login response:", res.data); // Log the full response for debugging

        if (res.data.success) {
            // Adjust destructuring to match your API response for business
            const business = res.data.data.business; // Access the business object from the data

            console.log("Login successful! Business:", business); // Log business

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
  
      await axios.post('http://localhost:5000/api/v1/businesses/forgot-password', { email }, config); // Use the correct business API endpoint
  
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
      await axios.post('http://localhost:5000/api/v1/business/reset-password', { email, newPassword }, config);
  
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
        
        // Directly hit the route to fetch business details
        const response = await axios.get(`/api/v1/business/${businessId}`); 
        
        // Assuming response.data contains the business data
        dispatch({
            type: FETCH_BUSINESS_SUCCESS,
            payload: response.data, // Dispatch business data on success
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
