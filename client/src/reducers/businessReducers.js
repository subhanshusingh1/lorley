import { 
  BUSINESS_REGISTER_REQUEST, 
  BUSINESS_REGISTER_SUCCESS, 
  BUSINESS_REGISTER_FAIL,
  BUSINESS_REGISTER_RESET,
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
    LOGOUT,
    UPDATE_BUSINESS_REQUEST,
  UPDATE_BUSINESS_SUCCESS,
  UPDATE_BUSINESS_FAIL,
  FETCH_ALL_BUSINESSES_REQUEST,
  FETCH_ALL_BUSINESSES_SUCCESS,
  FETCH_ALL_BUSINESSES_FAILURE,
  SEARCH_BUSINESS_REQUEST,
  SEARCH_BUSINESS_SUCCESS,
  SEARCH_BUSINESS_FAIL,
  SEARCH_BUSINESS_RESET,
  FETCH_BUSINESS_DETAILS_REQUEST,
    FETCH_BUSINESS_DETAILS_SUCCESS,
    FETCH_BUSINESS_DETAILS_FAILURE,
  // BUSINESS_LOGIN_REQUEST,
  // BUSINESS_LOGIN_SUCCESS,
  // BUSINESS_LOGIN_FAIL,
  // BUSINESS_LOGOUT, 
  // FETCH_BUSINESS_REQUEST,
  // FETCH_BUSINESS_SUCCESS,
  // FETCH_BUSINESS_FAILURE,
  // FETCH_ALL_BUSINESSES_REQUEST,
  // FETCH_ALL_BUSINESSES_SUCCESS,
  // FETCH_ALL_BUSINESSES_FAILURE,
  // UPDATE_BUSINESS_REQUEST,
  // UPDATE_BUSINESS_SUCCESS,
  // UPDATE_BUSINESS_FAILURE,
  // UPLOAD_BUSINESS_PHOTO_REQUEST,
  // UPLOAD_BUSINESS_PHOTO_SUCCESS,
  // UPLOAD_BUSINESS_PHOTO_FAILURE,
} from '../actions/types';

import { fetchBusinessById } from '../actions/businessAction';

const initialState = {
  business: [],
  loading: false,
  error: null,
};

// Business Registeration
export const businessRegister = (state = initialState, action) => {
    switch (action.type) {
        case BUSINESS_REGISTER_REQUEST:
            return { ...state, loading: true, error: null }; // Set loading state and clear error

        case BUSINESS_REGISTER_SUCCESS:
            return { loading: false, businessInfo: action.payload, error: null }; // Save business info on successful registration

        case BUSINESS_REGISTER_FAIL:
            return { loading: false, error: action.payload }; // Save error message on failure

        case BUSINESS_REGISTER_RESET:
            return initialState; // Reset state to initial state

        default:
            return state; // Return current state if no action matches
    }
};


// send otp 
export const businessOtp = (state = {}, action) => {
  switch (action.type) {
      case OTP_REQUEST:
          return { loading: true }; // Set loading state when the OTP request is initiated

      case OTP_SENT_SUCCESS:
          return { loading: false, success: true, message: action.payload }; // Save success message on successful OTP sent

      case OTP_SENT_FAILED:
          return { loading: false, error: action.payload }; // Save error message on failure

      default:
          return state; // Return current state if no action matches
  }
};

// otp verification
export const businessOtpVerification = (state = {}, action) => {
  switch (action.type) {
      case OTP_REQUEST:
          return { loading: true }; // Set loading state when the OTP verification request is initiated

      case OTP_VERIFIED_SUCCESS:
          return { loading: false, success: true, message: action.payload }; // Save success message on successful OTP verification

      case OTP_VERIFIED_FAILED:
          return { loading: false, error: action.payload }; // Save error message on failure

      default:
          return state; // Return current state if no action matches
  }
};


// Business Login
export const businessLogin = (state = {}, action) => {
  switch (action.type) {
      case LOGIN_REQUEST:
          return { loading: true }; // Set loading state when the login request is initiated

      case LOGIN_SUCCESS:
          return { loading: false, business: action.payload.business, success: true }; // Save business info on successful login

      case LOGIN_FAIL:
          return { loading: false, error: action.payload }; // Save error message on failure

      default:
          return state; // Return current state if no action matches
  }
};

  // Reducer for handling forgot password for business
  export const businessForgotPassword = (state = {}, action) => {
    switch (action.type) {
      case BUSINESS_FORGOT_PASSWORD_REQUEST:
        return { loading: true }; // Set loading state when the request is initiated
  
      case BUSINESS_FORGOT_PASSWORD_SUCCESS:
        return { loading: false, success: true }; // Set success state when OTP is successfully sent
  
      case BUSINESS_FORGOT_PASSWORD_FAIL:
        return { loading: false, error: action.payload }; // Handle failure case by saving the error message
  
      default:
        return state; // Return current state if no action matches
    }
  };

  // Business Reset Password Reducer
