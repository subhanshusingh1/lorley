import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const sendOtp = (mobile) => api.post('/auth/send-otp', { mobile });
export const verifyOtp = (mobile, otp) => api.post('/auth/verify-otp', { mobile, otp });

export default api;


