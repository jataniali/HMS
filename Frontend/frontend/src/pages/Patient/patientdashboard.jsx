import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Profile from './profile';
import MyAppointments from './myappointments';
import MyBills from './mybills';
import MyPayment from './mypayment';
import Settings from './settings';
import Doctors from '../../pages/Doctor/doctor';
import Services from '../../components/Services/services';

const NavButton = ({ to, children, isDefaultView }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
                  (isDefaultView && location.pathname === '/my-appointments');
  
  return (
    <Link 
      to={to} 
      className={`px-2 sm:px-3 py-2 sm:py-2.5 rounded-md font-medium text-xs sm:text-sm transition-colors duration-200 text-center ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
      }`}
    >
      {children}
    </Link>
  );
};

const PatientDashboard = ({ user, defaultView }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome back, {user?.username || 'User'}</p>
        </div>

        {/* Navigation */}
        <nav className="bg-white shadow-sm rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          {/* Mobile Menu - Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3">
            <NavButton to="/patient/profile">Profile</NavButton>
            <NavButton to="/patient/appointments" isDefaultView={defaultView === 'appointments'}>
              Appointments
            </NavButton>
            <NavButton to="/patient/bills">Bills</NavButton>
            <NavButton to="/patient/payments">Payments</NavButton>
            <NavButton to="/patient/doctors">Doctors</NavButton>
            <NavButton to="/patient/services">Services</NavButton>
            <NavButton to="/patient/settings">Settings</NavButton>
          </div>
        </nav>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
          {defaultView === 'appointments' ? (
            <MyAppointments />
          ) : (
            <Routes>
              <Route index element={<Profile user={user} />} />
              <Route path="profile" element={<Profile user={user} />} />
              <Route path="appointments" element={<MyAppointments />} />
              <Route path="bills" element={<MyBills user={user} />} />
              <Route path="payments" element={<MyPayment user={user} />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="services" element={<Services />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Profile user={user} />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
