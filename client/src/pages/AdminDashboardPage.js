import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const businessData = await api.get('/businesses');
      const userData = await api.get('/users');
      const reviewData = await api.get('/reviews');

      setBusinesses(businessData.data);
      setUsers(userData.data);
      setReviews(reviewData.data);
    };

    fetchData();
  }, []);

  const handleDeleteBusiness = async (id) => {
    await api.delete(`/businesses/${id}`);
    setBusinesses(businesses.filter((business) => business._id !== id));
  };

  const handleDeleteUser = async (id) => {
    await api.delete(`/users/${id}`);
    setUsers(users.filter((user) => user._id !== id));
  };

  const handleDeleteReview = async (id) => {
    await api.delete(`/reviews/${id}`);
    setReviews(reviews.filter((review) => review._id !== id));
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      <section>
        <h3>Businesses</h3>
        <ul>
          {businesses.map((business) => (
            <li key={business._id}>
              {business.name}
              <button onClick={() => handleDeleteBusiness(business._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name}
              <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Reviews</h3>
        <ul>
          {reviews.map((review) => (
            <li key={review._id}>
              {review.text}
              <button onClick={() => handleDeleteReview(review._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
