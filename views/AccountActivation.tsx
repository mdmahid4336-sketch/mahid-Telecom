
import React from 'react';
import { ShieldAlert, CreditCard, Smartphone, Wallet, Building2 } from 'lucide-react';
import { APP_NAME, ACCOUNT_TYPES } from '../constants';

interface AccountActivationProps {
  user: {
    name: string;
    phone: string;
    accountType?: string;
  };
  onActivate: (fee: number) => void;
  onLogout: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const AccountActivation: React.FC<AccountActivationProps> = ({ user, onActivate, onLogout, showToast }) => {
  const selectedType = ACCOUNT_TYPES.find(t => t.name === user.accountType) || ACCOUNT_TYPES[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-red-600 p-5 flex items-center shadow-lg rounded-b-[2rem]">
        <ShieldAlert className="text-white mr-3" size={24} />
        <h1 className="text-white text-xl font-bold">Account Status</h1>
      </div>

      <div className="flex-1 flex flex-col items-center pt-12 px-6">
        {/* Warning Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <ShieldAlert size={40} className="text-red-600" />
        </div>

        {/* Title */}
        <h2 className="text-gray-800 text-2xl font-black mb-2">Account Not Active</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Dear <span className="font-bold text-gray-700">{user.name}</span>, your account is currently inactive. Please pay the registration fee to activate your <span className="font-bold text-red-600">{user.accountType}</span> account.
        </p>

        {/* Payment Box */}
        <div className="w-full max-w-sm bg-white border-2 border-dashed border-red-200 rounded-3xl py-8 px-6 mb-10 flex flex-col items-center shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Activation Fee</span>
          <p className="text-red-600 text-4xl font-black">
            ৳{selectedType.fee}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onActivate(selectedType.fee)}
          className="w-full max-w-xs bg-red-600 text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <CreditCard size={22} />
          Pay Now to Activate
        </button>

        {/* Logout Option */}
        <button
          onClick={onLogout}
          className="mt-10 flex items-center gap-2 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
        >
          <Smartphone size={16} />
          Login with different account
        </button>
      </div>
    </div>
  );
};

export default AccountActivation;
