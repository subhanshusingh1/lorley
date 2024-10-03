// store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'; // DevTools for development
import authReducer from './reducers/authReducer';
import {
  businessRegister,
  businessLogin,
  businessDetails,
  updateBusiness,
  businessOtp,
  businessOtpVerification,
  businessForgotPassword,
  businessResetPassword,
  businessLogout,
  fetchAllBusinesses,
  searchBusiness,
  businessDetailsDashboard
} from './reducers/businessReducers';
import { reviewSubmit } from './reducers/reviewReducers';
import categoryReducer from './reducers/categoryReducer';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer, // Authentication reducer
  business: combineReducers({
    businessRegister,
    businessOtp,
    businessOtpVerification,
    businessLogin,
    businessForgotPassword,
    businessResetPassword,
    businessDetails, // Existing business details reducer
    businessDetailsDashboard, // Include your new business details dashboard reducer
    businessLogout,
    updateBusiness,
    fetchBusiness: fetchAllBusinesses,
    searchBusiness,
  }),
  // Review reducer
  review: reviewSubmit,
  // Category reducer
  category: categoryReducer,
});

// Initial state (optional)
const initialState = {};

// Middleware
const middleware = [thunk];

// Conditionally use Redux DevTools only in development mode
const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? composeWithDevTools
    : (f) => f; // Disable DevTools in production

// Create store with rootReducer, initial state, and middleware
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
