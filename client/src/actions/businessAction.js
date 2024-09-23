import axios from 'axios';
import { 
    BUSINESS_REGISTER_REQUEST, 
    BUSINESS_REGISTER_SUCCESS, 
    BUSINESS_REGISTER_FAIL,
    BUSINESS_LOGIN_REQUEST,
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

import { 
    fetchBusinessByIdApi, 
    updateBusinessApi, 
    uploadBusinessPhotoApi 
} from '../utils/api'; // Importing API functions

// Register a business
export const registerBusiness = (businessData) => async (dispatch) => {
    try {
        dispatch({ type: BUSINESS_REGISTER_REQUEST });
        
        const { data } = await axios.post('/api/v1/business/register', businessData);

        dispatch({
            type: BUSINESS_REGISTER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: BUSINESS_REGISTER_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Business login action
export const businessLogin = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: BUSINESS_LOGIN_REQUEST });
  
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
  
        const { data } = await axios.post('/api/v1/business/login', { email, password }, config);
  
        dispatch({
            type: BUSINESS_LOGIN_SUCCESS,
            payload: data,
        });
  
        localStorage.setItem('businessInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: BUSINESS_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// Business logout action
export const businessLogout = () => (dispatch) => {
    localStorage.removeItem('businessInfo');
    dispatch({ type: BUSINESS_LOGOUT });
};

// Fetch business details by ID
export const fetchBusinessById = (businessId) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_BUSINESS_REQUEST });
        
        const response = await fetchBusinessByIdApi(businessId); // Make API call
        dispatch({
            type: FETCH_BUSINESS_SUCCESS,
            payload: response.data, // Response should contain business data
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

// Fetch all businesses
export const fetchAllBusinesses = () => async (dispatch) => {
    try {
        dispatch({ type: FETCH_BUSINESS_REQUEST });

        const { data } = await axios.get('/api/v1/businesses'); // API call to get all businesses

        dispatch({
            type: FETCH_BUSINESS_SUCCESS,
            payload: data, // Response should contain an array of businesses
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

// Update business details
export const updateBusiness = (businessData, businessId) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_BUSINESS_REQUEST });
        
        const response = await updateBusinessApi(businessData, businessId); // Make API call to update
        dispatch({
            type: UPDATE_BUSINESS_SUCCESS,
            payload: response.data, // Updated business data
        });
    } catch (error) {
        dispatch({
            type: UPDATE_BUSINESS_FAILURE,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Upload business logo or photos
export const uploadBusinessPhoto = (photoFile, businessId) => async (dispatch) => {
    try {
        dispatch({ type: UPLOAD_BUSINESS_PHOTO_REQUEST });
        
        const formData = new FormData();
        formData.append('photo', photoFile);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await uploadBusinessPhotoApi(formData, businessId, config); // API call for photo upload
        
        dispatch({
            type: UPLOAD_BUSINESS_PHOTO_SUCCESS,
            payload: response.data, // Uploaded photo details
        });
    } catch (error) {
        dispatch({
            type: UPLOAD_BUSINESS_PHOTO_FAILURE,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};
