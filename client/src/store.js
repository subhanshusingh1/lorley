import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import authReducer from './reducers/authReducer';
// import businessReducer from './reducers/businessReducer';
// import adminReducer from './reducers/adminReducer';

// combine reducers
const rootReducer = combineReducers({
  auth:authReducer,
  // business: businessReducer,
  // admin: adminReducer,
});

// Initial state and middleware
const initialState = {};
const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
