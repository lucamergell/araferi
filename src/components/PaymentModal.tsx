import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { X, ShieldCheck, Building2, Banknote, Copy, Check, ArrowRight } from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const { 
    isPaymentModalOpen, 
    activeMatchForPayment, 
    closePaymentModal, 
    confirmJoinMatch 
  } = useApp();

  const { t } = useLanguage();

  const [paymentOption, setPaymentOption] = useState<'Bank Transfer' | 'Pay on Court'>('Bank Transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedPurpose, setCopiedPurpose] = useState(false);

  if (!isPaymentModalOpen || !activeMatchForPayment) return null;

  const ibanNumber = 'GE88TB7712336080100010';
  const matchLocationLabel = activeMatchForPayment.district || activeMatchForPayment.locationName || 'Tbilisi';
  const transactionPurpose = `Padely (${matchLocationLabel})`;

  const handleCopyIban = () => {
    navigator.clipboard.writeText(ibanNumber);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleCopyPurpose = () => {
    navigator.clipboard.writeText(transactionPurpose);
    setCopiedPurpose(true);
    setTimeout(() => setCopiedPurpose(false), 2000);
  };

  const handleConfirmRegistration = () => {
    setIsProcessing(true);
    setTimeout(() => {
      confirmJoinMatch(paymentOption);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#120a21] border border-purple-800/50 rounded-3xl shadow-2xl text-white p-5 sm:p-6 space-y-5 my-auto custom-scrollbar">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-900/60 border border-purple-600/40 flex items-center justify-center text-purple-300 font-bold">
              🎾
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

        {/* Total Fee & Refund Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-indigo-950/60 to-purple-950/80 border border-purple-800/40 flex items-center justify-between">
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

        {/* Two Main Payment Option Buttons */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-purple-200 uppercase tracking-wider block">
            {t.paymentModal.selectMethod}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Button 1: Transfer money to Bank Account to Register */}
            <button
              onClick={() => setPaymentOption('Bank Transfer')}
              className={`p-4 rounded-2xl border flex flex-col items-start gap-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                paymentOption === 'Bank Transfer'
                  ? 'bg-purple-600/90 text-white border-purple-400 shadow-lg shadow-purple-950/80 scale-[1.01]'
                  : 'bg-purple-950/40 text-purple-200/80 hover:bg-purple-900/40 border-purple-800/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${paymentOption === 'Bank Transfer' ? 'bg-white/20 text-white' : 'bg-purple-900/50 text-purple-300'}`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-black leading-tight">
                  {t.paymentModal.bankTransferBtn}
                </span>
              </div>
            </button>

            {/* Button 2: Pay by Cash on Court */}
            <button
              onClick={() => setPaymentOption('Pay on Court')}
              className={`p-4 rounded-2xl border flex flex-col items-start gap-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                paymentOption === 'Pay on Court'
                  ? 'bg-purple-600/90 text-white border-purple-400 shadow-lg shadow-purple-950/80 scale-[1.01]'
                  : 'bg-purple-950/40 text-purple-200/80 hover:bg-purple-900/40 border-purple-800/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${paymentOption === 'Pay on Court' ? 'bg-white/20 text-white' : 'bg-purple-900/50 text-purple-300'}`}>
                  <Banknote className="w-5 h-5" />
                </div>
                <span className="text-xs font-black leading-tight">
                  {t.paymentModal.cashOnCourtBtn}
                </span>
              </div>
            </button>

          </div>
        </div>

        {/* Option 1 Details: Bank Account Details */}
        {paymentOption === 'Bank Transfer' && (
          <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-700/40 space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-purple-800/30 pb-2">
              <span className="text-xs font-black text-purple-200 uppercase tracking-wide flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-400" />
                {t.paymentModal.bankDetailsTitle}
              </span>
              <span className="text-[10px] font-bold bg-purple-900/80 px-2 py-0.5 rounded-md text-purple-300">
                TBC Bank / Bank of Georgia
              </span>
            </div>

            {/* Recipient Info */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-purple-300/70 font-medium">{t.paymentModal.recipientName}:</span>
              <span className="font-bold text-white">Padely Georgia</span>
            </div>

            {/* IBAN Box */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-purple-300/80 block">
                {t.paymentModal.ibanLabel}:
              </span>
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#090412] border border-purple-800/50">
                <span className="font-mono text-xs font-bold text-purple-200 tracking-wider select-all">
                  {ibanNumber}
                </span>
                <button
                  onClick={handleCopyIban}
                  className="px-2.5 py-1 rounded-lg bg-purple-800/50 hover:bg-purple-700 text-purple-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                >
                  {copiedIban ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{t.paymentModal.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.paymentModal.copyIban}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Transaction Description Notice */}
            <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-600/40 space-y-2">
              <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>⚠️ {t.paymentModal.purposeNotice}</span>
              </p>
              
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#090412] border border-amber-500/30">
                <span className="font-mono text-xs font-black text-amber-300 tracking-wide select-all">
                  {transactionPurpose}
                </span>
                <button
                  onClick={handleCopyPurpose}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                >
                  {copiedPurpose ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{t.paymentModal.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.paymentModal.copyPurpose}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Option 2 Details: Cash on Court Notice */}
        {paymentOption === 'Pay on Court' && (
          <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-700/40 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-300">
              <Banknote className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.paymentModal.cashNoticeTitle}</span>
            </div>
            <p className="text-xs text-purple-200/90 leading-relaxed">
              {t.paymentModal.cashNoticeDesc.replace('{{price}}', String(activeMatchForPayment.pricePerPlayerGel))}
            </p>
          </div>
        )}

        {/* Final Action / Confirm Registration Button */}
        <button
          onClick={handleConfirmRegistration}
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
              <span>
                {paymentOption === 'Bank Transfer'
                  ? t.paymentModal.confirmTransferRegistration
                  : t.paymentModal.confirmCashRegistration}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </div>
    </div>
  );
};
