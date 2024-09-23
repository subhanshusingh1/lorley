import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUserProfile, deleteUserAccount, fetchUserProfile } from '../../actions/authActions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);
    const error = useSelector(state => state.auth.error);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDeleteAccountVisible, setDeleteAccountVisible] = useState(false);
    const [password, setPassword] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(fetchUserProfile(token));
        }
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setMobile(user.mobile || '');
            setImagePreview(user.profileImage || "https://via.placeholder.com/150"); // Set initial image from user data
        }
    }, [user]);

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('/api/v1/upload', formData);
            return response.data.url;
        } catch (error) {
            toast.error('Image upload failed.');
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = '';
        if (profileImage) {
            imageUrl = await handleImageUpload(profileImage);
        }

        dispatch(updateUserProfile({ name, email, mobile, profileImage: imageUrl }))
            .then(() => {
                toast.success('Profile updated successfully!');
                // Update image preview after successful update
                setImagePreview(imageUrl || imagePreview);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    const handlePasswordChange = () => {
        navigate('/forgot-password');
    };

    const handleLogout = () => {
        dispatch(logout());
        toast.info('You have been logged out.');
        navigate('/');
    };

    const handleDeleteAccount = () => {
        if (user) { // Check if user is available
          dispatch(deleteUserAccount(user._id, password)) // Pass user ID and password
            .then(() => {
              toast.success('User account deleted successfully!');
              navigate('/');
            })
            .catch((err) => {
              toast.error('Failed to delete account. Please try again.');
            });
        }
      };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Left Section: User Image and Name */}
                <div className="w-1/3 bg-blue-600 flex flex-col items-center justify-center p-6">
                    <img 
                        className="rounded-full h-32 w-32 object-cover border-4 border-white mb-4" 
                        src={imagePreview} 
                        alt="User Avatar"
                    />
                    <h2 className="text-white text-2xl font-semibold">{name}</h2>
                </div>

                {/* Right Section: User Info and Actions */}
                <div className="w-2/3 p-8">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">{name} Information</h2>

                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    setProfileImage(e.target.files[0]);
                                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                                }}
                                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile</label>
                            <input
                                type="text"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            Update Profile
                        </button>
                    </form>

                    <div className="mt-6">
                        <button
                            onClick={handlePasswordChange}
                            className="w-full bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none"
                        >
                            Change Password
                        </button>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 focus:outline-none"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setDeleteAccountVisible(!isDeleteAccountVisible)}
                            className="text-red-600 hover:underline font-medium"
                        >
                            {isDeleteAccountVisible ? 'Cancel Account Deletion' : 'Delete Account'}
                        </button>
                    </div>

                    {isDeleteAccountVisible && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                                required
                            />
                            <button
                                onClick={handleDeleteAccount}
                                className="w-full mt-2 bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 focus:outline-none"
                            >
                                Confirm Deletion
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
