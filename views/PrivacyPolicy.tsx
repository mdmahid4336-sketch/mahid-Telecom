
import React from 'react';
import { ArrowLeft, ShieldCheck, Eye, Lock, Server, Bell } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  const sections = [
    {
      icon: <Eye className="text-blue-600" size={24} />,
      title: "Data Collection",
      content: "We collect minimal information required for transactions, including your phone number and transaction history to provide our services."
    },
    {
      icon: <Lock className="text-green-600" size={24} />,
      title: "Security",
      content: "Your account is protected by a personal PIN. We use industry-standard encryption to ensure your data and transactions remain secure."
    },
    {
      icon: <Server className="text-purple-600" size={24} />,
      title: "Data Usage",
      content: "Your data is strictly used for processing recharges and payments. We never share your personal information with third-party advertisers."
    },
    {
      icon: <Bell className="text-orange-600" size={24} />,
      title: "Notifications",
      content: "We may send you SMS or app notifications regarding your transaction status and important security updates."
    }
  ];

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-300 min-h-screen bg-gray-50 pb-10">
      <div className="bg-blue-700 text-white p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Privacy Policy</h2>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center mb-8">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={40} className="text-blue-700" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Your Privacy Matters</h3>
          <p className="text-gray-500 mt-2 text-sm">
            At Mahid Telecom, we are committed to protecting your personal information and your right to privacy.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-50 shrink-0">
                {section.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">{section.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{section.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-blue-50 rounded-3xl border border-blue-100">
          <p className="text-xs text-blue-700 text-center leading-relaxed">
            By using Mahid Telecom, you agree to our terms of service and privacy practices. For any queries, please contact our support team.
          </p>
        </div>
        
        <p className="text-center text-[10px] text-gray-400 mt-8">
          Last Updated: March 2026 • Version 1.0.2
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
