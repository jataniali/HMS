import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar/navbar.jsx';
import Home from './pages/Home/home.jsx';
import Footer from './components/Footer/footer.jsx';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ScrollToTop from './components/Scroll/scroll.jsx';
import Login from './pages/Login/login.jsx';
import { toast } from 'react-toastify';
import API from './api/axios.js';

// Lazy loaded components
const About = lazy(() => import('./components/About/aboutfull.jsx'));
const Services = lazy(() => import('./components/Services/servicefull.jsx'));
const Doctor = lazy(() => import('./pages/Doctor/doctor.jsx'));
const Contact = lazy(() => import('./components/Contact/contact.jsx'));
const Appointment = lazy(() => import('./components/Appointment/appointment.jsx'));
const Signup = lazy(() => import('./pages/Signup/signup.jsx'));
const ForgotPassword = lazy(() => import('./pages/Login/forgotpassword.jsx'));
const PatientDashboard = lazy(() => import('./pages/Patient/patientdashboard.jsx'));
const AppointmentDetails = lazy(() => import('./components/Appointment/appointmentdetails.jsx'));
// Admin components
const AdminLogin = lazy(() => import('./Admin/Pages/adminlogin.jsx'));
const AdminDashboard = lazy(() => import('./Admin/Pages/admindashboard.jsx'));
const DoctorManagement = lazy(() => import('./Admin/Pages/doctormanagement.jsx'));
const ServiceManagement = lazy(() => import('./Admin/Pages/service.jsx'));
// Doctor components
const DoctorDashboard = lazy(() => import('./pages/Doctor/doctordashboard.jsx'));

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load with caching
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const cachedUser = sessionStorage.getItem('cachedUser');
        
        if (token) {
          // Set the default Authorization header for all axios requests
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Try to use cached user data first for faster initial load
          if (cachedUser) {
            setUser(JSON.parse(cachedUser));
            setIsAuthenticated(true);
          }
          
          // Fetch fresh user data in background
          const response = await API.get('/auth/me');
          setUser(response.data);
          setIsAuthenticated(true);
          sessionStorage.setItem('cachedUser', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        sessionStorage.removeItem('cachedUser');
        delete API.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('cachedUser');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <Navbar 
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />
        <ScrollToTop />
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/services' element={<Services />} />
            <Route path='/doctors' element={<Doctor />} />
            <Route path='/contacts' element={<Contact />} />
            <Route 
              path='/appointment' 
              element={
                isAuthenticated ? 
                <Appointment user={user} /> : 
                <Login onLoginSuccess={handleLogin} />
              } 
            />
            <Route 
              path='/login' 
              element={<Login onLoginSuccess={handleLogin} />} 
            />
            <Route 
              path='/signup' 
              element={<Signup onSignupSuccess={handleLogin} />} 
            />
            <Route 
              path='/forgot-password' 
              element={<ForgotPassword />} 
            />
            <Route 
              path='/patient/*' 
              element={
                isAuthenticated ? 
                <PatientDashboard user={user} /> : 
                <Login onLoginSuccess={handleLogin} />
              } 
            />
            <Route 
              path='/my-appointments' 
              element={
                isAuthenticated ?
                <PatientDashboard user={user} defaultView="appointments" /> :
                <Login onLoginSuccess={handleLogin} />
              } 
            />
            <Route 
              path="/appointment/:id" 
              element={
                isAuthenticated ?
                <AppointmentDetails /> :
                <Login onLoginSuccess={handleLogin} />
              } 
            />
            
            {/* Admin Routes */}
            <Route path='/admin/login' element={<AdminLogin onLoginSuccess={handleLogin} />} />
            <Route 
              path='/admin/*' 
              element={
                isAuthenticated && user?.role === 'admin' ? 
                <AdminDashboard /> : 
                <AdminLogin onLoginSuccess={handleLogin} />
              } 
            />
            
            {/* Doctor Routes */}
            <Route 
              path='/doctor/*' 
              element={
                isAuthenticated && user?.role === 'doctor' ? 
                <DoctorDashboard /> : 
                <Login onLoginSuccess={handleLogin} />
              } 
            />
            
            {/* Direct Admin Routes (for easier access) */}
            <Route 
              path='/admin/dashboard' 
              element={
                isAuthenticated && user?.role === 'admin' ? 
                <AdminDashboard /> : 
                <AdminLogin onLoginSuccess={handleLogin} />
              } 
            />
            <Route 
              path='/admin/doctors' 
              element={
                isAuthenticated && user?.role === 'admin' ? 
                <DoctorManagement /> : 
                <AdminLogin onLoginSuccess={handleLogin} />
              } 
            />
            <Route 
              path='/admin/services' 
              element={
                isAuthenticated && user?.role === 'admin' ? 
                <ServiceManagement /> : 
                <AdminLogin onLoginSuccess={handleLogin} />
              } 
            />
          </Routes>
        </Suspense>  
        <Footer />
      </div>
    </Router>  
  );
};

export default App;
