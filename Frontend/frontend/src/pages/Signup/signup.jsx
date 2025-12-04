import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaVenusMars, FaStethoscope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../../api/axios.js';

const Signup = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    gender: '',
    disease: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { username, email, password, confirmPassword, phone, age, gender, disease } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', { username, email, phone, age, gender, disease });
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!username || !email || !password || !disease) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Sending registration request...');
      // First register the user
      const registerResponse = await API.post('/auth/register', {
        username,
        email,
        password,
        phone,
        age: Number(age) || 0,
        gender,
        disease
      });

      console.log('Registration response:', registerResponse.data);

      if (registerResponse.data.success) {
        console.log('Registration successful, attempting login...');
        // After successful registration, automatically log the user in
        const loginResponse = await API.post('/auth/login', {
          email,
          password,
        });

        console.log('Login response:', loginResponse.data);

        if (loginResponse.data.token && loginResponse.data.user) {
          console.log('Login successful, calling onSignupSuccess...');
          onSignupSuccess(loginResponse.data.user, loginResponse.data.token);
          toast.success('Registration and login successful!');
          navigate('/patient/dashboard');
        } else {
          toast.success('Registration successful! Please login.');
          navigate('/login');
        }
      } else {
        toast.error(registerResponse.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-linear-to-r
 from-sky-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
<div className="text-center">
<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
 Create an account
 </h2>
<p className="mt-2 text-sm text-gray-600">
 Join us today and take control of your health
</p>
</div>       
<form className="mt-8 space-y-4" onSubmit={handleSubmit}>
<div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-sky-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="Username"
                />
              </div>
            </div>
          </div>
<div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center
               pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-sky-500" />
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
                 focus:outline-none focus:ring-2 focus:ring-sky-500
                  focus:border-sky-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
</div>      
 <div>
<label htmlFor="phone" className="sr-only">
Phone Number
</label>
<div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center 
              pointer-events-none">
                <FaPhone className="h-5 w-5 text-sky-500" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={phone}
                onChange={handleChange}
                className="appearance-none block w-full pl-10 pr-3 py-3 border
                 border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 
                 focus:outline-none focus:ring-2 focus:ring-sky-500
                  focus:border-sky-500 sm:text-sm"
                placeholder="Phone Number"
              />
</div>
</div>
          
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="age" className="sr-only">
                Age
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-sky-500" />
                </div>
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={age}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="Age"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="gender" className="sr-only">
                Gender
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaVenusMars className="h-5 w-5 text-sky-500" />
                </div>
                <select
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="disease" className="sr-only">
              Medical Condition
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaStethoscope className="h-5 w-5 text-sky-500" />
              </div>
              <input
                id="disease"
                name="disease"
                type="text"
                required
                value={disease}
                onChange={handleChange}
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                placeholder="Medical Condition"
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
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="6"
                value={password}
                onChange={handleChange}
                className="appearance-none block w-full pl-10 pr-3 py-3 border
                 border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 
                 focus:outline-none focus:ring-2 focus:ring-sky-500
                  focus:border-sky-500 sm:text-sm"
                placeholder="Create a password"
              />
            </div>
</div>
          
<div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
<div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center 
              pointer-events-none">
                <FaLock className="h-5 w-5 text-sky-500" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength="6"
                value={confirmPassword}
                onChange={handleChange}
                className="appearance-none block w-full pl-10 pr-3 py-3 border
                 border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 
                 focus:outline-none focus:ring-2 focus:ring-sky-500
                  focus:border-sky-500 sm:text-sm"
                placeholder="Confirm your password"
              />
</div>
</div>
          
   <div className="flex items-start">
    <div className="flex items-center h-5">
      <input
        id="terms"
        name="terms"
        type="checkbox"
        required
        className="h-5 w-5 text-sky-600 focus:ring-sky-500 border-2 border-gray-300 rounded focus:ring-2 focus:ring-offset-0"
      />
    </div>
    <div className="ml-3">
      <label htmlFor="terms" className="text-sm text-gray-700">
        I agree to the{' '}
        <a href="#" className="font-medium text-sky-600 hover:underline">
          Terms and Conditions
        </a>
      </label>
    </div>
  </div>
<div>
<button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border
                 border-transparent text-sm font-medium rounded-lg text-white
                  bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600
                   hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-sky-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating account...' : 'Create Account'}
 </button>
</div>
</form>
<div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-sky-600
             hover:text-sky-500">
              Sign in
            </Link>
          </p>
</div>
</div>
</div>
  );
};

export default Signup;
