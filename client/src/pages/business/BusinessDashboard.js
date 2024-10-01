import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchBusinessById, updateBusinessDetails } from '../../actions/businessAction';
import axios from 'axios';
import { toast } from 'react-toastify';

const BusinessDashboard = ({ businessId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessType, setBusinessType] = useState('service');
  const [contactInfo, setContactInfo] = useState('');
  const [logo, setLogo] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [logoPreview, setLogoPreview] = useState('');
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  // const [category, setCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openingHours, setOpeningHours] = useState({
    monday: { open: { type: '', required: true }, close: { type: '', required: true }, closed: false },
    tuesday: { open: { type: '', required: true }, close: { type: '', required: true }, closed: false },
    wednesday: { open: { type: '', required: true }, close: { type: '', required: true }, closed: false },
    thursday: { open: { type: '', required: true }, close: { type: '', required: true }, closed: false },
    friday: { open: { type: '', required: true }, close: { type: '', required: true }, closed: false },
    saturday: { open: { type: '', required: true }, close: { type: '', required: true }, closed: false },
    sunday: { open: { type: '', required: true }, close: { type: '', required: true }, closed: false },
  });
  const [address, setAddress] = useState({
    houseFlatBlockNo: '',
    areaStreetVillage: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
  });
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/categories`);
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError('Failed to fetch categories.');
      }
    };
    fetchCategories();
  }, []);

  // Fetch business data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (businessId) {
          const businessData = await dispatch(fetchBusinessById(businessId));
          setName(businessData.name);
          setEmail(businessData.email);
          setBusinessType(businessData.businessType);
          setContactInfo(businessData.contactInfo);
          setLogo(businessData.logo);
          setPhotos(businessData.photos || []);
          setOpeningHours(businessData.openingHours || openingHours);
          setAddress(businessData.address || address);
          setDescription(businessData.description);
        }
      } catch (err) {
        setError('Failed to load business data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [businessId, dispatch]);

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
    photos.forEach((photo) => formData.append('photos', photo));
    formData.append('openingHours', JSON.stringify(openingHours));
    formData.append('address', JSON.stringify(address));
    formData.append('description', description);
    formData.append('category', selectedCategory);

    try {
      await dispatch(updateBusinessDetails(formData, businessId));
      setSuccessMessage(`Business ${businessId ? 'updated' : 'created'} successfully!`);
    } catch (err) {
      setError('Failed to submit data. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handlePhotosUpload = async (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    const photoUrls = [];
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/upload-photos`, formData);
        photoUrls.push(response.data.secure_url);
      } catch (err) {
        toast.error(`Failed to upload ${file.name}`);
      }
    });

    await Promise.all(uploadPromises);
    setPhotoPreviews(photoUrls);
  };

  const handleOpeningHoursChange = (day, timeType, value) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [timeType]: { type: value, required: true } },
    }));
  };

  const handleClosedChange = (day) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], closed: !prev[day].closed },
    }));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          {businessId ? 'Update Business Details' : 'Add Business Details'}
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Section (Larger) */}
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Business Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Business Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                />
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                <h2 className="text-2xl font-semibold mb-4">Business Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium">House/Flat/Block No:</label>
                    <input
                      type="text"
                      value={address.houseFlatBlockNo}
                      onChange={(e) => setAddress({ ...address, houseFlatBlockNo: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Area/Street/Village:</label>
                    <input
                      type="text"
                      value={address.areaStreetVillage}
                      onChange={(e) => setAddress({ ...address, areaStreetVillage: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">City:</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">State:</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Landmark:</label>
                    <input
                      type="text"
                      value={address.landmark}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Pincode:</label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Opening Hours Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Opening Hours</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(openingHours).map((day) => (
                    <div key={day}>
                      <label className="block font-medium">{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={openingHours[day].closed}
                            onChange={() => handleClosedChange(day)}
                            className="mr-2"
                          />
                          <span>Closed</span>
                        </div>
                        {!openingHours[day].closed && (
                          <>
                            <input
                              type="time"
                              value={openingHours[day].open.type}
                              onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                              className="w-1/2 p-2 border border-gray-300 rounded"
                            />
                            <span>-</span>
                            <input
                              type="time"
                              value={openingHours[day].close.type}
                              onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                              className="w-1/2 p-2 border border-gray-300 rounded"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section (Smaller) */}
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Contact Info:</label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Business Type:</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="service">Service</option>
                  <option value="retail">Retail</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Logo:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                />
                {logoPreview && (
                  <img src={logoPreview} alt="Logo Preview" className="mt-2 h-32 w-32 object-cover" />
                )}
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Photos:</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotosUpload}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                />
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {photoPreviews.map((photo, index) => (
                    <img key={index} src={photo} alt={`Photo Preview ${index}`} className="h-32 w-32 object-cover" />
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-full mt-4">
              <button
                type="submit"
                className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 ease-in-out ${loading && 'opacity-50 cursor-not-allowed'}`}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Business Details'}
              </button>
              {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
              {error && <p className="mt-4 text-red-600">{error}</p>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;
