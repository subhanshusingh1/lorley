import axios from 'axios';
import {
    FETCH_CATEGORIES_REQUEST,
    FETCH_CATEGORIES_SUCCESS,
    FETCH_CATEGORIES_FAILURE,
} from './types';

export const fetchCategories = () => {
    return async (dispatch) => {
        dispatch({ type: FETCH_CATEGORIES_REQUEST });

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/categories`);
            console.log('Fetched Categories:', response.data); // Log the fetched categories
            dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: response.data.categories }); // Ensure you are dispatching response.data.categories
        } catch (error) {
            dispatch({ type: FETCH_CATEGORIES_FAILURE, payload: error.message });
        }
    };
};
