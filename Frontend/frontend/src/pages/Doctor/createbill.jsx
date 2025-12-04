import React, { useState, useEffect } from 'react';
import { doctorDashboardAPI } from '../../api/doctordashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateBill = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [billItems, setBillItems] = useState([{ name: '', price: '' }]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  // Handle appointment selection
  const handleAppointmentChange = (e) => {
    const appointmentId = e.target.value;
    setSelectedAppointment(appointmentId);
  };

  // Handle bill item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...billItems];
    updatedItems[index][field] = value;
    setBillItems(updatedItems);
  };

  // Add new bill item
  const addBillItem = () => {
    setBillItems([...billItems, { name: '', price: '' }]);
  };

  // Remove bill item
  const removeBillItem = (index) => {
    if (billItems.length > 1) {
      const updatedItems = billItems.filter((_, i) => i !== index);
      setBillItems(updatedItems);
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return billItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedAppointment) {
      toast.error('Please select an appointment');
      return;
    }

    const validItems = billItems.filter(item => item.name.trim() && item.price.trim());
    if (validItems.length === 0) {
      toast.error('Please add at least one bill item');
      return;
    }

    setSubmitting(true);
    
    try {
      const selectedAppointmentData = appointments.find(apt => apt._id === selectedAppointment);
      const billData = {
        patientId: selectedAppointmentData.patient._id || selectedAppointment, // Use appointment ID as fallback for dummy patients
        appointmentId: selectedAppointment,
        items: validItems.map(item => ({
          name: item.name.trim(),
          price: parseFloat(item.price)
        }))
      };

      await doctorDashboardAPI.createBill(billData);
      
      toast.success('Bill created successfully!');
      
      // Reset form
      setSelectedAppointment('');
      setBillItems([{ name: '', price: '' }]);
      
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error(error.message || 'Failed to create bill');
    } finally {
      setSubmitting(false);
    }
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Create Bill</h1>
        
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Appointment Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Appointment *
              </label>
              <select
                value={selectedAppointment}
                onChange={handleAppointmentChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose an appointment...</option>
                {appointments.map((appointment) => (
                  <option key={appointment._id} value={appointment._id}>
                    {appointment.patient?.name || appointment.patient?.firstName} - 
                    {new Date(appointment.date).toLocaleDateString()} - 
                    {appointment.timeslot}
                  </option>
                ))}
              </select>
            </div>

            {/* Bill Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Items *
              </label>
              {billItems.map((item, index) => (
                <div key={index} className="space-y-2 mb-3 sm:mb-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Service name"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      className="w-full sm:w-32 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {billItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBillItem(index)}
                      className="w-full sm:w-auto px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addBillItem}
                className="mt-2 w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                Add Item
              </button>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">
                  Ksh {calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {submitting ? 'Creating Bill...' : 'Create Bill'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBill;
