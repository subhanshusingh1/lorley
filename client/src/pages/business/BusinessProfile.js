import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusinessProfile, updateBusinessProfile, uploadBusinessImage } from '../../actions/businessAction';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BusinessProfile = ({ businessId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const business = useSelector((state) => state.business.business);
    const loading = useSelector((state) => state.business.loading);
    const error = useSelector((state) => state.business.error);

    console.log(business);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [imagePreview, setImagePreview] = useState('https://via.placeholder.com/150');
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch business profile on component mount
    useEffect(() => {
        if (businessId) {
            dispatch(fetchBusinessProfile(businessId));
        }
    }, [dispatch, businessId]);

    // Set state when business data is fetched
    useEffect(() => {
        if (business) {
            setName(business.name || '');
            setEmail(business.email || '');
            setCategory(business.category || '');
            setMobile(business.mobile || '');
            setAddress(business.address || '');
            setImagePreview(business.logo || 'https://via.placeholder.com/150');
        }
    }, [business]);

    // Loading state
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // const logoUrl = await dispatch(uploadBusinessImage(file));
                // setImagePreview(logoUrl);
                toast.success('Business logo uploaded successfully!');
            } catch (err) {
                toast.error('Image upload failed. Please try again.');
            }
        }
    };

    // Handle profile update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            // await dispatch(updateBusinessProfile({ businessId, name, email, category, mobile, address }));
            toast.success('Business profile updated successfully!');
            await dispatch(fetchBusinessProfile(businessId)); // Refetch to get the latest data
        } catch (err) {
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="w-full md:w-1/3 bg-blue-600 flex flex-col items-center justify-center p-6">
                    <img
                        className="rounded-full h-32 w-32 object-cover border-4 border-white mb-4"
                        src={imagePreview}
                        alt="Business Logo"
                    />
                    <h2 className="text-white text-2xl font-semibold mb-2">{name || 'Business Name Not Available'}</h2>
                    
                    <input
                        type="file"
                        id="businessLogo"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    <label
                        htmlFor="businessLogo"
                        className="mt-2 cursor-pointer bg-gray-200 text-gray-700 py-1 px-2 text-sm rounded hover:bg-gray-300"
                    >
                        Upload Business Logo
                    </label>
                </div>

                <div className="w-full md:w-2/3 p-8">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Business Profile Information</h2>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Business Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Business Name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Email"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Business Category"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile</label>
                            <input
                                type="text"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Mobile Number"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Business Address"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full ${isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'} text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300`}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BusinessProfile;