export const businessResetPassword = (state = {}, action) => {
    switch (action.type) {
      case BUSINESS_RESET_PASSWORD_REQUEST:
        return { loading: true }; // Set loading state when the request is initiated
  
      case BUSINESS_RESET_PASSWORD_SUCCESS:
        return { loading: false, success: true }; // On success, reset loading and set success
  
      case BUSINESS_RESET_PASSWORD_FAIL:
        return { loading: false, error: action.payload }; // On failure, set loading to false and store error
  
      default:
        return state; // Return current state if no action matches
    }
  };

  // details for dashbaord
  export const businessDetailsDashboard = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_BUSINESS_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_BUSINESS_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                businessDetails: action.payload,
                error: null,
            };
        case FETCH_BUSINESS_DETAILS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

 // Fetch Business Details 
export const businessDetails = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_BUSINESS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null, // Reset error when request starts
            };
        
        case FETCH_BUSINESS_SUCCESS:
            return {
                loading: false,
                business: action.payload, // Set fetched business data
                error: null, // Reset error on success
            };
        
        case FETCH_BUSINESS_FAILURE:
            return {
                loading: false,
                business: null, // Clear business data on failure
                error: action.payload, // Set error message
            };
        
        default:
            return state;
    }
};

// Logout
export const businessLogout = (state = {}, action) => {
  switch (action.type) {
      case LOGOUT:
          return { loading: false }; // Set loading to false on logout

      default:
          return state; // Return current state if no action matches
  }
};

// Update Business Reducer
export const updateBusiness = (state = initialState, action) => {
  switch (action.type) {
      case UPDATE_BUSINESS_REQUEST:
          return {
              ...state,
              loading: true, // Set loading to true when request is initiated
              error: null, // Clear any previous error
          };
      case UPDATE_BUSINESS_SUCCESS:
          return {
              ...state,
              loading: false, // Set loading to false after success
              business: action.payload, // Update with the new business data
              error: null, // Clear any previous error
          };
      case UPDATE_BUSINESS_FAIL:
          return {
              ...state,
              loading: false, // Set loading to false after failure
              error: action.payload, // Store the error message
          };
      default:
          return state; // Return the current state if no action matches
  }
};


// Reducer for fetching all businesses
export const fetchAllBusinesses = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALL_BUSINESSES_REQUEST:
            return { ...state, loading: true, error: null }; // Set loading to true

        case FETCH_ALL_BUSINESSES_SUCCESS:
            return { ...state, loading: false, businesses: action.payload, error: null }; // Update businesses on success

        case FETCH_ALL_BUSINESSES_FAILURE:
            return { ...state, loading: false, businesses: [], error: action.payload }; // Set error on failure

        default:
            return state; // Return the current state for unrecognized actions
    }
};

// Search Business
export const searchBusiness = (state = { businesses: [] }, action) => {
    switch (action.type) {
        case SEARCH_BUSINESS_REQUEST:
            return { loading: true, businesses: [] }; // Set loading state and clear previous results

        case SEARCH_BUSINESS_SUCCESS:
            return { loading: false, businesses: action.payload }; // Save found businesses on successful search

        case SEARCH_BUSINESS_FAIL:
            return { loading: false, error: action.payload }; // Save error message on failure

        case SEARCH_BUSINESS_RESET: // Optional - to reset state
            return { businesses: [] }; // Reset state after handling

        default:
            return state; // Return current state if no action matches
    }
};







// // Fetching single business details reducer
// export const businessDetails = (state = { business: {}, loading: false }, action) => {
//   switch (action.type) {
//     case FETCH_BUSINESS_REQUEST:
//       return { ...state, loading: true };
    
//     case FETCH_BUSINESS_SUCCESS:
//       return { loading: false, business: action.payload };
    
//     case FETCH_BUSINESS_FAILURE:
//       return { loading: false, error: action.payload };
    
//     default:
//       return state;
//   }
// };

// // Fetching all businesses reducer
// export const allBusinesses = (state = { businesses: [], loading: false }, action) => {
//   switch (action.type) {
//     case FETCH_ALL_BUSINESSES_REQUEST:
//       return { ...state, loading: true };
    
//     case FETCH_ALL_BUSINESSES_SUCCESS:
//       return { loading: false, businesses: action.payload };
    
//     case FETCH_ALL_BUSINESSES_FAILURE:
//       return { loading: false, error: action.payload };
    
//     default:
//       return state;
//   }
// };

// // Updating business details reducer
// export const updateBusiness = (state = { business: {}, loading: false }, action) => {
//   switch (action.type) {
//     case UPDATE_BUSINESS_REQUEST:
//       return { ...state, loading: true };
    
//     case UPDATE_BUSINESS_SUCCESS:
//       return { loading: false, success: true, business: action.payload };
    
//     case UPDATE_BUSINESS_FAILURE:
//       return { loading: false, error: action.payload };
    
//     default:
//       return state;
//   }
// };

// // Uploading business photo (logo or images) reducer
// export const uploadBusinessPhoto = (state = { loading: false, success: false }, action) => {
//   switch (action.type) {
//     case UPLOAD_BUSINESS_PHOTO_REQUEST:
//       return { loading: true };
    
//     case UPLOAD_BUSINESS_PHOTO_SUCCESS:
//       return { loading: false, success: true, photo: action.payload };
    
//     case UPLOAD_BUSINESS_PHOTO_FAILURE:
//       return { loading: false, error: action.payload };
    
//     default:
//       return state;
//   }
// };

  
  


