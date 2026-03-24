import React, { useState, useEffect } from 'react';
import { ArrowLeft, Smartphone, ShieldCheck, Globe, Cpu, MapPin } from 'lucide-react';

interface MyDeviceProps {
  onBack: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const MyDevice: React.FC<MyDeviceProps> = ({ onBack, showToast }) => {
  const [deviceInfo, setDeviceInfo] = useState({
    browser: 'Loading...',
    os: 'Loading...',
    ip: '103.145.122.45', // Mock IP
    location: 'Dhaka, Bangladesh',
    lastLogin: new Date().toLocaleString(),
    status: 'Trusted'
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;
    let browser = "Unknown Browser";
    let os = "Unknown OS";

    if (userAgent.indexOf("Firefox") > -1) browser = "Mozilla Firefox";
    else if (userAgent.indexOf("SamsungBrowser") > -1) browser = "Samsung Internet";
    else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) browser = "Opera";
    else if (userAgent.indexOf("Trident") > -1) browser = "Internet Explorer";
    else if (userAgent.indexOf("Edge") > -1) browser = "Microsoft Edge";
    else if (userAgent.indexOf("Chrome") > -1) browser = "Google Chrome";
    else if (userAgent.indexOf("Safari") > -1) browser = "Apple Safari";

    if (userAgent.indexOf("Win") != -1) os = "Windows OS";
    else if (userAgent.indexOf("Mac") != -1) os = "Macintosh";
    else if (userAgent.indexOf("Linux") != -1) os = "Linux OS";
    else if (userAgent.indexOf("Android") != -1) os = "Android OS";
    else if (userAgent.indexOf("like Mac") != -1) os = "iOS";

    setDeviceInfo(prev => ({
      ...prev,
      browser,
      os
    }));
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">My Device</h2>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone size={40} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Current Device</h3>
        <p className="text-sm text-green-600 font-medium flex items-center justify-center gap-1 mt-1">
          <ShieldCheck size={14} /> This device is trusted
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-gray-50 p-3 rounded-xl text-gray-600">
            <Cpu size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Operating System</p>
            <p className="text-sm font-semibold text-gray-800">{deviceInfo.os}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-gray-50 p-3 rounded-xl text-gray-600">
            <Globe size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Browser</p>
            <p className="text-sm font-semibold text-gray-800">{deviceInfo.browser}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-gray-50 p-3 rounded-xl text-gray-600">
            <MapPin size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">IP & Location</p>
            <p className="text-sm font-semibold text-gray-800">{deviceInfo.ip}</p>
            <p className="text-xs text-gray-400">{deviceInfo.location}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center px-1 mb-4">
          <h3 className="font-bold text-gray-800">Security Actions</h3>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Logout from all devices</span>
              <span className="text-[10px] text-gray-400">Secure your account if you lost a device</span>
            </div>
            <ArrowLeft size={18} className="rotate-180 text-gray-300" />
          </button>
          <button className="w-full text-left p-4 hover:bg-red-50 text-red-600 flex justify-between items-center">
            <span className="text-sm font-medium">Remove this device</span>
            <ShieldCheck size={18} />
          </button>
        </div>
      </div>
      
      <p className="text-center text-[10px] text-gray-400 mt-8">
        Last active: {deviceInfo.lastLogin}
      </p>
    </div>
  );
};

export default MyDevice;
