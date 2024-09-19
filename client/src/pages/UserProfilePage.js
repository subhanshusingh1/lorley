import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, updateUserProfile } from '../actions/userActions';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const dispatch = useDispatch();

  const userProfile = useSelector((state) => state.userProfile);
  const { loading, error, user } = userProfile;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!user) {
      dispatch(getUserProfile());
    } else {
      setName(user.name);
      setEmail(user.email);
      setMobile(user.mobile);
    }
  }, [dispatch, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ name, email, mobile, password }));
  };

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}
      <form onSubmit={submitHandler}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Mobile:</label>
        <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfilePage;
