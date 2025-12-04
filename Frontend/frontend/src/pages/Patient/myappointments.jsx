import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../../api/appointment';
import { toast } from 'react-toastify';
import { FaTimes, FaCalendarAlt, FaUserMd, FaClock } from 'react-icons/fa';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const navigate = useNavigate();

  // Fetch appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentAPI.getPatientAppointments();
        setAppointments(response.appointment || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
        if (error.response?.status === 401) {
          // Handle unauthorized (token expired, etc.)
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const [filters, setFilters] = useState({
    doctor: '',
    date: '',
    status: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredAppointments = appointments.filter(apt => {
    return (
      (!filters.doctor || apt.doctor?.name?.toLowerCase().includes(filters.doctor.toLowerCase())) &&
      (!filters.date || new Date(apt.date).toISOString().split('T')[0] === filters.date) &&
      (!filters.status || apt.status.toLowerCase() === filters.status.toLowerCase())
    );
  });

  const statusBadge = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'confirmed': 'bg-blue-100 text-blue-800'
    };

    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
        {displayStatus}
      </span>
    );
  };

  const handleCancelAppointment = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
  };

  const confirmCancelAppointment = async () => {
    if (!appointmentToCancel) return;
    
    setCancelling(true);
    try {
      await appointmentAPI.deleteAppointment(appointmentToCancel._id);
      // Remove the deleted appointment from the state
      setAppointments(prev => prev.filter(apt => apt._id !== appointmentToCancel._id));
      toast.success('Appointment cancelled successfully');
      setShowCancelModal(false);
      setAppointmentToCancel(null);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.message || 'Failed to cancel appointment');
    } finally {
      setCancelling(false);
    }
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setAppointmentToCancel(null);
  };

  return (
    <div className="p-3 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">My Appointments</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your upcoming appointments</p>
          </div>
          <Link
            to="/appointment"
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            Book New Appointment
          </Link>
        </div>

        {/* Filters */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Filters</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Doctor</label>
                  <input
                    type="text"
                    name="doctor"
                    value={filters.doctor}
                    onChange={handleFilterChange}
                    placeholder="Search by doctor"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Appointments - Desktop Table, Mobile Cards */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredAppointments.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Doctor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Specialty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAppointments.map((appointment) => (
                        <tr key={appointment._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {appointment.doctor?.name || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {appointment.doctor?.specialization || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{appointment.disease || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(appointment.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">{appointment.timeslot}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {statusBadge(appointment.status || 'pending')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {appointment.status === 'pending' && (
                              <button
                                onClick={() => handleCancelAppointment(appointment)}
                                className="text-red-600 hover:text-red-900 mr-4"
                              >
                                Cancel
                              </button>
                            )}
                            <Link
                              to={`/appointment/${appointment._id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden p-4 space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div key={appointment._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{appointment.doctor?.name || 'N/A'}</h3>
                          <p className="text-sm text-gray-600">{appointment.doctor?.specialization || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          {statusBadge(appointment.status || 'pending')}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Date:</span>
                          <span className="text-gray-900">{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Time:</span>
                          <span className="text-gray-900">{appointment.timeslot}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Reason:</span>
                          <span className="text-gray-900 text-right flex-1 ml-2">{appointment.disease || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {appointment.status === 'pending' && (
                          <button
                            onClick={() => handleCancelAppointment(appointment)}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                        )}
                        <Link
                          to={`/appointment/${appointment._id}`}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium text-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No appointments found.</p>
                <Link
                  to="/appointment"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Book an Appointment
                </Link>
              </div>
            )}
          </div>
          </>
        )}
      </div>

      {/* Cancel Appointment Modal */}
      {showCancelModal && appointmentToCancel && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-10 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-md sm:w-96 shadow-lg rounded-lg bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Cancel Appointment</h3>
                <button
                  onClick={closeCancelModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <FaUserMd className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="font-medium">Dr. {appointmentToCancel.doctor?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaCalendarAlt className="h-4 w-4 text-green-500 mr-2" />
                  <span>{new Date(appointmentToCancel.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="h-4 w-4 text-orange-500 mr-2" />
                  <span>{appointmentToCancel.timeslot}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to cancel this appointment? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={closeCancelModal}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={cancelling}
                >
                  Keep Appointment
                </button>
                <button
                  onClick={confirmCancelAppointment}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
