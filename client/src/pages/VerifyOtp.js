import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../actions/authActions';
import { useNavigate } from 'react-router-dom';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get any error or message from the state
  const { error, message } = useSelector((state) => state.auth);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    const response = await dispatch(verifyOtp(otp));

    if (response.success) {
      navigate('/dashboard'); // Redirect to the user dashboard or another page after successful verification
    } else {
      alert(response.message || 'OTP verification failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-6">Verify OTP</h2>
      <form onSubmit={submitHandler} className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Enter OTP:</label>
          <input
            type="text"
            name="otp"
            value={otp}
            onChange={handleOtpChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Verify OTP
        </button>
      </form>
      
      {/* Display error or message if available */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
};

export default VerifyOtpPage;
