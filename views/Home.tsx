
import React, { useState } from 'react';
import { AppView, User as UserType } from '../types';
import { Smartphone, PlusCircle, CreditCard, Send, Share2, MessageSquare, Download, ChevronRight, Bell, Eye, EyeOff, Zap, Landmark, Building2, UserPlus, History, ShieldCheck, LogOut } from 'lucide-react';
import { APK_DOWNLOAD_URL, WHATSAPP_LINK } from '../constants';

interface HomeViewProps {
  user: UserType;
  setView: (view: AppView) => void;
  handleShare: () => void;
  onLogout: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ user, setView, handleShare, onLogout }) => {
  const [showBalance, setShowBalance] = useState(false);

  const features = [
    { icon: <Smartphone className="text-blue-600" />, label: 'Mobile Recharge', view: 'recharge' as AppView, color: 'bg-blue-50' },
    { icon: <PlusCircle className="text-green-600" />, label: 'Auto Add Money', view: 'add-balance' as AppView, color: 'bg-green-50' },
    { icon: <Zap className="text-orange-600" />, label: 'Drive Packages', view: 'drive-packages' as AppView, color: 'bg-orange-50' },
    { icon: <Landmark className="text-purple-600" />, label: 'M-Banking', view: 'm-banking' as AppView, color: 'bg-purple-50' },
    { icon: <Building2 className="text-indigo-600" />, label: 'B-Banking', view: 'b-banking' as AppView, color: 'bg-indigo-50' },
    { icon: <CreditCard className="text-pink-600" />, label: 'Bill Pay', view: 'bill-pay' as AppView, color: 'bg-pink-50' },
    { icon: <Send className="text-cyan-600" />, label: 'Send Money', view: 'transfer' as AppView, color: 'bg-cyan-50' },
    { icon: <UserPlus className="text-emerald-600" />, label: 'Add Reseller', view: 'add-reseller' as AppView, color: 'bg-emerald-50' },
    { icon: <History className="text-gray-600" />, label: 'History', view: 'history' as AppView, color: 'bg-gray-50' },
  ];

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 p-4 space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <CreditCard size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100/80 text-sm font-medium">Available Balance</p>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-3xl font-bold">
                  {showBalance ? `৳${user.balance.toLocaleString()}` : '৳ ••••••'}
                </h2>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setView('notifications')}
                className="p-2 bg-white/20 rounded-xl backdrop-blur-sm relative"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-blue-700"></span>
              </button>
              <button 
                onClick={onLogout}
                className="p-2 bg-white/20 rounded-xl backdrop-blur-sm text-white hover:bg-white/30 transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <p className="text-xs bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
              User ID: {user.phone}
            </p>
            {user.accountType && (
              <p className="text-xs bg-green-400/30 text-green-100 inline-flex items-center gap-1 px-3 py-1 rounded-full backdrop-blur-sm font-bold border border-green-400/20">
                <ShieldCheck size={10} />
                {user.accountType}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">Our Services</h3>
        <div className="grid grid-cols-3 gap-3">
          {features.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setView(item.view)}
              className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-95"
            >
              <div className={`${item.color} p-3 rounded-xl mb-2`}>
                {React.cloneElement(item.icon as React.ReactElement, { size: 24 })}
              </div>
              <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions / Contact */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 px-1">Quick Links</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button 
            onClick={() => window.open(WHATSAPP_LINK)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-green-600">
                <MessageSquare size={18} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Helpline WhatsApp</p>
                <p className="text-xs text-gray-500">Fast customer support</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
          
          <button 
            onClick={handleShare}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                <Share2 size={18} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Share App</p>
                <p className="text-xs text-gray-500">Invite your friends</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>

          <button 
            onClick={() => window.open(APK_DOWNLOAD_URL)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Download size={18} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Download APK</p>
                <p className="text-xs text-gray-500">Get latest version</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
        </div>
      </div>

      {/* Notice Board */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl flex items-start gap-3">
        <Bell size={18} className="text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-yellow-800">Latest News</h4>
          <p className="text-xs text-yellow-700 leading-relaxed mt-1">
            Welcome to Mahid Telecom! Enjoy 1% cashback on every 1000tk Add Balance via Nagad. Limited time offer!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
