import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { X, ShieldCheck, CreditCard, Sparkles, Smartphone, ArrowRight, Info } from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const { 
    isPaymentModalOpen, 
    activeMatchForPayment, 
    closePaymentModal, 
    confirmJoinMatch 
  } = useApp();

  const { t } = useLanguage();

  const [paymentMethod, setPaymentMethod] = useState<'Apple Pay' | 'Google Pay' | 'Credit Card'>('Apple Pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(true);

  if (!isPaymentModalOpen || !activeMatchForPayment) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      confirmJoinMatch(paymentMethod);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#120a21] border border-purple-800/50 rounded-3xl shadow-2xl text-white p-5 sm:p-6 space-y-5 my-auto custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-900/60 border border-purple-600/40 flex items-center justify-center text-purple-300 font-bold">
              💳
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{t.paymentModal.modalTitle}</h3>
              <p className="text-xs text-purple-300/70">{activeMatchForPayment.title}</p>
            </div>
          </div>

          <button
            onClick={closePaymentModal}
            className="p-2 rounded-full bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment recommendation note */}
        {showRecommendation && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/90 via-indigo-950/80 to-purple-950/90 border border-purple-600/40 space-y-2 relative">
            <button
              onClick={() => setShowRecommendation(false)}
              className="absolute top-2.5 right-2.5 text-purple-400 hover:text-white text-xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
              <Info className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{t.paymentModal.recommendationTitle}</span>
            </div>
            <p className="text-[11px] text-purple-200/80 leading-relaxed pr-4">
              {t.paymentModal.recommendationDesc}
            </p>
          </div>
        )}

        {/* Fee & Refund Banner */}
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-purple-300/70 font-semibold uppercase">{t.paymentModal.totalGelFee}</div>
            <div className="text-2xl font-black text-white">{activeMatchForPayment.pricePerPlayerGel} {t.common.gel}</div>
            <div className="text-[10px] text-purple-300/80">{t.paymentModal.courtAndBalls}</div>
          </div>

          <div className="text-right max-w-[170px]">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.paymentModal.fullRefund}</span>
            </div>
            <p className="text-[10px] text-purple-300/70 leading-tight">
              {t.paymentModal.refundSub}
            </p>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-purple-200 uppercase tracking-wider block">
            {t.paymentModal.selectMethod}
          </label>

          <div className="grid grid-cols-3 gap-2.5">
            
            {/* Apple Pay */}
            <button
              onClick={() => setPaymentMethod('Apple Pay')}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                paymentMethod === 'Apple Pay'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-950/80 scale-[1.02]'
                  : 'bg-purple-950/40 text-purple-300/80 hover:bg-purple-900/40 border-purple-800/30'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="text-xs font-bold">Apple Pay</span>
            </button>

            {/* Google Pay */}
            <button
              onClick={() => setPaymentMethod('Google Pay')}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                paymentMethod === 'Google Pay'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-950/80 scale-[1.02]'
                  : 'bg-purple-950/40 text-purple-300/80 hover:bg-purple-900/40 border-purple-800/30'
              }`}
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-bold">Google Pay</span>
            </button>

            {/* Credit Card */}
            <button
              onClick={() => setPaymentMethod('Credit Card')}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                paymentMethod === 'Credit Card'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-950/80 scale-[1.02]'
                  : 'bg-purple-950/40 text-purple-300/80 hover:bg-purple-900/40 border-purple-800/30'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs font-bold">{t.paymentModal.card}</span>
            </button>

          </div>
        </div>

        {/* Simulated Card input if card chosen */}
        {paymentMethod === 'Credit Card' && (
          <div className="p-3.5 bg-purple-950/30 rounded-2xl border border-purple-800/20 space-y-2 text-xs">
            <div className="flex justify-between items-center text-purple-300/80 font-medium">
              <span>{t.paymentModal.cardNumber}</span>
              <span>VISA / Mastercard</span>
            </div>
            <input
              type="text"
              readOnly
              value="•••• •••• •••• 4242"
              className="w-full px-3 py-2 bg-purple-950/60 rounded-xl border border-purple-800/40 text-white font-mono text-xs"
            />
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-purple-950/80 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t.paymentModal.processing}</span>
            </div>
          ) : (
            <>
              <span>{t.paymentModal.payVia} {activeMatchForPayment.pricePerPlayerGel} {t.common.gel} ({paymentMethod})</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </div>
    </div>
  );
};
