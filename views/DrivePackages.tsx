
import React, { useState } from 'react';
import { ArrowLeft, Search, Zap, Clock, CheckCircle2, Smartphone, ShieldCheck, X } from 'lucide-react';
import { OPERATORS } from '../constants';

import { AppView, Transaction } from '../types';

interface DrivePackagesProps {
  onBack: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

interface Package {
  id: string;
  operator: string;
  title: string;
  duration: string;
  price: number;
  discount: number;
  finalPrice: number;
}

const DrivePackages: React.FC<DrivePackagesProps> = ({ onBack, onAddTransaction, showToast }) => {
  const [selectedOperator, setSelectedOperator] = useState(OPERATORS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [purchasingPackage, setPurchasingPackage] = useState<Package | null>(null);
  const [recipientNumber, setRecipientNumber] = useState('');
  const [pin, setPin] = useState('');
  const [modalStep, setModalStep] = useState(1);

  const mockPackages: Package[] = [
    // Grameenphone
    { id: 'gp1', operator: 'Grameenphone', title: '40GB + 800 Min', duration: '30 Days', price: 799, discount: 150, finalPrice: 649 },
    { id: 'gp2', operator: 'Grameenphone', title: '50GB + 1000 Min', duration: '30 Days', price: 899, discount: 200, finalPrice: 699 },
    { id: 'gp3', operator: 'Grameenphone', title: '30GB + 500 Min', duration: '30 Days', price: 599, discount: 120, finalPrice: 479 },
    { id: 'gp4', operator: 'Grameenphone', title: '100GB (Internet Only)', duration: '30 Days', price: 999, discount: 250, finalPrice: 749 },
    { id: 'gp5', operator: 'Grameenphone', title: '1GB (Regular)', duration: '7 Days', price: 49, discount: 5, finalPrice: 44 },
    { id: 'gp6', operator: 'Grameenphone', title: '5GB (Regular)', duration: '7 Days', price: 149, discount: 15, finalPrice: 134 },
    { id: 'gp7', operator: 'Grameenphone', title: '20GB + 400 Min', duration: '30 Days', price: 499, discount: 80, finalPrice: 419 },
    { id: 'gp8', operator: 'Grameenphone', title: '15GB (Regular)', duration: '30 Days', price: 399, discount: 60, finalPrice: 339 },
    { id: 'gp9', operator: 'Grameenphone', title: '10GB + 200 Min (Weekly)', duration: '7 Days', price: 199, discount: 30, finalPrice: 169 },
    { id: 'gp10', operator: 'Grameenphone', title: '15GB (Weekly)', duration: '7 Days', price: 149, discount: 20, finalPrice: 129 },
    { id: 'gp-fam1', operator: 'Grameenphone', title: '60GB + 1200 Min (Family Pack)', duration: '30 Days', price: 1099, discount: 250, finalPrice: 849 },
    { id: 'gp-fam2', operator: 'Grameenphone', title: '80GB + 1500 Min (Family Pack)', duration: '30 Days', price: 1299, discount: 300, finalPrice: 999 },
    { id: 'gp-min1', operator: 'Grameenphone', title: '50 Min (Minute Pack)', duration: '2 Days', price: 34, discount: 2, finalPrice: 32 },
    { id: 'gp-min2', operator: 'Grameenphone', title: '100 Min (Minute Pack)', duration: '7 Days', price: 67, discount: 5, finalPrice: 62 },
    { id: 'gp-min3', operator: 'Grameenphone', title: '200 Min (Minute Pack)', duration: '30 Days', price: 134, discount: 10, finalPrice: 124 },
    
    // Robi
    { id: 'rb1', operator: 'Robi', title: '50GB + 1000 Min', duration: '30 Days', price: 899, discount: 220, finalPrice: 679 },
    { id: 'rb2', operator: 'Robi', title: '40GB + 800 Min', duration: '30 Days', price: 799, discount: 180, finalPrice: 619 },
    { id: 'rb3', operator: 'Robi', title: '25GB + 500 Min', duration: '30 Days', price: 499, discount: 100, finalPrice: 399 },
    { id: 'rb4', operator: 'Robi', title: 'Unlimited Internet (1Mbps)', duration: '30 Days', price: 599, discount: 120, finalPrice: 479 },
    { id: 'rb5', operator: 'Robi', title: '2GB (Regular)', duration: '3 Days', price: 54, discount: 6, finalPrice: 48 },
    { id: 'rb6', operator: 'Robi', title: '30GB + 600 Min', duration: '30 Days', price: 599, discount: 110, finalPrice: 489 },
    { id: 'rb7', operator: 'Robi', title: '10GB (Regular)', duration: '15 Days', price: 249, discount: 30, finalPrice: 219 },
    { id: 'rb8', operator: 'Robi', title: '12GB + 250 Min (Weekly)', duration: '7 Days', price: 219, discount: 40, finalPrice: 179 },
    { id: 'rb9', operator: 'Robi', title: '8GB (Weekly)', duration: '7 Days', price: 129, discount: 20, finalPrice: 109 },
    { id: 'rb-fam1', operator: 'Robi', title: '70GB + 1300 Min (Family Pack)', duration: '30 Days', price: 1199, discount: 280, finalPrice: 919 },
    { id: 'rb-fam2', operator: 'Robi', title: '100GB + 2000 Min (Family Pack)', duration: '30 Days', price: 1599, discount: 400, finalPrice: 1199 },
    { id: 'rb-min1', operator: 'Robi', title: '60 Min (Minute Pack)', duration: '2 Days', price: 39, discount: 3, finalPrice: 36 },
    { id: 'rb-min2', operator: 'Robi', title: '150 Min (Minute Pack)', duration: '7 Days', price: 98, discount: 8, finalPrice: 90 },
    { id: 'rb-min3', operator: 'Robi', title: '300 Min (Minute Pack)', duration: '30 Days', price: 196, discount: 15, finalPrice: 181 },
    
    // Banglalink
    { id: 'bl1', operator: 'Banglalink', title: '30GB + 500 Min', duration: '30 Days', price: 599, discount: 130, finalPrice: 469 },
    { id: 'bl2', operator: 'Banglalink', title: '40GB + 800 Min', duration: '30 Days', price: 749, discount: 160, finalPrice: 589 },
    { id: 'bl3', operator: 'Banglalink', title: '20GB + 400 Min', duration: '30 Days', price: 399, discount: 80, finalPrice: 319 },
    { id: 'bl4', operator: 'Banglalink', title: 'Social Pack 15GB', duration: '30 Days', price: 199, discount: 40, finalPrice: 159 },
    { id: 'bl5', operator: 'Banglalink', title: '3GB (Regular)', duration: '7 Days', price: 99, discount: 10, finalPrice: 89 },
    { id: 'bl6', operator: 'Banglalink', title: '50GB + 1000 Min', duration: '30 Days', price: 899, discount: 180, finalPrice: 719 },
    { id: 'bl7', operator: 'Banglalink', title: '12GB (Regular)', duration: '30 Days', price: 299, discount: 45, finalPrice: 254 },
    { id: 'bl8', operator: 'Banglalink', title: '10GB + 200 Min (Weekly)', duration: '7 Days', price: 189, discount: 35, finalPrice: 154 },
    { id: 'bl9', operator: 'Banglalink', title: '7GB (Weekly)', duration: '7 Days', price: 119, discount: 20, finalPrice: 99 },
    { id: 'bl-fam1', operator: 'Banglalink', title: '65GB + 1200 Min (Family Pack)', duration: '30 Days', price: 1049, discount: 240, finalPrice: 809 },
    { id: 'bl-fam2', operator: 'Banglalink', title: '90GB + 1600 Min (Family Pack)', duration: '30 Days', price: 1399, discount: 320, finalPrice: 1079 },
    { id: 'bl-min1', operator: 'Banglalink', title: '40 Min (Minute Pack)', duration: '2 Days', price: 27, discount: 2, finalPrice: 25 },
    { id: 'bl-min2', operator: 'Banglalink', title: '120 Min (Minute Pack)', duration: '7 Days', price: 78, discount: 6, finalPrice: 72 },
    { id: 'bl-min3', operator: 'Banglalink', title: '250 Min (Minute Pack)', duration: '30 Days', price: 162, discount: 12, finalPrice: 150 },
    
    // Airtel
    { id: 'at1', operator: 'Airtel', title: '25GB + 400 Min', duration: '30 Days', price: 499, discount: 110, finalPrice: 389 },
    { id: 'at2', operator: 'Airtel', title: '35GB + 600 Min', duration: '30 Days', price: 649, discount: 140, finalPrice: 509 },
    { id: 'at3', operator: 'Airtel', title: '15GB + 300 Min', duration: '30 Days', price: 349, discount: 70, finalPrice: 279 },
    { id: 'at4', operator: 'Airtel', title: 'Gamer Pack 20GB', duration: '30 Days', price: 299, discount: 60, finalPrice: 239 },
    { id: 'at5', operator: 'Airtel', title: '1.5GB (Regular)', duration: '3 Days', price: 44, discount: 4, finalPrice: 40 },
    { id: 'at6', operator: 'Airtel', title: '40GB + 800 Min', duration: '30 Days', price: 749, discount: 150, finalPrice: 599 },
    { id: 'at7', operator: 'Airtel', title: '8GB (Regular)', duration: '7 Days', price: 189, discount: 20, finalPrice: 169 },
    { id: 'at8', operator: 'Airtel', title: '10GB + 250 Min (Weekly)', duration: '7 Days', price: 199, discount: 40, finalPrice: 159 },
    { id: 'at9', operator: 'Airtel', title: '5GB (Weekly)', duration: '7 Days', price: 99, discount: 15, finalPrice: 84 },
    { id: 'at-fam1', operator: 'Airtel', title: '55GB + 1000 Min (Family Pack)', duration: '30 Days', price: 949, discount: 210, finalPrice: 739 },
    { id: 'at-min1', operator: 'Airtel', title: '50 Min (Minute Pack)', duration: '2 Days', price: 32, discount: 2, finalPrice: 30 },
    { id: 'at-min2', operator: 'Airtel', title: '100 Min (Minute Pack)', duration: '7 Days', price: 64, discount: 5, finalPrice: 59 },
    { id: 'at-min3', operator: 'Airtel', title: '200 Min (Minute Pack)', duration: '30 Days', price: 128, discount: 10, finalPrice: 118 },
    
    // Teletalk
    { id: 'tt1', operator: 'Teletalk', title: '10GB + 200 Min', duration: '30 Days', price: 299, discount: 60, finalPrice: 239 },
    { id: 'tt2', operator: 'Teletalk', title: '20GB + 400 Min', duration: '30 Days', price: 499, discount: 100, finalPrice: 399 },
    { id: 'tt3', operator: 'Teletalk', title: '5GB + 100 Min', duration: '30 Days', price: 149, discount: 30, finalPrice: 119 },
    { id: 'tt4', operator: 'Teletalk', title: '2GB (Regular)', duration: '7 Days', price: 69, discount: 7, finalPrice: 62 },
    { id: 'tt5', operator: 'Teletalk', title: '30GB + 500 Min', duration: '30 Days', price: 599, discount: 110, finalPrice: 489 },
    { id: 'tt6', operator: 'Teletalk', title: '5GB + 100 Min (Weekly)', duration: '7 Days', price: 99, discount: 20, finalPrice: 79 },
    { id: 'tt7', operator: 'Teletalk', title: '3GB (Weekly)', duration: '7 Days', price: 69, discount: 10, finalPrice: 59 },
    { id: 'tt-fam1', operator: 'Teletalk', title: '40GB + 800 Min (Family Pack)', duration: '30 Days', price: 799, discount: 150, finalPrice: 649 },
    { id: 'tt-min1', operator: 'Teletalk', title: '30 Min (Minute Pack)', duration: '2 Days', price: 19, discount: 1, finalPrice: 18 },
    { id: 'tt-min2', operator: 'Teletalk', title: '80 Min (Minute Pack)', duration: '7 Days', price: 52, discount: 4, finalPrice: 48 },
    { id: 'tt-min3', operator: 'Teletalk', title: '150 Min (Minute Pack)', duration: '30 Days', price: 97, discount: 8, finalPrice: 89 },
  ];

  const filteredPackages = mockPackages.filter(pkg => 
    pkg.operator === selectedOperator && 
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNextModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipientNumber.length === 11) {
      setModalStep(2);
    } else {
      showToast("Please enter a valid 11-digit number", 'error');
    }
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      showToast("Please enter a valid PIN", 'error');
      return;
    }
    
    if (purchasingPackage) {
      onAddTransaction({
        type: 'Drive Pack',
        amount: purchasingPackage.finalPrice,
        description: `${purchasingPackage.operator} - ${purchasingPackage.title} for ${recipientNumber}`
      });
      showToast(`Purchase Successful for ${recipientNumber}: ${purchasingPackage?.title}`, 'success');
    }
    
    setPurchasingPackage(null);
    setRecipientNumber('');
    setPin('');
    setModalStep(1);
  };

