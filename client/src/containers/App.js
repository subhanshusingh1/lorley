import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/users/LoginPage';
import RegisterPage from '../pages/users/RegisterPage';
import VerifyOtp from '../pages/users/VerifyOtp';
import ForgotPassword from '../pages/users/ForgotPassword';
import ResetPassword from '../pages/users/ResetPassword';
import BusinessRegister from '../pages/business/BusinessRegister';
import BusinessLogin from '../pages/business/BusinessLogin';
import BusinessDashboard from '../pages/business/BusinessDashboard';
import BusinessProfile from '../pages/business/BusinessProfile';
import BusinessListing from '../pages/business/BusinessListing';
import UserProfile from '../pages/users/UserProfile'; 
import './App.css';
import ReviewPage from '../pages/review/ReviewPage'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Business Routes */}
          <Route path="/business/register" element={<BusinessRegister />} />
          <Route path="/business/login" element={<BusinessLogin />} />
          <Route path="/business/dashboard" element={<BusinessDashboard />} />
          <Route path="/business/profile" element={<BusinessProfile />} />
          <Route path="/business/listing" element={<BusinessListing />} />
          
          {/* Business Authentication Routes */}
          <Route path="/business/verify-otp" element={<VerifyOtp />} />
          <Route path="/business/forgot-password" element={<ForgotPassword />} />
          <Route path="/business/reset-password" element={<ResetPassword />} />

          {/* Review Route */}
          <Route path="/business/review" element={<ReviewPage />} />
          
          {/* User Profile Route */}
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
        <Footer />
        <ToastContainer /> {/* Add ToastContainer here */}
      </div>
    </Router>
  );
};

export default App;
