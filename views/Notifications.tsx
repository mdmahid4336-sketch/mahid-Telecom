
import React from 'react';
import { ArrowLeft, Bell, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface NotificationsProps {
  onBack: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onBack }) => {
  const notifications = [
    { id: '1', title: 'System Update', message: 'New version of Mahid Telecom is now available. Please update for better experience.', time: '2 hours ago', type: 'info' },
    { id: '2', title: 'Cashback Offer!', message: 'Get 2% cashback on every 500tk Mobile Recharge today.', time: '5 hours ago', type: 'success' },
    { id: '3', title: 'Maintenance Alert', message: 'Server maintenance scheduled for tonight from 2 AM to 4 AM.', time: '1 day ago', type: 'warning' },
    { id: '4', title: 'Add Balance Success', message: 'Your add balance of ৳1000 via Nagad was successful.', time: '2 days ago', type: 'success' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="text-blue-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'success': return <CheckCircle2 className="text-green-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 min-h-screen bg-gray-50 pb-10">
      <div className="bg-blue-700 text-white p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Notifications</h2>
      </div>

      <div className="p-4 space-y-3">
        {notifications.map(notif => (
          <div key={notif.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow">
            <div className="shrink-0 mt-1">
              {getIcon(notif.type)}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-800 text-sm">{notif.title}</h4>
                <span className="text-[10px] text-gray-400 font-medium">{notif.time}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
