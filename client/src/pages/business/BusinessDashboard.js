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
  const [category, setCategory] = useState('');
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

  // Function to fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/categories`);
        setCategories(res.data.categories); // Set categories from the response
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError('Failed to fetch categories.');
      }
    };
    fetchCategories();
  }, []);

  // Function to handle category selection
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Use useEffect to fetch categories on component mount
  // useEffect(() => {
  //   fetchCategories();
  // }, []);

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
    formData.append('address', JSON.stringify(address)); // Ensure address is a string
    formData.append('description', description);
    formData.append('category', selectedCategory); // Include selected category

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

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/business/upload-profile-image', formData);
      const logoUrl = response.data.secure_url;
      console.log('Logo uploaded:', logoUrl);
      toast.success('Logo uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload logo');
    }
  };

  const handlePhotosUpload = async (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    const photoUrls = [];
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'your_upload_preset');

      try {
        const response = await axios.post('http://localhost:5000/api/v1/users/upload-photos', formData);
        photoUrls.push(response.data.secure_url);
        toast.success(`${file.name} uploaded successfully!`);
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
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-8 mb-5">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          {businessId ? 'Update Business Details' : 'Add Business Details'}
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Section (Larger) */}
            <div className="md:col-span-2 space-y-4">
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
                <div className="grid grid-cols-2 gap-4">
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
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
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
                <div className="grid grid-cols-2 gap-4 mt-4">
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

              {/* Category Selection */}
              <div>
                {error && <div className="text-red-600 mb-4">{error}</div>}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.length > 0 ? (
                      categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))
                    ) : (
                      <option value="">No categories available</option>
                    )}
                  </select>
                </div>
              </div>
              {/* Opening Hours */}
              <div className="mt-4">
                <h2 className="text-lg font-bold">Opening Hours:</h2>
                {Object.keys(openingHours).map((day) => (
                  <div key={day} className="flex items-center justify-between mt-2">
                    <span>{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                    <div>
                      <input
                        type="time"
                        value={openingHours[day].open.type}
                        onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                        disabled={openingHours[day].closed}
                        className="border border-gray-300 rounded p-1"
                      />
                      <span className="mx-2">to</span>
                      <input
                        type="time"
                        value={openingHours[day].close.type}
                        onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                        disabled={openingHours[day].closed}
                        className="border border-gray-300 rounded p-1"
                      />
                      <label className="ml-2">
                        <input
                          type="checkbox"
                          checked={openingHours[day].closed}
                          onChange={() => handleClosedChange(day)}
                        />
                        Closed
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Logo Upload */}
              <div className="mt-4">
                <label className="block text-lg font-bold text-gray-700 mb-2">Upload Logo:</label>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full mb-2" />
                {logoPreview && <img src={logoPreview} alt="Logo Preview" className="h-24 w-24 object-cover rounded" />}
              </div>

              {/* Photos Upload */}
              <div className="mt-4">
                <label className="block text-lg font-bold text-gray-700 mb-2">Upload Photos:</label>
                <input type="file" accept="image/*" multiple onChange={handlePhotosUpload} className="w-full mb-2" />
                <div className="grid grid-cols-3 gap-2">
                  {photoPreviews.map((preview, index) => (
                    <img key={index} src={preview} alt={`Photo Preview ${index}`} className="h-24 w-24 object-cover rounded" />
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500">{error}</p>}
              {successMessage && <p className="text-green-500">{successMessage}</p>}
            </div>

            {/* Submit Button Section */}
            <div className="md:col-span-1 flex justify-center items-end">
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? 'Submitting...' : 'Save Business'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;
