import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import authReducer from './reducers/authReducer';
import { 
  businessRegister, 
  businessLogin, 
  businessDetails,   // Import the businessDetails reducer
  allBusinesses, 
  updateBusiness, 
  uploadBusinessPhoto, 
  businessOtp,
  businessOtpVerification,
  businessForgotPassword,
  businessResetPassword,
  businessLogout,
  fetchAllBusinesses
} from './reducers/businessReducers';
import { reviewSubmit } from './reducers/reviewReducers';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,                 // Authentication reducer
  business: combineReducers({
    businessRegister: businessRegister,
    businessOtp: businessOtp,
    businessOtpVerification: businessOtpVerification,
    businessLogin: businessLogin,
    businessForgotPassword: businessForgotPassword,
    businessResetPassword: businessResetPassword,
    businessDetails: businessDetails,
    logout: businessLogout,
    updateBusiness: updateBusiness,
    fetchBusiness: fetchAllBusinesses
    // Add the businessDetails reducer here
  }),
  review: reviewSubmit,              // Review reducer
});

// Initial state (optional)
const initialState = {};

// Middleware
const middleware = [thunk];

// Create store with rootReducer, initial state, and middleware
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
