import axios from 'axios';
import { toast } from 'react-toastify';
import store from '../../store'; // Your Redux store
import { refreshAccessToken } from '../../actions/authActions'; // Import the refresh token action

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Set your API base URL
  withCredentials: true, // Include credentials for CORS requests if needed
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Return the response if it's successful
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried
      const refreshResponse = await store.dispatch(refreshAccessToken());

      if (refreshResponse.success) {
        // If refresh token is successful, retry the original request with the new access token
        const newAccessToken = refreshResponse.accessToken;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // Retry the original request
      } else {
        // Handle refresh token failure (e.g., log the user out)
        toast.error('Session expired, please log in again.');
        // Redirect to login or handle as needed
      }
    }

    return Promise.reject(error); // Reject the error
  }
);

// Export the axios instance
export default axiosInstance;
