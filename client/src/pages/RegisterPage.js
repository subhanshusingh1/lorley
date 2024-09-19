import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser as register } from '../actions/authActions';
import api from '../utils/api';
import './RegisterPage.css';

const RegisterPage = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    otp: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpOption, setOtpOption] = useState('email');
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    try {
      await api.post('/auth/send-otp', { 
        [otpOption]: formData[otpOption]
      });
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const otpData = otpOption === 'email' ? { email: formData.email } : { mobile: formData.mobile };
    dispatch(register({ ...formData, otpOption, ...otpData }));
  };

  return (
    <div className="register-page">
      <h2>Create Your Account</h2>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Receive OTP via:</label>
          <select value={otpOption} onChange={(e) => setOtpOption(e.target.value)}>
            <option value="email">Email</option>
            <option value="mobile">Mobile</option>
          </select>
          <button type="button" onClick={sendOtp}>
            Send OTP
          </button>
        </div>

        {otpSent && (
          <div className="form-group">
            <label>OTP:</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
};

export default RegisterPage;
