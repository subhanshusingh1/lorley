import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerBusiness } from '../../actions/businessAction';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const BusinessRegister = () => {
    const [businessName, setBusinessName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [businessType, setBusinessType] = useState('');  
    const [mobile, setmobile] = useState(''); 
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const { loading, error: registerError } = useSelector(state => state.business.businessRegister);

    const registerHandler = () => {
        if (!businessName || !email || !password || !businessType || !mobile || !category) {
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
        if (!/^\d{10}$/.test(mobile)) {
            setError('Please enter a valid 10-digit contact number.');
            return;
        }
        
        setError('');
        dispatch(registerBusiness({ businessName, email, password, businessType, mobile, category }))
            .then(() => navigate('/business/login'));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
            <div className="bg-white shadow-lg rounded-lg px-8 py-6 w-full max-w-md mt-10 mb-10">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Register Your Business</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {registerError && <p className="text-red-500 text-sm mb-4">{registerError}</p>}
                {loading && <p className="text-blue-500 text-sm mb-4">Registering...</p>}

                {/* Form inputs */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Business Name</label>
                    <input
                        type="text"
                        placeholder="Enter your business name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Business Type</label>
                    <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Business Type</option>
                        <option value="Product">Products</option>
                        <option value="Service">Services</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Contact Number</label>
                    <input
                        type="text"
                        placeholder="Enter your contact number"
                        value={mobile}
                        onChange={(e) => setmobile(e.target.value)}
                        className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={registerHandler}
                    className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <div className="mt-4 text-center">
                    <p className="text-gray-600">Already have an account? <Link to="/business/login" className="text-blue-500 hover:underline">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default BusinessRegister;
