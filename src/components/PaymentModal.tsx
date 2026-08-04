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

  const ibanNumber = 'GE73BG0000000611895381';
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
          <div>
            <div className="text-[11px] font-black tracking-widest text-purple-400 uppercase font-anta">PADELY.GE</div>
            <h3 className="text-lg font-black text-white">{t.paymentModal.modalTitle}</h3>
            <p className="text-xs text-purple-300/70">{activeMatchForPayment.title}</p>
          </div>

          <button
            onClick={closePaymentModal}
            className="p-2 rounded-full bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Fee Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-indigo-950/60 to-purple-950/80 border border-purple-800/40 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-purple-300/70 font-semibold uppercase">{t.paymentModal.totalGelFee}</div>
            <div className="text-2xl font-black text-white">{activeMatchForPayment.pricePerPlayerGel} {t.common.gel}</div>
            <div className="text-[10px] text-purple-300/80">{t.paymentModal.courtAndBalls}</div>
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
          <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-700/40 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-purple-800/30 pb-2">
              <span className="text-xs font-black text-purple-200 uppercase tracking-wide flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-400" />
                {t.paymentModal.bankDetailsTitle}
              </span>
              <span className="text-[10px] font-bold bg-purple-900/80 px-2 py-0.5 rounded-md text-purple-300">
                Bank of Georgia
              </span>
            </div>

            {/* Recipient Info */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-purple-300/70 font-medium">{t.paymentModal.recipientName}:</span>
              <span className="font-bold text-white">Luca M</span>
            </div>

            {/* IBAN Box with Full-Scale Attached Copy Button */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-purple-300/80 block">
                {t.paymentModal.ibanLabel}:
              </span>
              <div className="rounded-2xl border border-purple-700/50 bg-[#090412] overflow-hidden shadow-inner">
                <div className="p-3.5 text-center sm:text-left font-mono text-sm sm:text-base font-bold text-purple-200 tracking-wider select-all border-b border-purple-900/50">
                  {ibanNumber}
                </div>
                <button
                  onClick={handleCopyIban}
                  className="w-full py-3 px-4 bg-purple-800/70 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
                >
                  {copiedIban ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">{t.paymentModal.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{t.paymentModal.copyIban}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Transaction Description Box with Full-Scale Attached Copy Button */}
            <div className="space-y-1.5 pt-1">
              <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>⚠️ {t.paymentModal.purposeNotice}</span>
              </p>
              
              <div className="rounded-2xl border border-amber-500/40 bg-[#090412] overflow-hidden shadow-inner">
                <div className="p-3.5 text-center sm:text-left font-mono text-sm sm:text-base font-black text-amber-300 tracking-wide select-all border-b border-amber-500/20">
                  {transactionPurpose}
                </div>
                <button
                  onClick={handleCopyPurpose}
                  className="w-full py-3 px-4 bg-amber-500/25 hover:bg-amber-500/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
                >
                  {copiedPurpose ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">{t.paymentModal.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
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
