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
  auth: authReducer,                 // Authentication reducer
  business: combineReducers({
    register: businessRegister,      // Business registration reducer
    login: businessLogin,            // Business login reducer
    details: businessDetails,        // Fetch business details reducer
    all: allBusinesses,              // Fetch all businesses reducer
    update: updateBusiness,          // Update business dashboard reducer
    uploadPhoto: uploadBusinessPhoto // Upload business logo/photos reducer
  }),
  review: reviewReducer,              // Review reducer
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
