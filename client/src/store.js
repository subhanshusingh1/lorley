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
  searchBusiness
} from './reducers/businessReducers';
import { reviewSubmit } from './reducers/reviewReducers';
import categoryReducer from './reducers/categoryReducer';

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
    fetchBusiness: fetchAllBusinesses,
    searchBusiness: searchBusiness,
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
