
import React, { useState } from 'react';
import { ArrowLeft, Smartphone, Landmark, ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

import { Transaction, User as UserType } from '../types';

interface MBankingProps {
  user: UserType;
  onBack: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const MBanking: React.FC<MBankingProps> = ({ user, onBack, onAddTransaction, showToast }) => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('');
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [type, setType] = useState('Cash Out');
  const [success, setSuccess] = useState(false);

  const methods = [
    { name: 'Bkash', color: 'bg-pink-500', logo: 'B' },
    { name: 'Nagad', color: 'bg-orange-500', logo: 'N' },
    { name: 'Rocket', color: 'bg-purple-600', logo: 'R' },
    { name: 'Upay', color: 'bg-yellow-500', logo: 'U' },
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (method && number.length === 11 && Number(amount) > 0) {
      setStep(2);
    } else {
      showToast("Please select a method and enter valid number and amount", 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === user.pin) {
      onAddTransaction({
        type: 'M-Banking',
        amount: Number(amount),
        description: `${method} ${type} to ${number}`
      });
      setSuccess(true);
    } else {
      showToast("Incorrect PIN. Please try again.", 'error');
    }
  };

  if (success) {
    return (
      <div className="p-8 text-center animate-in zoom-in-95 duration-300">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Transaction Successful!</h2>
        <p className="text-gray-500 mt-2">Your {method} {type} of ৳{amount} to {number} is being processed.</p>
        <button
          onClick={onBack}
          className="mt-8 bg-blue-600 text-white font-bold py-3 px-8 rounded-xl w-full"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 min-h-screen bg-gray-50 pb-10">
      <div className="bg-blue-700 text-white p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={step === 1 ? onBack : () => setStep(1)} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">M-Banking Services</h2>
      </div>

      <div className="p-4 space-y-6">
        {step === 1 ? (
          <>
            {/* Method Selection */}
            <div className="grid grid-cols-4 gap-3">
              {methods.map(m => (
                <button
                  key={m.name}
                  onClick={() => setMethod(m.name)}
                  className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                    method === m.name ? 'bg-white shadow-md ring-2 ring-blue-500' : 'bg-white/50 border border-gray-100'
                  }`}
                >
                  <div className={`${m.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mb-1`}>
                    {m.logo}
                  </div>
                  <span className="text-[10px] font-bold text-gray-700">{m.name}</span>
                </button>
              ))}
            </div>

            {method && (
              <form onSubmit={handleNext} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setType('Cash Out')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'Cash Out' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
                  >
                    Cash Out
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('Send Money')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'Send Money' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
                  >
                    Send Money
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Recipient Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={number}
                      onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Amount (৳)</label>
                  <div className="relative">
                    <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                      required
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
                  <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-blue-700 leading-relaxed">
                    Processing time: 5-30 minutes. Please ensure the number and amount are correct before submitting.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  Next
                </button>
              </form>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="mb-6 pb-6 border-b border-gray-50">
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Transaction Details</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-gray-800">{number}</p>
                  <p className="text-sm text-gray-500">{method} • {type}</p>
                </div>
                <p className="text-2xl font-black text-blue-600">৳{amount}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Account PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 4-6 digit PIN"
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-2xl tracking-[1em] font-bold"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <ShieldCheck size={20} />
              Confirm Transaction
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MBanking;
