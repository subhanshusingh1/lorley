import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendOtp, resetPassword } from '../actions/authActions';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const dispatch = useDispatch();

  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleOtpRequest = (e) => {
    e.preventDefault();
    dispatch(sendOtp({ emailOrMobile }));
    setIsOtpSent(true);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ otp, newPassword }));
  };

  return (
    <div className="reset-password-page">
      <h2>Reset Password</h2>
      {!isOtpSent ? (
        <form onSubmit={handleOtpRequest}>
          <label>Email or Mobile:</label>
          <input
            type="text"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
          />
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handlePasswordReset}>
          <label>OTP:</label>
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />

          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
