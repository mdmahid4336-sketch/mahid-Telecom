
import React from 'react';
import { ArrowLeft, User, Phone, ShieldCheck, Mail, KeyRound, Lock, Smartphone, Shield, LogOut, ChevronRight, Edit2, History, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileProps {
  user: UserType;
  onBack: () => void;
  onLogout: () => void;
  onNavigate: (view: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack, onLogout, onNavigate }) => {
  const menuItems = [
    { icon: <Edit2 size={20} className="text-blue-600" />, label: 'Edit Profile', view: 'edit-profile' },
    { icon: <History size={20} className="text-indigo-600" />, label: 'Transaction History', view: 'history' },
    { icon: <KeyRound size={20} className="text-orange-600" />, label: 'Change PIN', view: 'change-pin' },
    { icon: <Lock size={20} className="text-red-600" />, label: 'Change Password', view: 'change-password' },
    { icon: <Smartphone size={20} className="text-emerald-600" />, label: 'My Devices', view: 'my-device' },
    { icon: <Shield size={20} className="text-purple-600" />, label: 'Privacy Policy', view: 'privacy-policy' },
  ];

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-700 text-white p-6 pb-20 rounded-b-[3rem] shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold">My Profile</h2>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-3 shadow-xl border-4 border-white/20 overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User size={48} className="text-blue-600" />
            )}
          </div>
          <h3 className="text-2xl font-black">{user.name}</h3>
          <p className="text-blue-100 opacity-80 text-sm">{user.phone}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="px-6 -mt-10 mb-6 space-y-4">
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-50 grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-2xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Balance</p>
            <p className="text-lg font-black text-blue-700">৳{user.balance.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-2xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Type</p>
            <p className="text-lg font-black text-indigo-700">{user.accountType || 'Personal'}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(item.view)}
              className={`w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl">
                  {item.icon}
                </div>
                <span className="font-bold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* Status indicator */}
        <div className="bg-green-50 border border-green-100 p-4 rounded-3xl flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-green-800">Account Verified</p>
            <p className="text-[10px] text-green-600 font-medium">Safe & Secure Transactions</p>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="w-full py-5 bg-red-50 text-red-600 rounded-[2rem] font-bold shadow-sm hover:bg-red-100 transition-all flex items-center justify-center gap-3 border border-red-100"
        >
          <LogOut size={22} />
          Logout Account
        </button>
      </div>

      <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-10">
        Mahid Telecom v2.0.1
      </p>
    </div>
  );
};

export default Profile;
