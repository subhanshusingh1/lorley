import React from 'react';
import { Route, Router } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import BusinessListingPage from '../pages/BusinessListingPage';
import BusinessPage from '../pages/BusinessPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import ReviewPage from '../pages/ReviewPage';

const Routes = () => (
  <Router>
    <Routes>
      <Route exact path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/business" component={BusinessListingPage} />
      <Route path="/business/:id" component={BusinessPage} />
      <Route path="/review" component={ReviewPage} />
    </Routes>
  </Router>
);

export default Routes;
