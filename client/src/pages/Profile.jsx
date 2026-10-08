import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  KeyRound,
  Home,
  Building,
  Briefcase
} from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import AddressModal from '../components/AddressModal.jsx';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await api.get('/addresses');
      if (res.success) {
        setAddresses(res.addresses || []);
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile({ name, phone });
    setSavingProfile(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      setSavingPassword(true);
      const res = await api.put('/auth/change-password', { currentPassword, newPassword });
      if (res.success) {
        toast.success(res.message || 'Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSetDefaultAddress = async (addrId) => {
    try {
      const res = await api.patch(`/addresses/${addrId}/default`);
      if (res.success) {
        toast.success('Default address updated!');
        loadAddresses();
      }
    } catch (err) {
      toast.error('Failed to set default address');
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm('Are you sure you want to delete this delivery address?')) return;
    try {
      const res = await api.delete(`/addresses/${addrId}`);
      if (res.success) {
        toast.success('Address deleted successfully!');
        loadAddresses();
      }
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const getAddressIcon = (label) => {
    switch (label?.toLowerCase()) {
      case 'work': return <Briefcase className="w-4 h-4 text-slate-700" />;
      case 'other': return <Building className="w-4 h-4 text-slate-700" />;
      default: return <Home className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Account & Delivery Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal details, delivery addresses, and login security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile Info & Password */}
        <div className="lg:col-span-5 space-y-6">
          {/* Personal Info Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-base flex items-center justify-center">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{user?.name}</h3>
                <span className="text-[11px] text-emerald-700 font-semibold uppercase bg-emerald-50 px-2 py-0.5 rounded-md">
                  {user?.role} Account
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs pl-8 focus:outline-none focus:border-emerald-500"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Read-only)</label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs pl-8 text-slate-500 cursor-not-allowed"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs pl-8 focus:outline-none focus:border-emerald-500"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
              >
                {savingProfile ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-600" /> Change Password
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition disabled:opacity-50"
              >
                {savingPassword ? 'Updating...' : 'Save New Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Saved Delivery Addresses */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" /> Saved Delivery Addresses
              </h3>
              <p className="text-xs text-slate-400">Addresses used for 2-hour home deliveries</p>
            </div>

            <button
              onClick={() => {
                setEditingAddress(null);
                setIsAddressModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Address
            </button>
          </div>

          {loadingAddresses ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading saved addresses...</div>
          ) : addresses.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
              <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-bold">No delivery addresses saved yet</p>
              <p className="text-xs text-slate-400 mt-1">Add your home or office address for fast checkout.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-4 rounded-2xl border transition ${
                    addr.is_default
                      ? 'border-emerald-500 bg-emerald-50/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md font-bold text-slate-800">
                          {getAddressIcon(addr.label)}
                          {addr.label}
                        </span>
                        {addr.is_default === 1 && (
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="font-bold text-slate-900 text-sm">{addr.line1}</p>
                      {addr.line2 && <p className="text-slate-500">{addr.line2}</p>}
                      <p className="text-slate-600">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                      {addr.is_default !== 1 && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded-lg transition mr-1"
                        >
                          Make Default
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingAddress(addr);
                          setIsAddressModalOpen(true);
                        }}
                        className="p-1.5 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        title="Edit address"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        initialAddress={editingAddress}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        onSuccess={() => {
          loadAddresses();
        }}
      />
    </div>
  );
}
