
import React, { useState } from 'react';
import { ArrowLeft, CreditCard, CheckCircle2 } from 'lucide-react';
import { BILL_TYPES } from '../constants';

import { Transaction, User as UserType } from '../types';

interface BillPayProps {
  user: UserType;
  onBack: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const BillPay: React.FC<BillPayProps> = ({ user, onBack, onAddTransaction, showToast }) => {
  const [step, setStep] = useState(1);
  const [billType, setBillType] = useState(BILL_TYPES[0]);
  const [accNumber, setAccNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [success, setSuccess] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (accNumber.length > 5 && Number(amount) > 0) {
      setStep(2);
    } else {
      showToast("Please fill all fields correctly", 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === user.pin) {
      onAddTransaction({
        type: 'Bill Pay',
        amount: Number(amount),
        description: `${billType} - Acc: ${accNumber}`
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
        <h2 className="text-2xl font-bold">Bill Paid!</h2>
        <p className="text-gray-500 mt-2">Your payment for {billType} is successful.</p>
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
        <h2 className="text-xl font-bold">Bill Pay</h2>
      </div>

      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Bill Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {BILL_TYPES.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBillType(type)}
                      className={`py-3 rounded-xl border font-semibold text-sm transition-all ${billType === type ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account/Consumer Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={accNumber}
                    onChange={(e) => setAccNumber(e.target.value)}
                    placeholder="Enter Account ID"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bill Amount (৳)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all"
          >
            Next
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="mb-6 pb-6 border-b border-gray-50">
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Bill Details</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-gray-800">{accNumber}</p>
                  <p className="text-sm text-gray-500">{billType}</p>
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
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all"
          >
            Confirm Payment
          </button>
        </form>
      )}
    </div>
  );
};

export default BillPay;
