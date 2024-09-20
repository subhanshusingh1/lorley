import React, { useState, useEffect } from 'react';
import './BusinessPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateBusiness, fetchCategories } from '../utils/api';

const BusinessPage = ({ businessId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [logo, setLogo] = useState(null);

  const dispatch = useDispatch();
  const categories = useSelector(state => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
    if (businessId) {
      // Fetch business details and populate fields
      // setName, setDescription, setCategory, etc.
    }
  }, [dispatch, businessId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('logo', logo);

    dispatch(createOrUpdateBusiness(formData, businessId));
  };

  return (
    <div className="business-page">
      <h2>{businessId ? 'Update' : 'Create'} Business</h2>
      <form onSubmit={handleSubmit}>
        <label>Business Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label>Business Logo:</label>
        <input type="file" onChange={(e) => setLogo(e.target.files[0])} />

        <button type="submit">{businessId ? 'Update' : 'Create'} Business</button>
      </form>
    </div>
  );
};

export default BusinessPage;
