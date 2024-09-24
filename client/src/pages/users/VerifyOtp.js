import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp } from '../../actions/authActions';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyOtpPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false); // State to track if OTP is sent

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { error, message } = useSelector((state) => state.auth);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Function to handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    const response = await dispatch(sendOtp(email)); // Assuming sendOtp action is defined in authActions
    if (response.success) {
      toast.success('OTP sent to your email!');
      setIsOtpSent(true); // OTP is sent, now show the OTP input field and the verify button
    } else {
      toast.error(response.message || 'Failed to send OTP. Please try again.');
    }
  };

  // Function to handle verifying OTP
  const submitHandler = async (e) => {
    e.preventDefault();
    
    const response = await dispatch(verifyOtp(email, otp)); // Verify OTP with email and OTP entered
    if (response.success) {
      toast.success('OTP verified successfully!');
      navigate('/login'); // Redirect to login page after successful verification
    } else {
      toast.error(response.message || 'OTP verification failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">Verify OTP</h2>
      
      <form className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        
        {/* Email Input Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Conditionally show the OTP field and Verify button after OTP is sent */}
        {isOtpSent && (
          <>
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
              onClick={submitHandler}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* Generate OTP Button */}
        {!isOtpSent && (
          <button
            onClick={handleSendOtp}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Generate OTP
          </button>
        )}

      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
};

export default VerifyOtpPage;
