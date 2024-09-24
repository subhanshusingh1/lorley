import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser as register } from '../../actions/authActions';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    otp: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/; // Adjust as necessary for your country

    if (!emailRegex.test(formData.email) && !phoneRegex.test(formData.mobile)) {
      toast.error('Please enter a valid email or mobile number');
      return false;
    }
    return true;
  };

  const sendOtp = async () => {
    // Make an API call to send OTP
    const response = await dispatch(sendOtpAction(formData.email || formData.mobile));
    if (response.success) {
      toast.success('OTP sent for verification');
      setIsOtpSent(true);
    } else {
      toast.error('Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    // Verify the OTP
    const response = await dispatch(verifyOtpAction(formData.otp));
    if (response.success) {
      toast.success('OTP verified! Now create your password.');
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateInput()) return;

    if (isOtpSent) {
      await verifyOtp();
      if (formData.password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      const response = await dispatch(register(formData));
      if (response.success) {
        toast.success('Registration successful');
        navigate('/login');
      } else {
        toast.error('Registration failed. User may already exist.');
      }
    } else {
      await sendOtp();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Create Your Account</h2>
      <form onSubmit={submitHandler} className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4 flex space-x-2">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">Mobile:</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        {isOtpSent && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Enter OTP:</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}

        {isOtpSent && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}

        {isOtpSent && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          {isOtpSent ? 'Verify and Register' : 'Send OTP'}
        </button>
      </form>
      <p className="mt-4">
        Already have an account? <a href="/login" className="text-blue-500">Login here</a>
      </p>
    </div>
  );
};

export default RegisterPage;
