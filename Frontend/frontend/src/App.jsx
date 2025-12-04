import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/navbar.jsx';
import Home from './pages/Home/home.jsx';
import Footer from './components/Footer/footer.jsx';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import About from './components/About/aboutfull.jsx';
import Services from './components/Services/servicefull.jsx';
import Doctor from './pages/Doctor/doctor.jsx';
import Contact from './components/Contact/contact.jsx';
import Appointment from './components/Appointment/appointment.jsx';
import ScrollToTop from './components/Scroll/scroll.jsx';
import Login from './pages/Login/login.jsx';
import Signup from './pages/Signup/signup.jsx';
import ForgotPassword from './pages/Login/forgotpassword.jsx';
import PatientDashboard from './pages/Patient/patientdashboard.jsx';
import AppointmentDetails from './components/Appointment/appointmentdetails.jsx';
// Admin components
import AdminLogin from './Admin/Pages/adminlogin.jsx';
import AdminDashboard from './Admin/Pages/admindashboard.jsx';
import DoctorManagement from './Admin/Pages/doctormanagement.jsx';
import ServiceManagement from './Admin/Pages/service.jsx';
// Doctor components
import DoctorDashboard from './pages/Doctor/doctordashboard.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Set the default Authorization header for all axios requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user data
          const response = await axios.get('http://localhost:5000/api/auth/me');
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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
        <Footer />
      </div>
    </Router>  
  );
};

export default App;
