import React, { useState } from 'react';
import { APP_NAME, APP_LOGO, ACCOUNT_TYPES } from '../constants';
import { User as UserType } from '../types';
import { Smartphone, ArrowLeft, User, Users, Phone, Mail, CreditCard, Calendar, Lock, MapPin, ShieldCheck, List as ListIcon, Key, Edit3, Send, Building2, Loader2, Eye, EyeOff, ChevronRight } from 'lucide-react';

interface SignUpProps {
  onSignUp: (userData: Partial<UserType>) => Promise<void>;
  onGoToLogin: () => void;
  onGoToPrivacy: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onGoToLogin, onGoToPrivacy, showToast }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nid, setNid] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [gender, setGender] = useState('');
  const [accountType, setAccountType] = useState('Sub-Admin');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const divisions = [
    'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'
  ];

  const districtsByDivision: { [key: string]: string[] } = {
    'ঢাকা': ['ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'টাঙ্গাইল', 'ফরিদপুর', 'মানিকগঞ্জ', 'মুন্সীগঞ্জ', 'নরসিংদী', 'রাজবাড়ী', 'শরীয়তপুর', 'মাদারীপুর', 'গোপালগঞ্জ', 'কিশোরগঞ্জ'],
    'চট্টগ্রাম': ['চট্টগ্রাম', 'কক্সবাজার', 'কুমিল্লা', 'ফেনী', 'ব্রাহ্মণবাড়িয়া', 'নোয়াখালী', 'লক্ষ্মীপুর', 'চাঁদপুর', 'বান্দরবান', 'খাগড়াছড়ি', 'রাঙ্গামাটি'],
    'রাজশাহী': ['রাজশাহী', 'বগুড়া', 'পাবনা', 'নওগাঁ', 'জয়পুরহাট', 'চাঁপাইনবাবগঞ্জ', 'নাটোর', 'সিরাজগঞ্জ'],
    'খুলনা': ['খুলনা', 'যশোর', 'সাতক্ষীরা', 'বাগেরহাট', 'কুষ্টিয়া', 'মেহেরপুর', 'চুয়াডাঙ্গা', 'ঝিনাইদহ', 'মাগুরা', 'নড়াইল'],
    'বরিশাল': ['বরিশাল', 'পটুয়াখালী', 'ভোলা', 'পিরোজপুর', 'বরগুনা', 'ঝালকাঠি'],
    'সিলেট': ['সিলেট', 'মৌলভীবাজার', 'হবিগঞ্জ', 'সুনামগঞ্জ'],
    'রংপুর': ['রংপুর', 'দিনাজপুর', 'কুড়িগ্রাম', 'গাইবান্ধা', 'নীলফামারী', 'পঞ্চগড়', 'ঠাকুরগাঁও', 'লালমনিরহাট'],
    'ময়মনসিংহ': ['ময়মনসিংহ', 'জামালপুর', 'নেত্রকোনা', 'শেরপুর']
  };
  
  const upazilasByDistrict: { [key: string]: string[] } = {
    'সিলেট': ['সিলেট সদর', 'দক্ষিণ সুরমা', 'বিশ্বনাথ', 'ওসমানীনগর', 'বালাগঞ্জ', 'ফেঞ্চুগঞ্জ', 'গোলাপগঞ্জ', 'বিয়ানীবাজার', 'জকিগঞ্জ', 'কানাইঘাট', 'জৈন্তাপুর', 'গোয়াইনঘাট', 'কোম্পানীগঞ্জ'],
    'মৌলভীবাজার': ['মৌলভীবাজার সদর', 'শ্রীমঙ্গল', 'রাজনগর', 'কুলাউড়া', 'বড়লেখা', 'কমলগঞ্জ', 'জুড়ী'],
    'হবিগঞ্জ': ['হবিগঞ্জ সদর', 'শায়েস্তাগঞ্জ', 'লাখাই', 'বানিয়াচং', 'আজমিরীগঞ্জ', 'বাহুবল', 'নবীগঞ্জ', 'চুনারুঘাট', 'মাধবপুর'],
    'সুনামগঞ্জ': ['সুনামগঞ্জ সদর', 'দক্ষিণ সুনামগঞ্জ', 'বিশ্বম্ভরপুর', 'ছাতক', 'দোয়ারাবাজার', 'তাহিরপুর', 'জামালগঞ্জ', 'ধর্মপাশা', 'শাল্লা', 'দিরাই', 'জগন্নাথপুর'],
    'নোয়াখালী': ['নোয়াখালী সদর', 'কোম্পানীগঞ্জ', 'বেগমগঞ্জ', 'হাতিয়া', 'সুবর্ণচর', 'কবিরহাট', 'সেনবাগ', 'চাটখিল', 'সোনাইমুড়ী'],
    'ঢাকা': ['ঢাকা সদর', 'ধামরাই', 'দোহার', 'কেরানীগঞ্জ', 'নবাবগঞ্জ', 'সাভার', 'আশুলিয়া'],
    'গাজীপুর': ['গাজীপুর সদর', 'কালিয়াকৈর', 'কালীগঞ্জ', 'কাপাসিয়া', 'শ্রীপুর', 'টঙ্গী'],
    'নারায়ণগঞ্জ': ['নারায়ণগঞ্জ সদর', 'আড়াইহাজার', 'বন্দর', 'রূপগঞ্জ', 'সোনারগাঁও', 'সিদ্ধিরগঞ্জ'],
    'টাঙ্গাইল': ['টাঙ্গাইল সদর', 'বাসাইল', 'ভূয়াপুর', 'দেলদুয়ার', 'ঘাটাইল', 'গোপালপুর', 'কালিহাতী', 'মধুপুর', 'মির্জাপুর', 'নাগরপুর', 'সখিপুর', 'ধনবাড়ী'],
    'ফরিদপুর': ['ফরিদপুর সদর', 'আলফাডাঙ্গা', 'ভাঙ্গা', 'বোয়ালমারী', 'চরভদ্রাসন', 'মধুখালী', 'নগরকান্দা', 'সদরপুর', 'সালথা'],
    'চট্টগ্রাম': ['চট্টগ্রাম সদর', 'আনোয়ারা', 'বাঁশখালী', 'বোয়ালখালী', 'চন্দনাইশ', 'ফটিকছড়ি', 'হাটহাজারী', 'লোহাগাড়া', 'মীরসরাই', 'পটিয়া', 'রাঙ্গুনিয়া', 'রাউজান', 'সন্দ্বীপ', 'সাতকানিয়া', 'সীতাকুণ্ড'],
    'কুমিল্লা': ['কুমিল্লা সদর', 'কুমিল্লা সদর দক্ষিণ', 'বরুড়া', 'ব্রাহ্মণপাড়া', 'বুড়িচং', 'চান্দিনা', 'চৌদ্দগ্রাম', 'দাউদকান্দি', 'দেবিদ্বার', 'হোমনা', 'লাকসাম', 'মনোহরগঞ্জ', 'মেঘনা', 'মুরাদনগর']
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone.length !== 11) {
      showToast("Please enter a valid 11-digit phone number.", 'error');
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters.", 'error');
      return;
    }

    if (pin.length !== 6) {
      showToast("PIN must be exactly 6 digits.", 'error');
      return;
    }

    if (pin !== confirmPin) {
      showToast("PIN codes do not match.", 'error');
      return;
    }

    setIsLoading(true);
    try {
      await onSignUp({
        name,
        phone,
        email,
        nid,
        dob,
        password,
        pin,
        division,
        district,
        upazila,
        gender,
        accountType,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("SignUp error in view:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-700">
      <div className="pt-10 pb-6 px-6 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg overflow-hidden border-4 border-white/20">
          <img src={APP_LOGO} alt={APP_NAME} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-wider uppercase">{APP_NAME}</h1>
        <p className="text-blue-100/60 text-xs font-bold uppercase tracking-widest mt-1">Create Account</p>
      </div>
      
      <div className="flex-1 bg-white rounded-t-[3rem] px-6 py-8 pb-10 shadow-inner relative overflow-y-auto">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm rounded-t-[3rem] flex flex-col items-center justify-center">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-xl animate-bounce mb-4">
              <Loader2 className="text-white animate-spin" size={40} />
            </div>
            <p className="text-blue-700 font-bold text-lg animate-pulse">Processing Registration...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Name */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
              required
            />
          </div>

          {/* 2. Mobile Number */}
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="Mobile Number"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
              required
            />
          </div>

          {/* 3. Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
              required
            />
          </div>

          {/* 4. NID */}
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <input
              type="text"
              value={nid}
              onChange={(e) => setNid(e.target.value.replace(/\D/g, ''))}
              placeholder="NID Number"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
              required
            />
          </div>

          {/* 5. Date of Birth */}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <input
              type="text"
              value={dob}
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              onChange={(e) => setDob(e.target.value)}
              placeholder="Date of Birth"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
              required
            />
          </div>

          {/* 6. Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose Password"
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
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

          {/* 7. Pin */}
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Setup 6-digit PIN"
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
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

          {/* 11. Confirm Pin */}
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <input
              type={showConfirmPin ? "text" : "password"}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Confirm 6-digit PIN"
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPin(!showConfirmPin)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {showConfirmPin ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* 8. Select Division */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <select
              value={division}
              onChange={(e) => {
                setDivision(e.target.value);
                setDistrict('');
                setUpazila('');
              }}
              className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium appearance-none"
              required
            >
              <option value="">Select Division</option>
              {divisions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            </div>
          </div>

          {/* 8.1 Select District */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setUpazila('');
              }}
              className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium appearance-none disabled:bg-gray-50 disabled:text-gray-400"
              required
              disabled={!division}
            >
              <option value="">Select District</option>
              {division && districtsByDivision[division]?.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            </div>
          </div>

          {/* 8.2 Select Upazila */}
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <select
              value={upazila}
              onChange={(e) => setUpazila(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium appearance-none disabled:bg-gray-50 disabled:text-gray-400"
              required
              disabled={!district}
            >
              <option value="">Select Upazila</option>
              {district && (upazilasByDistrict[district] || [`${district} সদর`]).map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            </div>
          </div>

          {/* 9. Account Type Selection */}
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium appearance-none"
              required
            >
              {ACCOUNT_TYPES.map(t => (
                <option key={t.name} value={t.name}>{t.name} (Fee: ৳{t.fee})</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            </div>
          </div>

          {/* 10. Gender Selection */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium appearance-none"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-lg"
            >
              Confirm Registration
            </button>
          </div>
        </form>
        
        <p className="mt-8 text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <button onClick={onGoToLogin} className="text-blue-700 font-bold hover:underline">
            Login Now
          </button>
        </p>
        <div className="mt-6 flex justify-center border-t border-gray-100 pt-6">
          <button onClick={onGoToPrivacy} className="text-gray-400 text-xs hover:underline flex items-center gap-1">
            <ShieldCheck size={14} />
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
