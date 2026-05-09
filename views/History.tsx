
import React, { useState } from 'react';
import { ArrowLeft, Clock, Search, Filter, CheckCircle2, XCircle, Smartphone, CreditCard, Send, Zap, ChevronRight, Copy } from 'lucide-react';
import { Transaction } from '../types';

interface HistoryProps {
  history: Transaction[];
  onBack: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

const History: React.FC<HistoryProps> = ({ history, onBack, showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'All' | 'Recharge' | 'Bill Pay' | 'Transfer' | 'Add Balance'>('All');

  const filteredHistory = history.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tx.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || tx.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'Recharge': return <Smartphone className="text-blue-500" />;
      case 'Add Balance': return <CreditCard className="text-green-500" />;
      case 'Transfer': return <Send className="text-purple-500" />;
      case 'Drive Pack': return <Zap className="text-orange-500" />;
      default: return <Clock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-600';
      case 'Pending': return 'bg-orange-100 text-orange-600';
      case 'Failed': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-700 text-white p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Transaction History</h2>
      </div>

      {/* Filters */}
      <div className="p-4 space-y-4 bg-white shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by description or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Recharge', 'Bill Pay', 'Transfer', 'Add Balance'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 p-4 space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-20">
            <Clock size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 italic">No transactions found</p>
          </div>
        ) : (
          filteredHistory.map(tx => (
            <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    {getIcon(tx.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{tx.type}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-lg ${tx.type === 'Add Balance' ? 'text-green-600' : 'text-indigo-900'}`}>
                    {tx.type === 'Add Balance' ? '+' : '-'} ৳{tx.amount}
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between gap-3">
                <p className="text-xs text-gray-600 line-clamp-1">{tx.description}</p>
                {tx.txId && (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(tx.txId!);
                      showToast("TXID copied!", 'success');
                    }}
                    className="shrink-0 p-1 text-gray-400 hover:text-blue-600"
                  >
                    <Copy size={12} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
