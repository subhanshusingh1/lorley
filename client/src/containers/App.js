import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import VerifyOtp from '../pages/VerifyOtp'; // Import the VerifyOtpPage component
import ForgotPassword from '../pages/ForgotPassword'; // Import ForgotPassword component
import ResetPassword from '../pages/ResetPassword'; // Import ResetPassword component
import BusinessRegister from '../pages/business/BusinessRegister'; // Import BusinessRegister component
import BusinessLogin from '../pages/business/BusinessLogin'; // Import BusinessLogin component
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtp />} /> {/* OTP verification route */}
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot password route */}
          <Route path="/reset-password" element={<ResetPassword />} /> {/* Reset password route */}
          
          {/* Business Routes */}
          <Route path="/business/register" element={<BusinessRegister />} /> {/* Business register route */}
          <Route path="/business/login" element={<BusinessLogin />} /> {/* Business login route */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
