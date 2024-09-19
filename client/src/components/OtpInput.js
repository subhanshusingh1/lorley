import React, { useState } from 'react';

const OtpInput = ({ onSubmit }) => {
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(otp);  // Pass the OTP to the parent component
  };

  return (
    <div className="otp-input">
      <form onSubmit={handleSubmit}>
        <label htmlFor="otp">Enter OTP:</label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={handleChange}
          maxLength="6"
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default OtpInput;
