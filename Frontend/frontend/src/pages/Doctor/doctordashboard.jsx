import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import CreateBill from './createbill';
import DoctorAppointments from './doctorappointments';
import { doctorDashboardAPI } from '../../api/doctordashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NavButton = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-md font-medium text-xs sm:text-sm transition-colors duration-200 text-center ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
      }`}
    >
      {children}
    </Link>
  );
};

const DoctorDashboard = () => {
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalPatients: 0
  });

  // Fetch doctor profile and stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get doctor profile
        const profileResponse = await doctorDashboardAPI.getDoctorProfile();
        setDoctorProfile(profileResponse.doctor);

        // Get appointments for stats
        const appointmentsResponse = await doctorDashboardAPI.getDoctorAppointments();
        const appointments = appointmentsResponse.appointments || [];
        
        // Get patients for stats
        const patientsResponse = await doctorDashboardAPI.getAssignedPatients();
        const patients = patientsResponse.patients || [];

        // Calculate stats
        setStats({
          totalAppointments: appointments.length,
          pendingAppointments: appointments.filter(apt => apt.status === 'pending').length,
          completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
          totalPatients: patients.length
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Doctor Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Welcome back, Dr. {doctorProfile?.name || doctorProfile?.firstName || 'User'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="shrink-0 bg-blue-100 rounded-full p-2 sm:p-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div className="ml-3 sm:ml-4">
                <h3 className="text-sm sm:text-lg font-medium text-gray-900">Total Appointments</h3>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="shrink-0 bg-yellow-100 rounded-full p-2 sm:p-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-3 sm:ml-4">
                <h3 className="text-sm sm:text-lg font-medium text-gray-900">Pending</h3>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pendingAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="shrink-0 bg-green-100 rounded-full p-2 sm:p-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-3 sm:ml-4">
                <h3 className="text-sm sm:text-lg font-medium text-gray-900">Completed</h3>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.completedAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="shrink-0 bg-purple-100 rounded-full p-2 sm:p-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div className="ml-3 sm:ml-4">
                <h3 className="text-sm sm:text-lg font-medium text-gray-900">Total Patients</h3>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.totalPatients}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-white shadow-sm rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <NavButton to="/doctor/appointments">My Appointments</NavButton>
            <NavButton to="/doctor/create-bill">Create Bill</NavButton>
          </div>
        </nav>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
          <Routes>
            <Route index element={<DoctorAppointments />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="create-bill" element={<CreateBill />} />
            <Route path="*" element={<DoctorAppointments />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
