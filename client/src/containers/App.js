import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomePage from '../pages/HomePage';
// users page 
import LoginPage from '../pages/users/LoginPage';
import RegisterPage from '../pages/users/RegisterPage';
import VerifyOtp from '../pages/users/VerifyOtp';
import ForgotPassword from '../pages/users/ForgotPassword';
import ResetPassword from '../pages/users/ResetPassword';
import UserProfile from '../pages/users/UserProfile'; 

// Business Page 
import BusinessRegister from '../pages/business/BusinessRegister';
import BusinessLogin from '../pages/business/BusinessLogin';
import BusinessDashboard from '../pages/business/BusinessDashboard';
import BusinessProfile from '../pages/business/BusinessProfile';
import BusinessListing from '../pages/business/BusinessListing';
import VerifyBusinessOtp from '../pages/business/VerifyBusinessOtp';
import BusinessForgotPassword  from '../pages/business/BusinessForgotPassword';
import BusinessResetPassword  from '../pages/business/BusinessResetPassword';

import ReviewPage from '../pages/review/ReviewPage'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from '../pages/protectedRoute'; // Import ProtectedRoute

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen"> {/* Apply flexbox for sticky footer */}
        <Navbar />
        <main className="flex-grow"> {/* Main content area */}
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Users Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<UserProfile />} />
            
            {/* Business Pages */}
            <Route path="/business/register" element={<BusinessRegister />} />
            <Route path="/business/login" element={<BusinessLogin />} />
            <Route path="/business/dashboard" element={<BusinessDashboard />} />
            <Route path="/business/profile" element={<BusinessProfile />} />
            <Route path="/business/listing" element={<BusinessListing />} />
            <Route path="/business/verify-otp" element={<VerifyBusinessOtp />} />
            <Route path="/business/forgot-password" element={<BusinessForgotPassword />} />
            <Route path="/business/reset-password" element={<BusinessResetPassword />} />
            
            {/* Review Page */}
            <Route path="/business/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />

          </Routes>
        </main>
        <Footer />
        <ToastContainer /> 
      </div>
    </Router>
  );
};

export default App;
