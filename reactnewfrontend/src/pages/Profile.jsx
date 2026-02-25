import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, MapPin, Phone, Edit2, Save, X } from 'lucide-react';
import { authAPI } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
      setFormData({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        date_of_birth: response.data.date_of_birth || '',
        gender: response.data.gender || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await authAPI.getAddresses();
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    
    try {
      console.log('Updating profile with data:', formData);
      const response = await authAPI.updateProfile(formData);
      console.log('Profile update response:', response.data);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail ||
                          (error.response?.data ? JSON.stringify(error.response.data) : null) ||
                          'Failed to update profile';
      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      date_of_birth: user.date_of_birth || '',
      gender: user.gender || ''
    });
    setError('');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b51e0]"></div>
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-500">Manage your account information</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-[#9b51e0] hover:text-purple-700 font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-[#9b51e0] hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#9b51e0] disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#9b51e0] disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#9b51e0] disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#9b51e0] disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#9b51e0] disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-8 text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <User className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-2">
              {user?.first_name} {user?.last_name}
            </h3>
            <p className="text-purple-100 text-center text-sm mb-6">{user?.email}</p>
            
            <div className="space-y-3 bg-white/10 rounded-xl p-4">
              {user?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{user.phone}</span>
                </div>
              )}
              {user?.date_of_birth && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{new Date(user.date_of_birth).toLocaleDateString()}</span>
                </div>
              )}
              {addresses.length > 0 && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{addresses.length} Saved Address{addresses.length > 1 ? 'es' : ''}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href="/orders"
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
              >
                My Orders
              </a>
              <a
                href="/checkout"
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
              >
                Manage Addresses
              </a>
              <button
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
