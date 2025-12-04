import React, { useState, useEffect } from 'react';
import { FiEdit, FiCalendar, FiDollarSign, FiUser, FiMail, FiPhone, FiUserCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { billsAPI } from '../../api/bills';
import { appointmentAPI } from '../../api/appointment';
import { toast } from 'react-toastify';

const Profile = ({ user }) => {
  const [profile, setProfile] = useState({
    name: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || 'Male',
    profilePic: user?.profilePic || 'https://via.placeholder.com/150',
    appointments: 0,
    billsDue: 0
  });
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });

  // Fetch real stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user?._id) return;

        // Fetch appointments count
        const appointmentsResponse = await appointmentAPI.getAppointments();
        const userAppointments = appointmentsResponse.appointments?.filter(apt => 
          apt.patient === user._id && apt.status !== 'completed'
        ) || [];

        // Fetch bills count
        const billsResponse = await billsAPI.getBills();
        const userBills = billsResponse.bills?.filter(bill => 
          bill.patient === user._id && bill.status === 'pending'
        ) || [];

        setProfile(prev => ({
          ...prev,
          appointments: userAppointments.length,
          billsDue: userBills.length
        }));
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load profile stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // Update profile when user prop changes
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'Male',
        profilePic: user.profilePic || 'https://via.placeholder.com/150'
      }));
      setFormData(prev => ({
        ...prev,
        name: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'Male'
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Add API call to update user profile
      // await userAPI.updateProfile(user._id, formData);
      setProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4 lg:px-8">
 <div className="max-w-4xl mx-auto">
<div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
<div className="bg-linear-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-white">
<div className="flex flex-col sm:flex-row items-center">
<div className="shrink-0 mb-4 sm:mb-0 sm:mr-6">
<img 
className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white" 
src={profile.profilePic} 
alt={profile.name} 
/>
 </div>
<div className="text-center sm:text-left flex-1">
<h1 className="text-xl sm:text-2xl font-bold">{profile.name}</h1>
<p className="text-blue-100 text-sm sm:text-base">{profile.email}</p>
</div>
<button 
onClick={() => setIsEditing(!isEditing)}
className="ml-0 sm:ml-auto mt-4 sm:mt-0 bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-md
 font-medium flex items-center hover:bg-blue-50 transition-colors text-sm sm:text-base"
>
<FiEdit className="mr-2" />
{isEditing ? 'Cancel' : 'Edit Profile'}
</button>
</div>
</div>

          {/* Main Content */}
 <div className="p-4 sm:p-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600 mr-3 sm:mr-4">
                    <FiCalendar size={20} sm:size={24} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Upcoming Appointments</p>
                    <p className="text-xl sm:text-2xl font-bold">{profile.appointments}</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-100">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 rounded-full bg-yellow-100 text-yellow-600 mr-3 sm:mr-4">
                    <FiDollarSign size={20} sm:size={24} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Bills Due</p>
                    <p className="text-xl sm:text-2xl font-bold">{profile.billsDue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form/Info */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">Personal Information</h2>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <FiUser className="text-gray-400 mt-1 mr-3 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{profile.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiMail className="text-gray-400 mt-1 mr-3 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiPhone className="text-gray-400 mt-1 mr-3 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{profile.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiUserCheck className="text-gray-400 mt-1 mr-3 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{profile.gender}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/my-appointments"
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <FiCalendar size={20} />
                  </div>
                  <span className="font-medium">My Appointments</span>
                </div>
                <span className="text-blue-600">→</span>
              </Link>
              <Link
                to="/patient/bills"
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 mr-4">
                    <FiDollarSign size={20} />
                  </div>
                  <span className="font-medium">My Bills</span>
                </div>
                <span className="text-blue-600">→</span>
              </Link>
            </div>
</div>
 </div>
</div>
</div>
  );
};

export default Profile;
