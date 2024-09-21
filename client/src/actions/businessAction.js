import axios from 'axios';
import { 
    BUSINESS_REGISTER_REQUEST, 
    BUSINESS_REGISTER_SUCCESS, 
    BUSINESS_REGISTER_FAIL,
    BUSINESS_LOGIN_REQUEST,
    BUSINESS_LOGIN_SUCCESS,
    BUSINESS_LOGIN_FAIL,
    BUSINESS_LOGOUT,
} from '../actions/types';

// Register a business
export const registerBusiness = (businessData) => async (dispatch) => {
    try {
        dispatch({ type: BUSINESS_REGISTER_REQUEST });
        
        // Sending a POST request to register business
        const { data } = await axios.post('/api/v1/business/register', businessData);

        // Dispatch success if business is successfully registered
        dispatch({
            type: BUSINESS_REGISTER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        // Dispatch failure if there's an error
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
  
      // Save business info to localStorage
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
