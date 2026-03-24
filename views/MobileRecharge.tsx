
import React, { useState } from 'react';
import { ArrowLeft, Smartphone, CheckCircle2 } from 'lucide-react';
import { OPERATORS } from '../constants';

import { AppView, Transaction } from '../types';

interface MobileRechargeProps {
  onBack: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const MobileRecharge: React.FC<MobileRechargeProps> = ({ onBack, onAddTransaction, showToast }) => {
  const [step, setStep] = useState(1);
  const [number, setNumber] = useState('');
  const [operator, setOperator] = useState(OPERATORS[0]);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [rechargeType, setRechargeType] = useState<'Prepaid' | 'Postpaid'>('Prepaid');
  const [success, setSuccess] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (number.length === 11 && Number(amount) >= 10) {
      setStep(2);
    } else {
      showToast("Please enter a valid 11-digit number and amount (Min 10tk)", 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) {
      onAddTransaction({
        type: 'Recharge',
        amount: Number(amount),
        description: `${operator} - ${number} (${rechargeType})`
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
        <h2 className="text-2xl font-bold text-gray-800">Recharge Request Sent!</h2>
        <p className="text-gray-500 mt-2">Your recharge of ৳{amount} for {number} is being processed.</p>
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
    <div className="p-4">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={step === 1 ? onBack : () => setStep(1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Mobile Recharge</h2>
      </div>

      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={number}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                      setNumber(val);
                      
                      if (val.length >= 3) {
                        const prefix = val.substring(0, 3);
                        if (prefix === '017' || prefix === '013') setOperator('Grameenphone');
                        else if (prefix === '018') setOperator('Robi');
                        else if (prefix === '019' || prefix === '014') setOperator('Banglalink');
                        else if (prefix === '016') setOperator('Airtel');
                        else if (prefix === '015') setOperator('Teletalk');
                      }
                    }}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Operator</label>
                <div className="grid grid-cols-3 gap-2">
                  {OPERATORS.map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setOperator(op)}
                      className={`text-xs py-2 rounded-lg border font-medium ${operator === op ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRechargeType('Prepaid')}
                  className={`flex-1 py-3 rounded-xl border font-bold ${rechargeType === 'Prepaid' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-100 text-gray-400'}`}
                >
                  Prepaid
                </button>
                <button
                  type="button"
                  onClick={() => setRechargeType('Postpaid')}
                  className={`flex-1 py-3 rounded-xl border font-bold ${rechargeType === 'Postpaid' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-100 text-gray-400'}`}
                >
                  Postpaid
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (৳)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 50"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                  required
                  min="10"
                />
                <div className="flex gap-2 mt-3">
                  {[20, 50, 100, 200, 500].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className="flex-1 text-xs py-1.5 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
                    >
                      ৳{val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Next
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="mb-6 pb-6 border-b border-gray-50">
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Recharge Details</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-gray-800">{number}</p>
                  <p className="text-sm text-gray-500">{operator} • {rechargeType}</p>
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
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Confirm Recharge
          </button>
        </form>
      )}
    </div>
  );
};

export default MobileRecharge;
