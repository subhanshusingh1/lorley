import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
} from '../actions/types';

const initialState = {
  loading: false,
  categories: [], // This should be an array
  error: null,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
      case FETCH_CATEGORIES_REQUEST:
          return {
              ...state,
              loading: true,
              error: null,
          };
      case FETCH_CATEGORIES_SUCCESS:
          return {
              ...state,
              loading: false,
              categories: action.payload, // Should be an array of categories
          };
      case FETCH_CATEGORIES_FAILURE:
          return {
              ...state,
              loading: false,
              error: action.payload,
          };
      default:
          return state;
  }
};

export default categoryReducer;
