import React, { useState } from 'react';
import { APP_NAME, APP_LOGO, ACCOUNT_TYPES } from '../constants';
import { User as UserType } from '../types';
import { Smartphone, ArrowLeft, User, Users, Phone, Mail, CreditCard, Calendar, Lock, MapPin, ShieldCheck, List as ListIcon, Key, Edit3, Send, Building2, Loader2, Eye, EyeOff } from 'lucide-react';

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
  const [area, setArea] = useState('');
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
    'কুমিল্লা': ['কুমিল্লা সদর', 'কুমিল্লা সদর দক্ষিণ', 'বরুড়া', 'ব্রাহ্মণপাড়া', 'বুড়িচং', 'চান্দিনা', 'চৌদ্দগ্রাম', 'দাউদকান্দি', 'দেবিদ্বার', 'হোমনা', 'লাকসাম', 'মনোহরগঞ্জ', 'মেঘনা', 'মুরাদনগর', 'নাঙ্গলকোট', 'তিতাস'],
    'রাজশাহী': ['রাজশাহী সদর', 'বাঘা', 'বাগমারা', 'চারঘাট', 'দুর্গাপুর', 'গোদাগাড়ী', 'মোহনপুর', 'পবা', 'পুঠিয়া', 'তানোর'],
    'বগুড়া': ['বগুড়া সদর', 'আদমদীঘি', 'ধুনট', 'দুপচাঁচিয়া', 'গাবতলী', 'কাহালু', 'নন্দীগ্রাম', 'শাজাহানপুর', 'শেরপুর', 'শিবগঞ্জ', 'সোনাতলা'],
    'ফেনী': ['ফেনী সদর', 'দাগনভূঞা', 'ছাগলনাইয়া', 'পরশুরাম', 'ফুলগাজী', 'সোনাগাজী'],
    'লক্ষ্মীপুর': ['লক্ষ্মীপুর সদর', 'রায়পুর', 'রামগঞ্জ', 'রামগতি', 'কমলনগর'],
    'চাঁদপুর': ['চাঁদপুর সদর', 'হাইমচর', 'কচুয়া', 'ফরিদগঞ্জ', 'মতলব উত্তর', 'মতলব দক্ষিণ', 'হাজীগঞ্জ', 'শাহরাস্তি'],
    'ব্রাহ্মণবাড়িয়া': ['ব্রাহ্মণবাড়িয়া সদর', 'কসবা', 'আখাউড়া', 'আশুগঞ্জ', 'নাসিরনগর', 'সরাইল', 'নবীনগর', 'বাঞ্ছারামপুর', 'বিজয়নগর'],
    'কক্সবাজার': ['কক্সবাজার সদর', 'চকোরিয়া', 'মহেশখালী', 'টেকনাফ', 'উখিয়া', 'রামু', 'কুতুবদিয়া', 'পেকুয়া'],
    'যশোর': ['যশোর সদর', 'অভয়নগর', 'কেশবপুর', 'চৌগাছা', 'ঝিকরগাছা', 'বাঘেরপাড়া', 'মণিরামপুর', 'শার্শা'],
    'খুলনা': ['খুলনা সদর', 'কয়রা', 'ডুমুরিয়া', 'তেরখাদা', 'দাকোপ', 'দিঘলিয়া', 'পাইকগাছা', 'ফুলতলা', 'বটিয়াঘাটা'],
    'বরিশাল': ['বরিশাল সদর', 'বাকেরগঞ্জ', 'বাবুগঞ্জ', 'উজিরপুর', 'বানারীপাড়া', 'গৌরনদী', 'আগৈলঝারা', 'মেহেন্দিগঞ্জ', 'মুলাদী', 'হিজলা'],
    'ময়মনসিংহ': ['ময়মনসিংহ সদর', 'মুক্তাগাছা', 'ফুলবাড়ীয়া', 'ত্রিশাল', 'ভালুকা', 'গফরগাঁও', 'নান্দাইল', 'ঈশ্বরগঞ্জ', 'গৌরীপুর', 'ফুলপুর', 'তারাকান্দা', 'হালুয়াঘাট', 'ধোবাউড়া'],
    'রংপুর': ['রংপুর সদর', 'বদরগঞ্জ', 'গঙ্গাচড়া', 'কাউনিয়া', 'মিঠাপুকুর', 'পীরগাছা', 'পীরগঞ্জ', 'তরাগঞ্জ'],
  };
  
  const selectedAccount = ACCOUNT_TYPES.find(t => t.name === accountType) || ACCOUNT_TYPES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone.length !== 11) {
      showToast("মোবাইল নাম্বার ১১ ডিজিটের হতে হবে (Mobile number must be 11 digits)", 'error');
      return;
    }
    
    if (name.length <= 2) {
      showToast("নাম কমপক্ষে ৩ অক্ষরের হতে হবে (Name must be at least 3 characters)", 'error');
      return;
    }
    
    if (pin !== confirmPin) {
      showToast("পিন এবং কনফার্ম পিন মিলছে না (PIN and Confirm PIN do not match)", 'error');
      return;
    }
    
    if (!upazila) {
      showToast("দয়া করে উপজেলা সিলেক্ট করুন (Please select an Upazila)", 'error');
      return;
    }

    if (!division || !district) {
      showToast("দয়া করে বিভাগ এবং জেলা সিলেক্ট করুন (Please select Division and District)", 'error');
      return;
    }

    if (!gender) {
      showToast("দয়া করে লিঙ্গ সিলেক্ট করুন (Please select Gender)", 'error');
      return;
    }

    if (password.length < 6) {
      showToast("পাসওয়ার্ড কমপক্ষে ৬ ডিজিটের হতে হবে (Password must be at least 6 characters)", 'error');
      return;
    }
    
    if (pin.length < 4) {
      showToast("পিন কমপক্ষে ৪ ডিজিটের হতে হবে (PIN must be at least 4 digits)", 'error');
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
        accountType: selectedAccount.name,
        balance: 0,
        isActive: false,
        role: 'user'
      });
    } catch (error: any) {
      console.error("Signup error in view:", error);
      showToast("Error: " + (error.message || "Unknown error occurred"), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-600">
      <div className="pt-10 pb-6 px-6 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg overflow-hidden">
          <img src={APP_LOGO} alt={APP_NAME} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-wider uppercase">{APP_NAME}</h1>
      </div>
      
      <div className="flex-1 bg-white rounded-t-[3rem] px-6 py-8 pb-20 shadow-inner relative">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm rounded-t-[3rem] flex flex-col items-center justify-center">
            <div className="bg-green-600 p-4 rounded-2xl shadow-xl animate-bounce mb-4">
              <Loader2 className="text-white animate-spin" size={40} />
            </div>
            <p className="text-green-700 font-bold text-lg animate-pulse">Processing Registration...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 1. Name */}
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 font-medium"
              required
            />
          </div>

          {/* 2. Mobile Number */}
          <div className="space-y-1">
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="Mobile number"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 font-medium"
                required
              />
            </div>
            <p className="text-[10px] text-orange-600 font-medium px-2 flex items-center gap-1">
              <Smartphone size={10} />
              রেজিস্ট্রেশনকৃত সিমটি অবশ্যই এই ফোনে থাকতে হবে (SIM must be in this phone)
            </p>
          </div>

          {/* 3. Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 font-medium"
              required
            />
          </div>

          {/* 4. NID */}
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
            <input
              type="text"
              value={nid}
              onChange={(e) => setNid(e.target.value.replace(/\D/g, ''))}
              placeholder="National ID Card Number"
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 font-medium"
              required
            />
          </div>

          {/* 5. Date of Birth */}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
            <input
              type="text"
              value={dob}
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              onChange={(e) => setDob(e.target.value)}
              placeholder="Date of Birth"
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 font-medium"
              required
            />
          </div>

          {/* 6. Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* 7. Pin */}
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Pin"
              className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
            >
              {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* 8. Select Division */}
          <div className="relative">
            <Edit3 className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
            <select
              value={division}
              onChange={(e) => {
                setDivision(e.target.value);
                setDistrict('');
                setUpazila('');
              }}
              className="w-full pl-12 pr-10 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 font-medium appearance-none"
              required
            >
              <option value="">বিভাগ সিলেক্ট করুন</option>
              {divisions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* 8.1 Select District */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setUpazila('');
              }}
              className="w-full pl-12 pr-10 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 font-medium appearance-none disabled:bg-gray-50 disabled:text-gray-400"
              required
              disabled={!division}
            >
              <option value="">জেলা সিলেক্ট করুন</option>
              {division && districtsByDivision[division]?.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* 8.2 Select Upazila */}
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
            <select
              value={upazila}
              onChange={(e) => setUpazila(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 font-medium appearance-none disabled:bg-gray-50 disabled:text-gray-400"
              required
              disabled={!district}
            >
              <option value="">উপজেলা সিলেক্ট করুন</option>
              {district && (upazilasByDistrict[district] || [`${district} সদর`]).map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* 9. Account Type Selection */}
          <div className="relative">
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 font-medium appearance-none"
              required
            >
              {ACCOUNT_TYPES.map(t => (
                <option key={t.name} value={t.name}>{t.name}(Fee: ৳.{t.fee})</option>
              ))}
            </select>
          </div>

          {/* 10. Gender (লিঙ্গ) */}
          <div className="relative">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder="লিঙ্গ"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 font-medium appearance-none"
              required
            >
              <option value="">লিঙ্গ</option>
              <option value="Male">পুরুষ (Male)</option>
              <option value="Female">মহিলা (Female)</option>
              <option value="Other">অন্যান্য (Other)</option>
            </select>
          </div>

          {/* 11. Enter pin code (Confirm Pin) */}
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
            <input
              type={showConfirmPin ? "text" : "password"}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter pin code"
              className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-700 font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPin(!showConfirmPin)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
            >
              {showConfirmPin ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-white border border-gray-200 text-green-600 font-bold py-2 px-8 rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
            >
              Sign Up
            </button>
          </div>
        </form>
        
        <p className="mt-8 text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <button onClick={onGoToLogin} className="text-blue-700 font-bold hover:underline">
            Login
          </button>
        </p>
        <div className="mt-4 flex justify-center">
          <button onClick={onGoToPrivacy} className="text-gray-400 text-[10px] hover:underline">
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
