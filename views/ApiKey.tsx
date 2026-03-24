import React, { useState } from 'react';
import { ArrowLeft, Key, Copy, Check, ShieldAlert } from 'lucide-react';

interface ApiKeyProps {
  onBack: () => void;
}

const ApiKey: React.FC<ApiKeyProps> = ({ onBack }) => {
  const [apiKey] = useState("mahid_live_sk_78x92kLp02mNq1vR5tW8yZ");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">API Configuration</h2>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <Key size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Your API Key</h3>
            <p className="text-xs text-gray-500">Use this key to connect with external services</p>
          </div>
        </div>

        <div className="relative">
          <div className="bg-gray-50 p-4 rounded-xl font-mono text-xs break-all border border-gray-200 pr-12">
            {apiKey}
          </div>
          <button 
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
        
        {copied && (
          <p className="text-center text-xs text-green-600 mt-2 font-medium">Copied to clipboard!</p>
        )}
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3">
        <ShieldAlert className="text-orange-600 shrink-0" size={20} />
        <div>
          <h4 className="text-sm font-bold text-orange-800">Security Warning</h4>
          <p className="text-xs text-orange-700 leading-relaxed">
            Never share your API key with anyone. Mahid Telecom staff will never ask for your secret key. If you suspect your key is compromised, please regenerate it immediately.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="font-bold text-gray-800 px-1">API Documentation</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <span className="text-sm font-medium">Developer Guide</span>
            <span className="text-xs text-blue-600 font-bold">PDF</span>
          </button>
          <button className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <span className="text-sm font-medium">Recharge API Endpoint</span>
            <span className="text-xs text-gray-400">/api/recharge</span>
          </button>
          <button className="w-full text-left p-4 hover:bg-gray-50 flex justify-between items-center">
            <span className="text-sm font-medium">Balance Check API</span>
            <span className="text-xs text-gray-400">/api/balance</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKey;
