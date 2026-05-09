
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Zap, Clock, CheckCircle2, Smartphone, ShieldCheck, X, Loader2 } from 'lucide-react';
import { OPERATORS } from '../constants';
import { db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

import { Transaction, User as UserType } from '../types';

interface DrivePackagesProps {
  user: UserType;
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

const DrivePackages: React.FC<DrivePackagesProps> = ({ user, onBack, onAddTransaction, showToast }) => {
  const [selectedOperator, setSelectedOperator] = useState(OPERATORS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [purchasingPackage, setPurchasingPackage] = useState<Package | null>(null);
  const [recipientNumber, setRecipientNumber] = useState('');
  const [pin, setPin] = useState('');
  const [modalStep, setModalStep] = useState(1);
  const [dbPackages, setDbPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'packages'), where('isActive', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
      setDbPackages(pList);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching packages:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredPackages = dbPackages.filter(pkg => 
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
    if (pin !== user.pin) {
      showToast("Incorrect PIN. Please try again.", 'error');
      return;
    }
    
    if (purchasingPackage) {
      onAddTransaction({
        type: 'Drive Pack',
        amount: purchasingPackage.finalPrice,
        description: `${purchasingPackage.operator} - ${purchasingPackage.title} for ${recipientNumber}`
      });
      // showToast is called inside onAddTransaction usually, or we can keep it here
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-400 font-medium">Loading packages...</p>
            </div>
          ) : filteredPackages.length > 0 ? (
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
