
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Smartphone, CreditCard, ShieldCheck, Send } from 'lucide-react';

interface PaymentGatewayProps {
  amount: number;
  accountType: string;
  onPaymentSuccess: () => void;
  onBack: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, accountType, onPaymentSuccess, onBack, showToast }) => {
  const [selectedMethod, setSelectedMethod] = useState<'nagad' | 'rocket' | 'cellfin' | 'mcash' | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'selection' | 'details'>('selection');
  const [transactionId, setTransactionId] = useState('');

  const paymentNumbers = {
    nagad: '01920544401',
    rocket: '019205444014',
    cellfin: '01862213888',
    mcash: '018622138880'
  };

  const currentNumber = selectedMethod ? paymentNumbers[selectedMethod as keyof typeof paymentNumbers] : '';

  const handlePay = () => {
    if (!selectedMethod) return;
    setStep('details');
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Number copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-blue-700 text-white p-6 rounded-b-[2.5rem] shadow-lg">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-white/80 hover:text-white">
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
        <h1 className="text-2xl font-bold">Registration Payment</h1>
        <p className="text-blue-100 text-sm mt-1">Complete your payment to activate account</p>
      </div>

      <div className="flex-1 p-6 -mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-medium">Account Type</span>
            <span className="font-bold text-gray-900">{accountType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Payable Amount</span>
            <span className="text-2xl font-black text-blue-700">৳{amount}</span>
          </div>
        </div>

        {step === 'selection' ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-2">
              <p className="text-xs text-blue-800 leading-relaxed">
                To activate your <span className="font-bold">{accountType}</span> account, please pay the registration fee of <span className="font-bold">৳{amount}</span> using one of the methods below.
              </p>
            </div>
            
            <h3 className="text-sm font-bold text-gray-500 uppercase ml-1">Select Payment Method</h3>
            
            <button
              onClick={() => setSelectedMethod('nagad')}
              className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${selectedMethod === 'nagad' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 bg-white'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-bold">n</div>
                <span className="font-bold text-gray-800">Nagad</span>
              </div>
              {selectedMethod === 'nagad' && <CheckCircle2 className="text-orange-500" size={20} />}
            </button>

            <button
              onClick={() => setSelectedMethod('rocket')}
              className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${selectedMethod === 'rocket' ? 'border-purple-500 bg-purple-50' : 'border-gray-100 bg-white'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 font-bold">r</div>
                <span className="font-bold text-gray-800">Rocket</span>
              </div>
              {selectedMethod === 'rocket' && <CheckCircle2 className="text-purple-500" size={20} />}
            </button>

            <button
              onClick={() => setSelectedMethod('cellfin')}
              className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${selectedMethod === 'cellfin' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">c</div>
                <span className="font-bold text-gray-800">Cellfin</span>
              </div>
              {selectedMethod === 'cellfin' && <CheckCircle2 className="text-blue-500" size={20} />}
            </button>

            <button
              onClick={() => setSelectedMethod('mcash')}
              className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${selectedMethod === 'mcash' ? 'border-orange-600 bg-orange-50' : 'border-gray-100 bg-white'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-bold">m</div>
                <span className="font-bold text-gray-800">M-Cash</span>
              </div>
              {selectedMethod === 'mcash' && <CheckCircle2 className="text-orange-600" size={20} />}
            </button>

            <button
              onClick={handlePay}
              disabled={!selectedMethod}
              className="w-full bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl shadow-lg mt-4 active:scale-95 transition-transform"
            >
              Proceed to Pay
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Payment Instructions</h4>
                  <p className="text-xs text-gray-500">Follow these steps to pay</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shrink-0 mt-0.5">1</div>
                  <p className="text-sm text-gray-600">
                    Open your <span className="font-bold text-gray-900 capitalize">{selectedMethod}</span> app or dial USSD code.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shrink-0 mt-0.5">2</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      Choose <span className="font-bold text-gray-900">"Send Money"</span> and enter this number:
                    </p>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                      <span className="font-mono font-bold text-lg text-blue-700">{currentNumber}</span>
                      <button 
                        onClick={() => copyToClipboard(currentNumber)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold active:scale-95 transition-transform"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shrink-0 mt-0.5">3</div>
                  <p className="text-sm text-gray-600">
                    Enter amount <span className="font-bold text-gray-900">৳{amount}</span> and complete the transaction.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shrink-0 mt-0.5">4</div>
                  <p className="text-sm text-gray-600">
                    Copy the <span className="font-bold text-gray-900">Transaction ID</span> from the confirmation message and paste it below.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Enter Transaction ID</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  placeholder="e.g. 8N7X6W5V4"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>Verify</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setStep('selection')}
              className="w-full text-gray-500 font-medium py-2"
            >
              Change Payment Method
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;
