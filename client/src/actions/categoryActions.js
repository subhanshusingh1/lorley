import axios from 'axios';
import { FETCH_CATEGORIES_SUCCESS, FETCH_CATEGORIES_FAILURE } from './types';

// Fetch all business categories
export const fetchCategories = () => async (dispatch) => {
  try {
    const { data } = await axios.get('/api/businesses/categories');
    dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_CATEGORIES_FAILURE, payload: error.response?.data.message || error.message });
  }
};
