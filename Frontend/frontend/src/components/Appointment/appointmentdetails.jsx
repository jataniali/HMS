import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../../api/appointment';
import { toast } from 'react-toastify';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await appointmentAPI.getAppointmentById(id);
        setAppointment(response);
      } catch (error) {
        console.error('Error fetching appointment:', error);
        const errorMessage = error.response?.data?.message || 'Failed to load appointment details';
        toast.error(errorMessage);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else if (error.response?.status === 403) {
          toast.error('You are not authorized to view this appointment');
          navigate('/my-appointments');
        } else if (error.response?.status === 404) {
          toast.error('Appointment not found');
          navigate('/my-appointments');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, navigate]);

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentAPI.deleteAppointment(appointmentId);
        toast.success('Appointment cancelled successfully');
        navigate('/my-appointments');
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        toast.error(error.message || 'Failed to cancel appointment');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointment Not Found</h2>
        <p className="text-gray-600 mb-6">The requested appointment could not be found.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Appointment Details</h1>
            <p className="text-gray-600">ID: {appointment._id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {appointment.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Appointment Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(appointment.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="mt-1 text-sm text-gray-900">{appointment.timeslot}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="mt-1 text-sm text-gray-900">{appointment.disease || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Doctor Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="mt-1 text-sm text-gray-900">
                  {appointment.doctor?.name || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Specialization</p>
                <p className="mt-1 text-sm text-gray-900">
                  {appointment.doctor?.specialization || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="mt-1 text-sm text-gray-900">
                  {appointment.doctor?.email || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
          <p className="text-sm text-gray-700">
            {appointment.notes || 'No additional notes provided.'}
          </p>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Appointments
          </button>
          {appointment.status === 'pending' && (
            <button
              onClick={() => handleCancelAppointment(appointment._id)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Cancel Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
