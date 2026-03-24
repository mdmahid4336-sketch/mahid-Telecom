
import React, { useState } from 'react';
import { APP_NAME, APP_LOGO } from '../constants';
import { ShieldCheck, Smartphone, Loader2, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (phone: string, password: string, pin: string) => Promise<void>;
  onGoToSignUp: () => void;
  onGoToPrivacy: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToSignUp, onGoToPrivacy, showToast }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPhone = phone.trim();
    if (trimmedPhone.length === 11) {
      if (!isAdminMode && pin.length < 4) {
        showToast("Please enter a valid PIN", 'error');
        return;
      }
      setIsLoading(true);
      try {
        await onLogin(trimmedPhone, password, pin);
      } catch (error) {
        console.error("Login error in view:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      showToast("Please enter a valid 11-digit phone number", 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl backdrop-blur-md overflow-hidden">
          <img src={APP_LOGO} alt={APP_NAME} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
        <p className="text-blue-100/70 mt-2">{isAdminMode ? 'Admin Control Panel' : 'Fast. Secure. Reliable.'}</p>
      </div>

      <div className="bg-white text-gray-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="text-blue-600 animate-spin mb-3" size={40} />
            <p className="text-blue-700 font-bold animate-pulse">{isAdminMode ? 'Authenticating Admin...' : 'Logging in...'}</p>
          </div>
        )}
        
        {/* Admin/User Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            onClick={() => setIsAdminMode(false)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${!isAdminMode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
          >
            User Login
          </button>
          <button 
            onClick={() => setIsAdminMode(true)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${isAdminMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400'}`}
          >
            Admin Login
          </button>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
          {isAdminMode ? 'Admin Portal' : 'Login to your account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter PIN"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg mt-2"
          >
            Login
          </button>
        </form>
        
        <div className="mt-6 text-center space-y-4">
          <button onClick={onGoToSignUp} className="text-blue-600 font-semibold text-sm hover:underline">
            Don't have an account? Sign Up
          </button>
          <div className="flex justify-center">
            <button onClick={onGoToPrivacy} className="text-gray-400 text-[10px] hover:underline">
              Privacy Policy
            </button>
          </div>
          <div className="pt-4 flex items-center justify-center gap-2 text-gray-400 text-xs uppercase tracking-widest border-t border-gray-100">
            <ShieldCheck size={14} />
            <span>Secure Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
