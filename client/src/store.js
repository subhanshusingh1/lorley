// store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'; // DevTools for development
import businessReducer from './reducers/businessReducers'; // Updated business reducer
import {reviewReducers} from './reducers/reviewReducers'; // Ensure singular reducer names
import categoryReducer from './reducers/categoryReducer';
import authReducer from './reducers/authReducer';

// Combine all reducers
const rootReducer = combineReducers({
  // User reducer
  auth: authReducer, // Using 'user' for user-related actions and state
  // Business reducer
  business: businessReducer, // Using 'business' for business-related actions and state
  // Review reducer
  review: reviewReducers,
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
