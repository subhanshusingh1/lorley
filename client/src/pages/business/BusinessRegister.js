import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerBusiness } from '../../actions/businessAction';
import { useNavigate } from 'react-router-dom';

const BusinessRegister = () => {
    const [businessName, setBusinessName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [businessType, setBusinessType] = useState('');  
    const [contactNumber, setContactNumber] = useState(''); 
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const registerHandler = () => {
        if (!businessName || !email || !password || !businessType || !contactNumber) {
            setError('All fields are required.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (!/^\d{10}$/.test(contactNumber)) {
            setError('Please enter a valid 10-digit contact number.');
            return;
        }
        
        setError(''); // Clear previous errors
        dispatch(registerBusiness({ businessName, email, password, businessType, contactNumber }));
        navigate('/business/login'); // Redirect to login page after registration
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
            <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Business Registration</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Business Name</label>
                    <input
                        type="text"
                        placeholder="Enter your business name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Business Type</label>
                    <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Select Business Type</option>
                        <option value="products">Services</option>
                        <option value="services">Product</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Contact Number</label>
                    <input
                        type="text"
                        placeholder="Enter your contact number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <button
                    onClick={registerHandler}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default BusinessRegister;
