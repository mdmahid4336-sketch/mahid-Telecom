
import React, { useState } from 'react';
import { ArrowLeft, Lock, ShieldCheck, Shield } from 'lucide-react';

interface ChangePasswordProps {
  onBack: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onBack, showToast }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("New Password and Confirm Password do not match!", 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters!", 'error');
      return;
    }
    showToast("Password Changed Successfully!", 'success');
    onBack();
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 min-h-screen bg-gray-50 pb-10">
      <div className="bg-blue-700 text-white p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Change Password</h2>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex flex-col items-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-2">
              <Shield size={32} />
            </div>
            <p className="text-sm text-gray-500 text-center">Keep your account secure with a strong password</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-transform mt-4"
          >
            <ShieldCheck size={20} />
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
