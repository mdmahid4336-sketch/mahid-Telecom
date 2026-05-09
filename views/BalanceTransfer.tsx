
import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, Search } from 'lucide-react';

import { Transaction, User as UserType } from '../types';

interface BalanceTransferProps {
  user: UserType;
  onBack: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const BalanceTransfer: React.FC<BalanceTransferProps> = ({ user, onBack, onAddTransaction, showToast }) => {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [success, setSuccess] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipient.length === 11 && Number(amount) > 0) {
      setStep(2);
    } else {
      showToast("Please enter valid recipient number and amount", 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === user.pin) {
      onAddTransaction({
        type: 'Transfer',
        amount: Number(amount),
        description: `To: ${recipient}`
      });
      setSuccess(true);
    } else {
      showToast("Incorrect PIN. Please try again.", 'error');
    }
  };

  if (success) {
    return (
      <div className="p-8 text-center animate-in zoom-in-95">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Transfer Successful!</h2>
        <p className="text-gray-500 mt-2">৳{amount} has been sent to {recipient} successfully.</p>
        <button onClick={onBack} className="mt-8 bg-blue-600 text-white font-bold py-3 px-8 rounded-xl w-full">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={step === 1 ? onBack : () => setStep(1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Transfer Balance</h2>
      </div>

      <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 mb-6">
        <p className="text-xs text-orange-800">
          <span className="font-bold">Note:</span> You can transfer balance to any Mahid Telecom user for free.
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient Phone</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (৳)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 100"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            Next
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="mb-6 pb-6 border-b border-gray-50">
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Transfer Details</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-gray-800">{recipient}</p>
                  <p className="text-sm text-gray-500">Balance Transfer</p>
                </div>
                <p className="text-2xl font-black text-blue-600">৳{amount}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Account PIN</label>
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
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Send size={20} />
            Confirm Transfer
          </button>
        </form>
      )}
    </div>
  );
};

export default BalanceTransfer;
