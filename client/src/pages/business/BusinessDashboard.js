import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchBusinessDetails, updateBusinessDetails } from '../../actions/businessAction';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BusinessDashboard = ({ businessId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState('service');
  const [contactInfo, setContactInfo] = useState('');
  const [logo, setLogo] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [logoPreview, setLogoPreview] = useState('');
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openingHours, setOpeningHours] = useState({
    monday: { open: { type: '' }, close: { type: '' }, closed: false },
    tuesday: { open: { type: '' }, close: { type: '' }, closed: false },
    wednesday: { open: { type: '' }, close: { type: '' }, closed: false },
    thursday: { open: { type: '' }, close: { type: '' }, closed: false },
    friday: { open: { type: '' }, close: { type: '' }, closed: false },
    saturday: { open: { type: '' }, close: { type: '' }, closed: false },
    sunday: { open: { type: '' }, close: { type: '' }, closed: false },
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
  const navigate = useNavigate(); // For navigation

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
      setLoading(true);
      try {
        if (businessId) {
          const businessData = await dispatch(fetchBusinessDetails(businessId));
          console.log("Fetched Business Data:", businessData); // Log the fetched data
          setName(businessData.name);
          setEmail(businessData.email);
          setBusinessType(businessData.businessType);
          setContactInfo(businessData.contactInfo);
          setLogo(businessData.logo);
          setPhotos(businessData.photos || []);
          setOpeningHours(businessData.openingHours || openingHours);
          setAddress(businessData.address || address);
          setDescription(businessData.description);
          if (businessData.businessType === 'product') {
            setSelectedCategory(businessData.category || '');
          }
        }
      } catch (err) {
        console.error('Error loading business data:', err);
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
      // Fetch new details after update
      const businessData = await dispatch(fetchBusinessDetails(businessId)); // Using fetchBusinessDetails
      setName(businessData.name);
      setEmail(businessData.email);
      setBusinessType(businessData.businessType);
      setContactInfo(businessData.contactInfo);
      setLogo(businessData.logo);
      setPhotos(businessData.photos || []);
      setOpeningHours(businessData.openingHours || openingHours);
      setAddress(businessData.address || address);
      setDescription(businessData.description);
      if (businessData.businessType === 'product') {
        setSelectedCategory(businessData.category || '');
      }
    } catch (err) {
      setError('Failed to submit data. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e) => {
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
                  onChange={(e) => {
                    setBusinessType(e.target.value);
                    setSelectedCategory('');
                  }}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="service">Service</option>
                  <option value="product">Product</option>
                </select>
              </div>

              {businessType === 'product' && (
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">Category:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Logo:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {logoPreview && <img src={logoPreview} alt="Logo Preview" className="mt-2 w-32" />}
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Photos:</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotosUpload}
                  className="w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {photoPreviews.map((url, index) => (
                  <img key={index} src={url} alt={`Photo Preview ${index}`} className="mt-2 w-32" />
                ))}
              </div>
            </div>

            <div className="col-span-full">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-2 rounded focus:outline-none hover:bg-blue-700"
              >
                {loading ? 'Saving...' : 'Save Business Details'}
              </button>
            </div>

            {successMessage && (
              <p className="col-span-full text-center text-green-500">{successMessage}</p>
            )}
            {error && (
              <p className="col-span-full text-center text-red-500">{error}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;


