import React, { useState, useEffect } from 'react';
import { doctorDashboardAPI } from '../../api/doctordashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch doctor's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await doctorDashboardAPI.getDoctorAppointments();
        setAppointments(response.appointments || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Update appointment status
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    setUpdatingId(appointmentId);
    
    try {
      await doctorDashboardAPI.updateAppointmentStatus(appointmentId, { status: newStatus });
      
      // Update local state
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId 
            ? { ...apt, status: newStatus }
            : apt
        )
      );
      
      toast.success(`Appointment status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error(error.message || 'Failed to update appointment status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      canceled: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Appointments</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {appointments.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <tr key={appointment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patient?.name || 
                             `${appointment.patient?.firstName || ''} ${appointment.patient?.lastName || ''}`.trim() ||
                             'Unknown Patient'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.patient?.email || 'No email'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(appointment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {appointment.timeslot}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {appointment.disease || 'General'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(appointment.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {appointment.status === 'pending' && (
                              <button
                                onClick={() => handleStatusUpdate(appointment._id, 'scheduled')}
                                disabled={updatingId === appointment._id}
                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                              >
                                {updatingId === appointment._id ? 'Updating...' : 'Confirm'}
                              </button>
                            )}
                            {appointment.status === 'scheduled' && (
                              <button
                                onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                                disabled={updatingId === appointment._id}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              >
                                {updatingId === appointment._id ? 'Updating...' : 'Complete'}
                              </button>
                            )}
                            {(appointment.status === 'pending' || appointment.status === 'scheduled') && (
                              <button
                                onClick={() => handleStatusUpdate(appointment._id, 'canceled')}
                                disabled={updatingId === appointment._id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                {updatingId === appointment._id ? 'Updating...' : 'Cancel'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden p-4 space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {appointment.patient?.name || 
                           `${appointment.patient?.firstName || ''} ${appointment.patient?.lastName || ''}`.trim() ||
                           'Unknown Patient'}
                        </h3>
                        <p className="text-sm text-gray-600">{appointment.patient?.email || 'No email'}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(appointment.status)}
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
                        <span className="text-gray-600">Department:</span>
                        <span className="text-gray-900 text-right flex-1 ml-2">{appointment.disease || 'General'}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {appointment.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'scheduled')}
                          disabled={updatingId === appointment._id}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {updatingId === appointment._id ? 'Updating...' : 'Confirm'}
                        </button>
                      )}
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                          disabled={updatingId === appointment._id}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {updatingId === appointment._id ? 'Updating...' : 'Complete'}
                        </button>
                      )}
                      {(appointment.status === 'pending' || appointment.status === 'scheduled') && (
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'canceled')}
                          disabled={updatingId === appointment._id}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {updatingId === appointment._id ? 'Updating...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No appointments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
