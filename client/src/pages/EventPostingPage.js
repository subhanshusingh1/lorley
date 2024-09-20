import React, { useState } from 'react';
import './EventPostingPage.css';
import { useDispatch } from 'react-redux';
import { postEvent } from '../utils/api';

const EventPostingPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('location', location);
    formData.append('image', image);

    dispatch(postEvent(formData));
  };

  return (
    <div className="event-posting-container">
      <h2>Post an Event</h2>
      <form onSubmit={handleSubmit}>
        <label>Event Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        
        <label>Location:</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />

        <label>Event Image:</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button type="submit">Post Event</button>
      </form>
    </div>
  );
};

export default EventPostingPage;
