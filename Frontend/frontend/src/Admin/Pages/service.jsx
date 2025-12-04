import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'other'
  });

  // Fetch all services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await adminAPI.getAllServices();
        setServices(response.services || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'other'
    });
    setEditingService(null);
    setShowForm(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingService) {
        // Update existing service
        await adminAPI.updateService(editingService._id, serviceData);
        toast.success('Service updated successfully!');
      } else {
        // Create new service
        await adminAPI.createService(serviceData);
        toast.success('Service created successfully!');
      }

      // Refresh services list
      const response = await adminAPI.getAllServices();
      setServices(response.services || []);
      
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error(error.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || '',
      price: service.price || '',
      description: service.description || '',
      category: service.category || 'other'
    });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await adminAPI.deleteService(serviceId);
        toast.success('Service deleted successfully!');
        
        // Refresh services list
        const response = await adminAPI.getAllServices();
        setServices(response.services || []);
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error(error.message || 'Failed to delete service');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Service Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Add New Service
          </button>
        </div>

        {/* Add/Edit Service Form */}
        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., General Consultation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (Ksh) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="procedure">Procedure</option>
                    <option value="test">Test</option>
                    <option value="treatment">Treatment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the service in detail..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (editingService ? 'Update Service' : 'Create Service')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {services.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {service.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-semibold">
                            Ksh {service.price.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {service.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(service)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(service._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden p-4 space-y-4">
                {services.map((service) => (
                  <div key={service._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <div className="mt-1">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <p className="font-bold text-lg text-gray-900">Ksh {service.price.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No services found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
