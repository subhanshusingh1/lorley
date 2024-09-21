import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();

  const businessList = useSelector((state) => state.businessList);
  const { loading: loadingBusinesses, error, businesses } = businessList;

  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newBusiness, setNewBusiness] = useState({
    name: '',
    description: '',
    logo: '',
  });
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    dispatch(listBusinesses());
    fetchUsersAndReviews();
  }, [dispatch]);

  const fetchUsersAndReviews = async () => {
    try {
      const userData = await api.get('/users');
      const reviewData = await api.get('/reviews');
      setUsers(userData.data);
      setReviews(reviewData.data);
    } catch (error) {
      console.error('Error fetching users and reviews', error);
    } finally {
      setLoadingUsers(false);
      setLoadingReviews(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newBusiness.name || !newBusiness.description || !newBusiness.logo) {
      alert('Please fill out all fields.');
      return;
    }
    await dispatch(createBusiness(newBusiness));
    setNewBusiness({ name: '', description: '', logo: '' }); // Reset form
  };

  const handleUpdate = async (id) => {
    await dispatch(updateBusiness(id, newBusiness));
  };

  const handleDeleteBusiness = async (id) => {
    await dispatch(deleteBusiness(id));
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
      {error && <p className="error">{error}</p>}
      {loadingBusinesses && <p>Loading businesses...</p>}

      <section>
        <h3>Manage Businesses</h3>
        <form onSubmit={handleCreate}>
          <label>Business Name:</label>
          <input
            type="text"
            value={newBusiness.name}
            onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
          />

          <label>Description:</label>
          <input
            type="text"
            value={newBusiness.description}
            onChange={(e) => setNewBusiness({ ...newBusiness, description: e.target.value })}
          />

          <label>Logo (URL):</label>
          <input
            type="text"
            value={newBusiness.logo}
            onChange={(e) => setNewBusiness({ ...newBusiness, logo: e.target.value })}
          />

          <button type="submit">Create Business</button>
        </form>

        <div className="business-list">
          <h4>Existing Businesses</h4>
          {businesses && businesses.map((business) => (
            <div key={business._id} className="business-item">
              <p>{business.name}</p>
              <p>{business.description}</p>
              <img src={business.logo} alt={`${business.name} logo`} />

              <button onClick={() => handleUpdate(business._id)}>Update</button>
              <button onClick={() => handleDeleteBusiness(business._id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Users</h3>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                {user.name}
                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>Reviews</h3>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : (
          <ul>
            {reviews.map((review) => (
              <li key={review._id}>
                {review.text}
                <button onClick={() => handleDeleteReview(review._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminDashboardPage;
