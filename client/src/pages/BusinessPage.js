import React, { useState, useEffect } from 'react';
import './BusinessPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateBusiness, fetchCategories, fetchBusinessById } from '../utils/api';

const BusinessPage = ({ businessId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const dispatch = useDispatch();
  const categories = useSelector(state => state.categories);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCategories());
        if (businessId) {
          const businessData = await dispatch(fetchBusinessById(businessId));
          setName(businessData.name);
          setDescription(businessData.description);
          setCategory(businessData.category);
          setLogo(businessData.logo); // Set logo if necessary
        }
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, businessId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    if (logo) {
      formData.append('logo', logo);
    }

    try {
      await dispatch(createOrUpdateBusiness(formData, businessId));
      setSuccessMessage(`Business ${businessId ? 'updated' : 'created'} successfully!`);
      setName('');
      setDescription('');
      setCategory('');
      setLogo(null); // Reset form
    } catch (err) {
      setError('Failed to submit data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="business-page">
      <h2>{businessId ? 'Update' : 'Create'} Business</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          
          <label>Business Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label>Business Logo:</label>
          <input type="file" onChange={(e) => setLogo(e.target.files[0])} />

          {logo && <p>Selected Logo: {logo.name}</p>} {/* Display selected logo name */}

          <button type="submit">{businessId ? 'Update' : 'Create'} Business</button>
        </form>
      )}
    </div>
  );
};

export default BusinessPage;
