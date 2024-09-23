import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Auth API functions
export const sendOtp = (mobile) => api.post('/auth/send-otp', { mobile });
export const verifyOtp = (mobile, otp) => api.post('/auth/verify-otp', { mobile, otp });

// Fetch business by ID
export const fetchBusinessByIdApi = async (businessId) => {
  try {
    const response = await api.get(`/business/${businessId}`);
    return response.data; // Assuming the response contains the business data
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching business data');
  }
};

// Update business details
export const updateBusinessApi = async (formData, businessId) => {
  try {
    const response = await api.put(`/business/${businessId}`, formData);
    return response.data; // Assuming the response contains the updated business data
  } catch (error) {
    throw new Error(error.response.data.message || 'Error updating business data');
  }
};

// Create or Update Business
export const createOrUpdateBusiness = async (formData, businessId) => {
  if (businessId) {
    return await updateBusinessApi(formData, businessId);
  } else {
    return await api.post('/business', formData); // Adjust the endpoint for creating a new business
  }
};


// API call to upload business photos
export const uploadBusinessPhotoApi = async (photoData) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };
    const response = await axios.post('/api/v1/business/upload-photo', photoData, config);
    return response;
};


export default api;
