import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import authReducer from './reducers/authReducer';
import { 
  businessRegister, 
  businessLogin, 
  businessDetails, 
  allBusinesses, 
  updateBusiness, 
  uploadBusinessPhoto 
} from './reducers/businessReducers';
import reviewReducer from './reducers/reviewReducers';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,                 // Authentication 
  business: combineReducers({
    register: businessRegister,      // Business registration
    login: businessLogin,            // Business login
    details: businessDetails,        // Fetch business details 
    all: allBusinesses,              // Fetch all businesses
    update: updateBusiness,          // Update business dashboard
    uploadPhoto: uploadBusinessPhoto // Upload business logo/photos for profile
  }),
  review: reviewReducer,              // Include review reducer
});

// Initial state (optional if not using any default values)
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
