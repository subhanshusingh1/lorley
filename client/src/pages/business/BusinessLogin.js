import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginBusiness } from '../../actions/businessAction'; // Update the action import
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const BusinessLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error

    // Input validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    // Uncomment this if you want password length validation
    // if (password.length < 8) {
    //   setError('Password must be at least 8 characters long.');
    //   return;
    // }

    setLoading(true);
    const response = await dispatch(loginBusiness(email, password)); // Dispatch business login action
    setLoading(false);

    if (response.success) {
      toast.success('Login successful!');
      navigate('/business/dashboard'); // Redirect to the business dashboard
    } else {
      toast.error(response.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">Login to Your Business Account</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Business Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your business email"
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
            />
            <div 
              className="absolute right-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-4 text-center">
          <Link to="/business/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have a business account? <Link to="/business/register" className="text-blue-500 hover:underline">Register here</Link></p>
        </div>
      </form>
    </div>
  );
};

export default BusinessLoginPage;
