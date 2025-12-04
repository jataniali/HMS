import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';
import uploadAPI from '../../api/upload';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    gender: 'male',
    profileimage: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await adminAPI.getAllDoctors();
        setDoctors(response.doctors || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!imageFile) return;
    
    setUploadingImage(true);
    try {
      const result = await uploadAPI.uploadFile(imageFile);
      setFormData({
        ...formData,
        profileimage: result.url
      });
      toast.success('Image uploaded successfully!');
      setImageFile(null); // Clear the file after successful upload
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({
      ...formData,
      profileimage: ''
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      email: '',
      phone: '',
      gender: '',
      profileimage: ''
    });
    setImageFile(null);
    setImagePreview('');
    setEditingDoctor(null);
    setShowForm(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingDoctor) {
        // Update existing doctor
        await adminAPI.updateDoctor(editingDoctor._id, formData);
        toast.success('Doctor updated successfully!');
      } else {
        // Create new doctor
        await adminAPI.createDoctor(formData);
        toast.success('Doctor created successfully!');
      }

      // Refresh doctors list
      const response = await adminAPI.getAllDoctors();
      setDoctors(response.doctors || []);
      
      resetForm();
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast.error(error.message || 'Failed to save doctor');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      gender: doctor.gender || '',
      profileimage: doctor.profileimage || ''
    });
    setImagePreview(doctor.profileimage || '');
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await adminAPI.deleteDoctor(doctorId);
        toast.success('Doctor deleted successfully!');
        
        // Refresh doctors list
        const response = await adminAPI.getAllDoctors();
        setDoctors(response.doctors || []);
      } catch (error) {
        console.error('Error deleting doctor:', error);
        toast.error(error.message || 'Failed to delete doctor');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Doctor Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Add New Doctor
          </button>
        </div>

        {/* Add/Edit Doctor Form */}
        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
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
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  
                  {/* Image Preview */}
                  {(imagePreview || formData.profileimage) && (
                    <div className="mb-4">
                      <img 
                        src={imagePreview || formData.profileimage} 
                        alt="Profile preview" 
                        className="h-32 w-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  
                  {/* Upload Controls */}
                  <div className="flex items-center space-x-3">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                      >
                        Choose Image
                      </label>
                    </div>
                    
                    {imageFile && (
                      <>
                        <button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={uploadingImage}
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                        >
                          {uploadingImage ? 'Uploading...' : 'Upload'}
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Hidden input to store the URL */}
                  <input
                    type="hidden"
                    name="profileimage"
                    value={formData.profileimage}
                  />
                  
                  <p className="mt-2 text-xs text-gray-500">
                    Upload a profile image (max 5MB, JPG/PNG)
                  </p>
                </div>
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
                  {submitting ? 'Saving...' : (editingDoctor ? 'Update Doctor' : 'Create Doctor')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Doctors Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {doctors.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specialization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {doctors.map((doctor) => (
                      <tr key={doctor._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {doctor.profileimage && (
                              <img
                                className="h-10 w-10 rounded-full mr-3"
                                src={doctor.profileimage}
                                alt={doctor.name}
                              />
                            )}
                            <div className="text-sm font-medium text-gray-900">
                              {doctor.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.specialization}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.phone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.gender ? doctor.gender.charAt(0).toUpperCase() + doctor.gender.slice(1) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(doctor)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(doctor._id)}
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
                {doctors.map((doctor) => (
                  <div key={doctor._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {doctor.profileimage && (
                          <img
                            className="h-12 w-12 rounded-full mr-3"
                            src={doctor.profileimage}
                            alt={doctor.name}
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                          <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-900 text-right flex-1 ml-2 break-all">{doctor.email}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phone:</span>
                        <span className="text-gray-900">{doctor.phone || '-'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Gender:</span>
                        <span className="text-gray-900">{doctor.gender ? doctor.gender.charAt(0).toUpperCase() + doctor.gender.slice(1) : '-'}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doctor._id)}
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
              <p className="text-gray-500">No doctors found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorManagement;
