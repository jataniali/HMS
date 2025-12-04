import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/admin';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    pendingPayments: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get all patients
        const patientsResponse = await adminAPI.getAllPatients();
        const totalPatients = patientsResponse.patients?.length || 0;

        // Get all doctors
        const doctorsResponse = await adminAPI.getAllDoctors();
        const totalDoctors = doctorsResponse.doctors?.length || 0;

        // Get all appointments and filter for today
        const appointmentsResponse = await adminAPI.getAllAppointments();
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointmentsResponse.appointments?.filter(apt => 
          apt.date && apt.date.startsWith(today)
        ).length || 0;

        // Get all bills for revenue and pending payments
        const billsResponse = await adminAPI.getAllBills();
        const bills = billsResponse.bills || [];
        const totalRevenue = bills
          .filter(bill => bill.status === 'paid')
          .reduce((sum, bill) => sum + (bill.total || 0), 0);
        const pendingPayments = bills
          .filter(bill => bill.status === 'pending')
          .reduce((sum, bill) => sum + (bill.total || 0), 0);

        setStats({
          totalPatients,
          totalDoctors,
          todayAppointments,
          totalRevenue,
          pendingPayments
        });

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
    <div className="p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Admin Dashboard</h1>
        
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-8">
          
          {/* Total Patients Card */}
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0 bg-blue-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Patients
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.totalPatients.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="text-blue-600 font-medium">Registered patients</span>
              </div>
            </div>
          </div>

          {/* Total Doctors Card */}
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0 bg-green-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Doctors
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.totalDoctors.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="text-green-600 font-medium">Active doctors</span>
              </div>
            </div>
          </div>

          {/* Today's Appointments Card */}
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0 bg-yellow-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Today's Appointments
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.todayAppointments.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="text-yellow-600 font-medium">Scheduled for today</span>
              </div>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0 bg-purple-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Revenue
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      Ksh {stats.totalRevenue.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="text-purple-600 font-medium">All paid bills</span>
              </div>
            </div>
          </div>

          {/* Pending Payments Card */}
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0 bg-red-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Payments
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      Ksh {stats.pendingPayments.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="text-red-600 font-medium">Unpaid bills</span>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link 
              to="/admin/patients"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm sm:text-base"
            >
              Manage Patients
            </Link>
            <Link 
              to="/admin/doctors"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center text-sm sm:text-base"
            >
              Manage Doctors
            </Link>
            <Link 
              to="/admin/appointments"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-center text-sm sm:text-base"
            >
              View All Appointments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
