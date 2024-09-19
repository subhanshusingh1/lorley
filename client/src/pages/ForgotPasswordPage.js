import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, resetPassword } from '../actions/authActions';
import './ForgotPasswordPage.css';

const ForgotPassword = () => {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const dispatch = useDispatch();
  const { otpSent, message, error } = useSelector((state) => state.auth);

  const handleSendOtp = (e) => {
    e.preventDefault();
    dispatch(sendOtp(emailOrMobile));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    dispatch(resetPassword(emailOrMobile, otp, newPassword));
  };

  return (
    <div className="forgot-password-page">
      <h2>Forgot Password</h2>
      {!otpSent ? (
        <form onSubmit={handleSendOtp}>
          <label htmlFor="emailOrMobile">Email or Mobile:</label>
          <input
            type="text"
            id="emailOrMobile"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <label htmlFor="otp">OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      )}
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default ForgotPassword;
