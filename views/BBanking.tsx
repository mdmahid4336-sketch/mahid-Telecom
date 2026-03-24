
import React, { useState } from 'react';
import { ArrowLeft, Building2, CreditCard, Landmark, ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

import { Transaction } from '../types';

interface BBankingProps {
  onBack: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const BBanking: React.FC<BBankingProps> = ({ onBack, onAddTransaction, showToast }) => {
  const [step, setStep] = useState(1);
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [type, setType] = useState('Deposit');
  const [success, setSuccess] = useState(false);

  const banks = [
    { name: 'Sonali Bank', color: 'bg-blue-600', logo: 'S' },
    { name: 'Islami Bank', color: 'bg-green-600', logo: 'I' },
    { name: 'Dutch-Bangla', color: 'bg-blue-800', logo: 'D' },
    { name: 'City Bank', color: 'bg-red-600', logo: 'C' },
    { name: 'Trust Bank', color: 'bg-emerald-700', logo: 'T' },
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (bank && account.length > 5 && Number(amount) > 0) {
      setStep(2);
    } else {
      showToast("Please select a bank and enter valid account and amount", 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) {
      onAddTransaction({
        type: 'B-Banking',
        amount: Number(amount),
        description: `${bank} ${type} to ${account}`
      });
      setSuccess(true);
    } else {
      showToast("Please enter a valid PIN", 'error');
    }
  };

  if (success) {
    return (
      <div className="p-8 text-center animate-in zoom-in-95 duration-300">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Transaction Successful!</h2>
        <p className="text-gray-500 mt-2">Your {bank} {type} of ৳{amount} to {account} is being processed.</p>
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
        <h2 className="text-xl font-bold">B-Banking Services</h2>
      </div>

      <div className="p-4 space-y-6">
        {step === 1 ? (
          <>
            {/* Bank Selection */}
            <div className="grid grid-cols-4 gap-3">
              {banks.map(b => (
                <button
                  key={b.name}
                  onClick={() => setBank(b.name)}
                  className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                    bank === b.name ? 'bg-white shadow-md ring-2 ring-blue-500' : 'bg-white/50 border border-gray-100'
                  }`}
                >
                  <div className={`${b.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mb-1`}>
                    {b.logo}
                  </div>
                  <span className="text-[10px] font-bold text-gray-700">{b.name}</span>
                </button>
              ))}
            </div>

            {bank && (
              <form onSubmit={handleNext} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setType('Deposit')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'Deposit' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
                  >
                    Deposit
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('Withdraw')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'Withdraw' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
                  >
                    Withdraw
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Account Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Enter account number"
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
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
                    Processing time: 1-2 business days. Please ensure the account and amount are correct before submitting.
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
                  <p className="text-lg font-bold text-gray-800">{account}</p>
                  <p className="text-sm text-gray-500">{bank} • {type}</p>
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

export default BBanking;
