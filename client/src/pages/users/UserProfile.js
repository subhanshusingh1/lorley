import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUserProfile, deleteUserAccount, fetchUserProfile, uploadProfileImage } from '../../actions/authActions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);
    const error = useSelector(state => state.auth.error);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [imagePreview, setImagePreview] = useState("https://via.placeholder.com/150");
    const [isDeleteAccountVisible, setDeleteAccountVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false); // Loading state for profile update

    const userId = user?._id;

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserProfile(userId));
        } else {
            console.error("User ID is not available");
        }
    }, [dispatch, userId]);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setImagePreview(user.profileImage);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loader">Loading...</div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true); // Set loading state to true
        try {
            await dispatch(updateUserProfile({ name, email }));
            toast.success('Profile updated successfully!');
            // Fetch updated user data after successful update
            await dispatch(fetchUserProfile(userId));
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsUpdating(false); // Reset loading state
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        try {
            const profileImageUrl = await dispatch(uploadProfileImage(file));
            console.log('Profile Image URL:', profileImageUrl); // Log the URL for debugging
            setImagePreview(profileImageUrl);
            toast.success('Profile image uploaded successfully!');
        } catch (err) {
            console.error('Image upload failed:', err);
            toast.error('Image upload failed. Please try again.');
        }
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
        if (user) {
            dispatch(deleteUserAccount(user._id, password))
                .then(() => {
                    toast.success('User account deleted successfully!');
                    document.cookie = 'jwt=; Max-Age=0; path=/';
                    navigate('/');
                })
                .catch((err) => {
                    toast.error('Failed to delete account. Please try again.');
                });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="w-full md:w-1/3 bg-blue-600 flex flex-col items-center justify-center p-6">
                    <img
                        className="rounded-full h-32 w-32 object-cover border-4 border-white mb-4"
                        src={imagePreview || "https://via.placeholder.com/150"} 
                        alt="User Avatar"
                    />
                    <h2 className="text-white text-2xl font-semibold mb-2">{name || 'No Name Available'}</h2>

                    {/* Upload Image Button */}
                    <input
                        type="file"
                        id="profileImage"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    <label
                        htmlFor="profileImage"
                        className="mt-2 cursor-pointer bg-gray-200 text-gray-700 py-1 px-2 text-sm rounded hover:bg-gray-300"
                    >
                        Upload Profile Image
                    </label>
                </div>

                <div className="w-full md:w-2/3 p-8">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Profile Information</h2>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="No Name Available"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                readOnly
                                placeholder="No Email Available"
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full ${isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'} text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300`}
                            disabled={isUpdating} // Disable button while updating
                        >
                            {isUpdating ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Change Password</h3>
                        <button
                            onClick={handlePasswordChange}
                            className="w-full bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded hover:bg-gray-400 focus:outline-none"
                        >
                            Change Password
                        </button>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Logout</h3>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 text-white font-semibold py-1 px-2 rounded hover:bg-red-700 focus:outline-none"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Delete Account</h3>
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
                                className="w-full mt-2 bg-red-600 text-white font-semibold py-1 px-2 rounded hover:bg-red-700 focus:outline-none"
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
