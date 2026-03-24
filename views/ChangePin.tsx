
import React, { useState } from 'react';
import { ArrowLeft, Lock, ShieldCheck, KeyRound } from 'lucide-react';

interface ChangePinProps {
  onBack: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const ChangePin: React.FC<ChangePinProps> = ({ onBack, showToast }) => {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      showToast("New PIN and Confirm PIN do not match!", 'error');
      return;
    }
    if (newPin.length < 4) {
      showToast("PIN must be at least 4 digits!", 'error');
      return;
    }
    showToast("PIN Changed Successfully!", 'success');
    onBack();
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 min-h-screen bg-gray-50 pb-10">
      <div className="bg-blue-700 text-white p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Change Transaction PIN</h2>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex flex-col items-center mb-4">
            <div className="bg-orange-100 p-4 rounded-full text-orange-600 mb-2">
              <KeyRound size={32} />
            </div>
            <p className="text-sm text-gray-500 text-center">Your PIN is required for all transactions</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Current PIN</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                maxLength={6}
                placeholder="Enter current PIN"
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">New PIN</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                maxLength={6}
                placeholder="Enter new PIN"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirm New PIN</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                maxLength={6}
                placeholder="Confirm new PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-transform mt-4"
          >
            <ShieldCheck size={20} />
            Update PIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePin;