  const closePurchaseModal = () => {
    setPurchasingPackage(null);
    setRecipientNumber('');
    setPin('');
    setModalStep(1);
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 min-h-screen bg-gray-50 pb-10 relative">
      <div className="bg-blue-700 text-white p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Drive & Regular Packages</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Operator Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {OPERATORS.map(op => (
            <button
              key={op}
              onClick={() => setSelectedOperator(op)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                selectedOperator === op 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {op}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Packages List */}
        <div className="space-y-3">
          {filteredPackages.length > 0 ? (
            filteredPackages.map(pkg => (
              <div key={pkg.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-orange-500" />
                    <h4 className="font-bold text-gray-800">{pkg.title}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={12} /> {pkg.duration}</span>
                    <span className="flex items-center gap-1 text-green-600 font-bold"><CheckCircle2 size={12} /> Commission: ৳{pkg.discount}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 line-through">৳{pkg.price}</p>
                  <p className="text-lg font-black text-blue-700">৳{pkg.finalPrice}</p>
                  <button 
                    onClick={() => setPurchasingPackage(pkg)}
                    className="mt-1 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider active:scale-95 transition-transform"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              <Zap size={48} className="mx-auto mb-2 opacity-20" />
              <p>No packages found for {selectedOperator}</p>
            </div>
          )}
        </div>
      </div>

      {/* Purchase Modal */}
      {purchasingPackage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Confirm Purchase</h3>
              <button onClick={closePurchaseModal} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl mb-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-blue-600" />
                <p className="font-bold text-blue-900">{purchasingPackage.title}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-blue-700">{purchasingPackage.operator} • {purchasingPackage.duration}</p>
                <p className="text-lg font-black text-blue-700">৳{purchasingPackage.finalPrice}</p>
              </div>
            </div>

            {modalStep === 1 ? (
              <form onSubmit={handleNextModal} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Recipient Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={recipientNumber}
                      onChange={(e) => setRecipientNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  Next
                </button>
              </form>
            ) : (
              <form onSubmit={handlePurchase} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Account PIN</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      placeholder="Enter 4-6 digit PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-[1em] font-bold"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  Confirm & Pay ৳{purchasingPackage.finalPrice}
                </button>
                <button
                  type="button"
                  onClick={() => setModalStep(1)}
                  className="w-full py-2 text-gray-500 text-sm font-bold"
                >
                  Back
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrivePackages;
