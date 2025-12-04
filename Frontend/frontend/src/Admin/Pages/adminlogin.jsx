import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserShield, FaLock, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Use the configured API instance
      const response = await API.post('/auth/admin/login', {
        email,
        password,
      });

      // Save the admin token and data to local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Update app authentication state
      if (onLoginSuccess) {
        onLoginSuccess(response.data.user, response.data.token);
      }
      
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Admin login failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-linear-to-br
 from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
<div className="text-center">
<div className="mx-auto flex items-center justify-center h-16 w-16
ounded-full bg-indigo-100 mb-4">
<FaShieldAlt className="h-8 w-8 text-indigo-600" />
</div>
<h2 className="mt-2 text-3xl font-extrabold text-gray-900">
Admin Portal
</h2>
<p className="mt-2 text-sm text-gray-600">
Restricted access to authorized personnel only
</p>
</div>
<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserShield className="h-5 w-5 text-indigo-600" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border
                   border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="text-sm">
                  <Link to="/admin/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-indigo-600" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border
                   border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember this device
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border
                border-transparent text-sm font-medium rounded-lg text-white 
                bg-linear-to-r from-indigo-600 to-purple-600
                hover:from-indigo-700 hover:to-purple-700 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign in to Admin Panel'}
            </button>
          </div>
</form>
<div className="text-center text-sm text-gray-500 mt-4">
<p>Not an admin? <Link to="/login" className="font-medium text-indigo-600
 hover:text-indigo-500">Return to user login</Link></p>
</div>
</div>
 </div>
  );
};

export default AdminLogin;
