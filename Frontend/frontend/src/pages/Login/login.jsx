import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../../api/axios.js';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    console.log('Login form submitted with:', { email });
    
    // Basic validation
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Sending login request...');
      const response = await API.post('/auth/login', {
        email,
        password,
      });

      console.log('Login response:', response.data);

      if (response.data.token && response.data.user) {
        console.log('Login successful, calling onLoginSuccess...');
        // Call the onLoginSuccess callback with user data and token
        onLoginSuccess(response.data.user, response.data.token);
        
        // Redirect based on user role
        const role = response.data.user.role || 'patient';
        const redirectPath = `/${role === 'patient' ? 'patient' : role}/dashboard`;
        console.log('Redirecting to:', redirectPath);
        navigate(redirectPath);
        
        toast.success('Login successful!');
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let message = 'Login failed. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          message = 'Invalid email or password';
        } else if (error.response.status === 403) {
          message = 'Account not approved. Please contact administrator.';
        } else if (error.response.status === 400) {
          message = error.response.data?.message || 'Invalid request data';
        } else if (error.response.data && error.response.data.message) {
          message = error.response.data.message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        message = 'No response from server. Please check your connection.';
      }
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-r
 from-sky-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
<div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
</div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center 
                pointer-events-none">
                  <FaUserShield className="h-5 w-5 text-sky-500" />
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
                   focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center
                 pointer-events-none">
                  <FaLock className="h-5 w-5 text-sky-500" />
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-10 py-3 border
                     border-gray-300 rounded-lg
                     placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2
                      focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300
                 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-sky-600
               hover:text-sky-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border
                 border-transparent text-sm font-medium rounded-lg
                  text-white bg-gradient-to-r from-sky-500 to-blue-600
                   hover:from-sky-600 hover:to-blue-700 focus:outline-none 
                   focus:ring-2 focus:ring-offset-2
                    focus:ring-sky-500 disabled:opacity-70 disabled:cursor-not-allowed
                    active:scale-95 transition-all duration-150 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-sky-600 hover:text-sky-500">
              Sign up
            </Link>
          </p>
        </div>
</div>
</div>
  );
};

export default Login;
