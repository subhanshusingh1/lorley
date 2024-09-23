import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchBusinessByIdApi, createOrUpdateBusiness } from '../../utils/api';

const BusinessDashboard = ({ businessId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // optional for updates
  const [businessType, setBusinessType] = useState('service');
  const [contactInfo, setContactInfo] = useState('');
  const [logo, setLogo] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [openingHours, setOpeningHours] = useState({
    monday: { open: '', close: '', closed: false },
    tuesday: { open: '', close: '', closed: false },
    wednesday: { open: '', close: '', closed: false },
    thursday: { open: '', close: '', closed: false },
    friday: { open: '', close: '', closed: false },
    saturday: { open: '', close: '', closed: false },
    sunday: { open: '', close: '', closed: false },
  });
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState(''); // Added description state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (businessId) {
          const businessData = await fetchBusinessByIdApi(businessId);
          setName(businessData.name);
          setEmail(businessData.email);
          setBusinessType(businessData.businessType);
          setContactInfo(businessData.contactInfo);
          setLogo(businessData.logo);
          setPhotos(businessData.photos);
          setOpeningHours(businessData.openingHours);
          setAddress(businessData.address);
          setDescription(businessData.description); // Set description if exists
        }
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [businessId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (password) {
      formData.append('password', password);
    }
    formData.append('businessType', businessType);
    formData.append('contactInfo', contactInfo);
    if (logo) {
      formData.append('logo', logo);
    }
    photos.forEach((photo, index) => formData.append(`photos[${index}]`, photo));
    formData.append('openingHours', JSON.stringify(openingHours));
    formData.append('address', address);
    formData.append('description', description); // Append description to form data

    try {
      await createOrUpdateBusiness(formData, businessId);
      setSuccessMessage(`Business ${businessId ? 'updated' : 'created'} successfully!`);
    } catch (err) {
      setError('Failed to submit data');
    } finally {
      setLoading(false);
    }
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? 'AM' : 'PM';
    return `${hour}:00 ${period}`;
  });

  const handleOpeningHoursChange = (day, timeType, value) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [timeType]: value },
    }));
  };

  const handleClosedChange = (day) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], closed: !prev[day].closed },
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 mb-4">
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">{businessId ? 'Update' : 'Add Business Details'}</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500">{error}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            {/* Business Logo */}
            <div className="mb-4 flex items-center">
              {logo && (
                <img src={URL.createObjectURL(logo)} alt="Business Logo" className="h-20 rounded-full mr-4" />
              )}
              <div className="flex-grow">
                <label className="block text-lg font-bold text-gray-700 mb-2">Business Logo:</label>
                <input type="file" onChange={(e) => setLogo(e.target.files[0])} className="border rounded p-2" />
              </div>
            </div>

            {/* Business Name */}
            <label className="block text-lg font-bold text-gray-700 mb-2">Business Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />

            {/* Email */}
            <label className="block text-lg font-bold text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />

            {/* Password (optional) */}
            <label className="block text-lg font-bold text-gray-700 mb-2">Password (Optional):</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />

            {/* Business Type */}
            <label className="block text-lg font-bold text-gray-700 mb-2">Business Type:</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              required
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            >
              <option value="service">Service</option>
              <option value="product">Product</option>
            </select>

            {/* Contact Info */}
            <label className="block text-lg font-bold text-gray-700 mb-2">Contact Info:</label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />

            {/* Add Photos */}
            <label className="block text-lg font-bold text-gray-700 mb-2">Add Photos:</label>
            <input type="file" multiple onChange={(e) => setPhotos(Array.from(e.target.files))} className="mb-4" />

            {/* Opening Hours */}
            <label className="block text-lg font-bold text-gray-700 mb-2">Opening Hours:</label>
            {Object.keys(openingHours).map((day) => (
              <div key={day} className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={openingHours[day].closed}
                    onChange={() => handleClosedChange(day)}
                    className="mr-2"
                  />
                  Closed on {day.charAt(0).toUpperCase() + day.slice(1)}
                </label>
                {!openingHours[day].closed && (
                  <div className="flex space-x-2">
                    <select
                      value={openingHours[day].open}
                      onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                      className="p-2 border border-gray-300 rounded w-full"
                    >
                      <option value="">Open Time</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <select
                      value={openingHours[day].close}
                      onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                      className="p-2 border border-gray-300 rounded w-full"
                    >
                      <option value="">Close Time</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}

            {/* Address */}
            <label className="block text-lg font-bold text-gray-700 mb-2">Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />

            {/* Description (new field) */}
            <label className="block text-lg font-bold text-gray-700 mb-2">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mb-4 p-2 border border-gray-300 rounded w-full"
              placeholder="Add a brief description of the business"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full mt-4"
            >
              {businessId ? 'Update Business Details' : 'Add Business Details'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;
