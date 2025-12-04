import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email: formData.email,
      });

      toast.success('Password reset instructions sent to your email!');
      setSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      
      let message = 'Failed to send reset instructions. Please try again.';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-sky-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <FaEnvelope className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Check Your Email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent password reset instructions to<br />
              <span className="font-medium">{formData.email}</span>
            </p>
          </div>
          
          <div className="mt-8">
            <Link
              to="/login"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Return to Login
            </Link>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the email?{' '}
              <button
                onClick={() => setSubmitted(false)}
                className="font-medium text-sky-600 hover:text-sky-500"
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-sky-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sky-600 hover:text-sky-500 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Login
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-sky-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
