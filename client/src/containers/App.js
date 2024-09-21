import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomePage from '../pages/HomePage';
// import BusinessListingPage from '../pages/BusinessListingPage';
// import BusinessPage from '../pages/BusinessPage';
import LoginPage from '../pages/LoginPage';
// import AdminDashboard from '../pages/AdminDashboardPage';
import RegisterPage from '../pages/RegisterPage';
// import ReviewPage from '../pages/ReviewPage';
import VerifyOtp from '../pages/VerifyOtp'; // Import the VerifyOtpPage component
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
          {/* <Route path="/business" element={<BusinessListingPage />} /> */}
          {/* <Route path="/business/:id" element={<BusinessPage />} /> */}
          {/* <Route path="/review" element={<ReviewPage />} /> */}
          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          <Route path="/verify-otp" element={<VerifyOtp />} /> {/* Add OTP verification route */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
