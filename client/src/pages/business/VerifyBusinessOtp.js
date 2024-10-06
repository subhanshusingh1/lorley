import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendBusinessOtp, verifyBusinessOtp } from '../../actions/businessAction';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyBusinessOtp = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Selecting state from the store
  const { error, message, loading } = useSelector((state) => state.business); // Adjusted to use `business` reducer

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    const response = await dispatch(sendBusinessOtp(email));
    if (response.success) {
      toast.success('OTP sent to your business email!');
      setIsOtpSent(true);
    } else {
      toast.error(response.message || 'Failed to send OTP. Please try again.');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    const response = await dispatch(verifyBusinessOtp(email, otp));
    if (response.success) {
      toast.success('OTP verified successfully!');
      navigate('/business/login');
    } else {
      toast.error(response.message || 'OTP verification failed. Please try again.');
    }
  };

  // Effect to show error or message from Redux store
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
    }
  }, [error, message]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">Verify Business OTP</h2>
      
      <form className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Business Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

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
              disabled={loading} // Disable button when loading
            >
              Verify OTP
            </button>
          </>
        )}

        {!isOtpSent && (
          <button
            onClick={handleSendOtp}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading} // Disable button when loading
          >
            Generate OTP
          </button>
        )}
      </form>
    </div>
  );
};

export default VerifyBusinessOtp;
