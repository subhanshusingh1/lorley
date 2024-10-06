import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerBusiness } from '../../actions/businessAction';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Import eye icons

const BusinessRegister = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [businessType, setBusinessType] = useState('');
    const [mobile, setMobile] = useState('');
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

    const { loading, error: registerError } = useSelector(state => state.business);

    const registerHandler = async (e) => {
        e.preventDefault();
        
        // Clear previous error
        setError('');
    
        // Validate required fields
        if (!name || !email || !password || !confirmPassword || !businessType || (businessType === 'Product' && !category) || !mobile) {
            setError('All fields are required.');
            return;
        }
    
        // Validate email format
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
    
        // Check mobile number
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }
    
        // Validate password length
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
    
        // Validate password match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
    
        try {
            await dispatch(registerBusiness({ name, email, password, businessType, mobile, category }));
            navigate('/business/verify-otp');
        } catch (err) {
            console.error("Registration error:", err);
            // Optionally set a user-friendly error message here if needed
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-white shadow-lg rounded-lg px-8 py-6 w-full max-w-md mt-10 mb-10">
                <h2 className="text-3xl font-bold mb-6 text-center">Register Your Business</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {registerError && <p className="text-red-500 text-sm mb-4">{registerError}</p>}
                {loading && <p className="text-blue-500 text-sm mb-4">Registering...</p>}

                <form onSubmit={registerHandler}> {/* Use onSubmit for form submission */}
                    {/* Business Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Business Name</label>
                        <input
                            type="text"
                            placeholder="Enter your business name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Email */}
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

                    {/* Password with toggle visibility */}
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span
                                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                            </span>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span
                                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                            </span>
                        </div>
                    </div>

                    {/* Business Type */}
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

                    {/* Contact Number */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Contact Number</label>
                        <input
                            type="text"
                            placeholder="Enter your contact number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Category (conditional rendering) */}
                    {businessType === 'Product' && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="mb-6">
                        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline">
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BusinessRegister;
