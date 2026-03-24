
import React, { useState } from 'react';
import { ArrowLeft, Copy, CheckCircle2, CreditCard } from 'lucide-react';
import { PAYMENT_NUMBERS } from '../constants';
import { PaymentMethod } from '../types';

import { AppView, Transaction } from '../types';

interface AddBalanceProps {
  onBack: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const AddBalance: React.FC<AddBalanceProps> = ({ onBack, onAddTransaction, showToast }) => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [txId, setTxId] = useState('');
  const [amount, setAmount] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Number copied to clipboard!', 'success');
  };

  const handleNext = () => {
    if (method) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (txId.length > 5 && Number(amount) > 0) {
      onAddTransaction({
        type: 'Add Balance',
        amount: Number(amount),
        description: `${method} - TXID: ${txId}`
      });
      setStep(3);
    } else {
      showToast("Please enter valid amount and Transaction ID", 'error');
    }
  };

  const getNumber = () => {
    if (!method) return '';
    if (method === PaymentMethod.NAGAD) return PAYMENT_NUMBERS.NAGAD;
    if (method === PaymentMethod.ROCKET) return PAYMENT_NUMBERS.ROCKET;
    if (method === PaymentMethod.CELLFIN) return PAYMENT_NUMBERS.CELLFIN;
    return '';
  };

  if (step === 3) {
    return (
      <div className="p-8 text-center animate-in zoom-in-95">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Request Submitted!</h2>
        <p className="text-gray-500 mt-2">We are verifying your payment of ৳{amount}. Balance will be added within 5-15 minutes.</p>
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
        <h2 className="text-xl font-bold">Auto Add Money</h2>
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Select Payment Method</h3>
          <div className="space-y-3">
            {[PaymentMethod.NAGAD, PaymentMethod.ROCKET, PaymentMethod.CELLFIN].map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${method === m ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-white bg-white shadow-sm hover:border-gray-200'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${m === PaymentMethod.NAGAD ? 'bg-orange-100 text-orange-600' : m === PaymentMethod.ROCKET ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                    <CreditCard size={24} />
                  </div>
                  <span className="font-bold text-gray-800">{m}</span>
                </div>
                {method === m && <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>}
              </button>
            ))}
          </div>
          <button
            disabled={!method}
            onClick={handleNext}
            className="w-full bg-blue-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg mt-4"
          >
            Next
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <p className="text-blue-800 text-xs font-bold uppercase mb-4 tracking-widest">Instruction</p>
            <p className="text-sm text-blue-700 leading-relaxed">
              Send money to the {method} number below. Then enter the Transaction ID and Amount below to confirm.
            </p>
            
            <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-2xl border border-blue-200">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">{method} Number</p>
                <p className="text-lg font-bold text-gray-800">{getNumber()}</p>
              </div>
              <button onClick={() => copyToClipboard(getNumber())} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                <Copy size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Paid (৳)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Amount"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction ID</label>
              <input
                type="text"
                value={txId}
                onChange={(e) => setTxId(e.target.value.toUpperCase())}
                placeholder="Ex: 8J6H3G2F"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700"
            >
              Verify Payment
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddBalance;
