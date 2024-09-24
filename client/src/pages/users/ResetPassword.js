import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../actions/authActions';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { emailOrPhone } = location.state || {};

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setError(''); // Reset error when typing
    };

    const validateInput = () => {
        if (!otp || !newPassword || !confirmPassword) {
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
        if (!/^[A-Z0-9]+$/.test(otp) || otp.length !== 8) {
            setError('Please enter a valid OTP.');
            return false;
        }
        return true;
    };

    const resetPasswordHandler = async () => {
        if (!validateInput()) return;

        setError(''); // Clear any previous error
        const response = await dispatch(resetPassword(emailOrPhone, otp, newPassword));

        if (response.success) {
            toast.success('Password reset successfully!'); // Show success notification
            navigate('/login'); // Redirect to login page after success
        } else {
            toast.error(response.message || 'Failed to reset password. Please try again.'); // Show error notification
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
            <ToastContainer />
            <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Reset Password</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">OTP</label>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={handleInputChange(setOtp)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={handleInputChange(setNewPassword)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password</label>
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={handleInputChange(setConfirmPassword)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
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

export default ResetPassword;
