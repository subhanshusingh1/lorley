import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetBusinessPassword } from '../../actions/businessAction'; // Import business reset password action
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icon

const BusinessResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {}; // Get email from state

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setError(''); // Reset error when typing
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validateInput = () => {
        if (!newPassword || !confirmPassword) {
            setError('All fields are required.');
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            return false;
        }
        return true;
    };

    const resetPasswordHandler = async () => {
        if (!validateInput()) return;

        setError(''); // Clear any previous error
        const response = await dispatch(resetBusinessPassword(email, newPassword)); // Dispatch business reset password action

        if (response.success) {
            toast.success('Password reset successfully!'); // Show success notification
            navigate('/business/login'); // Redirect to business login page after success
        } else {
            toast.error(response.message || 'Failed to reset password. Please try again.'); // Show error notification
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <ToastContainer />
            <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Business Password</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"} // Toggle between text and password types
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={handleInputChange(setNewPassword)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-2 text-gray-600"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"} // Toggle between text and password types
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={handleInputChange(setConfirmPassword)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-3 top-2 text-gray-600"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <button
                    onClick={resetPasswordHandler}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default BusinessResetPassword;
