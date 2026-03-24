
import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Smartphone, User, Lock, ShieldCheck, Mail } from 'lucide-react';
import { ACCOUNT_TYPES } from '../constants';

interface AddResellerProps {
  onBack: () => void;
  onAddReseller: (name: string, phone: string, level: string) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const AddReseller: React.FC<AddResellerProps> = ({ onBack, onAddReseller, showToast }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState(ACCOUNT_TYPES[4].name); // Default to Retailer

  const levels = ACCOUNT_TYPES.filter(t => t.name !== 'Personal').map(t => t.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReseller(name, phone, level);
    onBack();
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 min-h-screen bg-gray-50 pb-10">
      <div className="bg-blue-700 text-white p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Add New Reseller</h2>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex flex-col items-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-2">
              <UserPlus size={32} />
            </div>
            <p className="text-sm text-gray-500">Create a new account under you</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Account Level</label>
            <div className="grid grid-cols-3 gap-2">
              {levels.map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                    level === l ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            Create Reseller Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReseller;
