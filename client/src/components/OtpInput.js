import React, { useState } from 'react';

const OtpInput = ({ onSubmit }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;

    // Allow only numbers and uppercase letters
    if (/^[A-Z0-9]*$/.test(value)) {
      setOtp(value);
      setError(''); // Clear error if valid
    } else {
      setError('OTP should only contain numbers and uppercase letters.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.length === 8) {
      onSubmit(otp); // Pass OTP to the parent component
    } else {
      setError('OTP must be 6 characters long.');
    }
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
          maxLength="8"
          required
          aria-label="Enter your 8-character OTP"
          aria-invalid={error ? 'true' : 'false'}
          style={{ textTransform: 'uppercase' }} // Force uppercase input
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default OtpInput;
