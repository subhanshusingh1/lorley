import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Higher-Order Component to protect routes
const ProtectedRoute = ({ children }) => {
  const isUserLoggedIn = !!Cookies.get('accessToken'); // Check for user access token
  const isBusinessLoggedIn = !!Cookies.get('refreshToken'); // Check for business refresh token

  // If neither user nor business is logged in, redirect to login
  if (!isUserLoggedIn && !isBusinessLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children; // Render the protected component
};

export default ProtectedRoute;
