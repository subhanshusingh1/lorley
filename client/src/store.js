import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import businessReducer from './reducers/businessReducer';
import adminReducer from './reducers/adminReducer';

const rootReducer = combineReducers({
  business: businessReducer,
  admin: adminReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
