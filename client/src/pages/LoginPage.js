import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../actions/authActions';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [loginMethod, setLoginMethod] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loginMethod === 'password') {
      const response = await dispatch(loginUser(email, password));
      if (response.success) {
        navigate('/dashboard');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } else {
      navigate('/verify-otp');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-6">Login to Your Account</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Login Method
            <span className="text-xs text-gray-500 pl-1">(Select one)</span>
          </label>
          <select
            value={loginMethod}
            onChange={(e) => setLoginMethod(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="password">Password</option>
            <option value="otp">OTP</option>
          </select>
          <div className="absolute right-2 top-10 text-gray-500 pointer-events-none">
            &#x25BC; {/* Down arrow symbol */}
          </div>
        </div>

        {loginMethod === 'password' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          {loginMethod === 'password' ? 'Login with Password' : 'Login with OTP'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
