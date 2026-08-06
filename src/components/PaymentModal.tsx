import React, { useState, useEffect } from 'react';
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

  const [paymentOption, setPaymentOption] = useState<'Pay on Court' | 'Bank Transfer'>('Pay on Court');
  const [showBankSubModal, setShowBankSubModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);

  const isOfficial = activeMatchForPayment?.category === 'official';

  useEffect(() => {
    if (activeMatchForPayment && !isOfficial) {
      setPaymentOption('Pay on Court');
      setShowBankSubModal(false);
    }
  }, [activeMatchForPayment, isOfficial]);

  if (!isPaymentModalOpen || !activeMatchForPayment) return null;

  const ibanNumber = 'GE73BG0000000611895381';

  const handleCopyIban = () => {
    navigator.clipboard.writeText(ibanNumber);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleConfirmRegistration = () => {
    setIsProcessing(true);
    setTimeout(() => {
      confirmJoinMatch(paymentOption);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-[#120a21] border border-purple-800/50 rounded-3xl shadow-2xl text-white p-5 sm:p-6 pb-8 sm:pb-6 space-y-5 my-auto custom-scrollbar">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <div>
            <div className="text-[11px] font-normal tracking-wider text-purple-400 uppercase font-fugaz">PADELY</div>
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

        {/* Payment Options */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-purple-200 uppercase tracking-wider block">
            {t.paymentModal.selectMethod}
          </label>

          <div className="space-y-3">
            
            {/* Option 1: Paying by Cash */}
            <div
              onClick={() => setPaymentOption('Pay on Court')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                paymentOption === 'Pay on Court'
                  ? 'bg-purple-900/50 border-purple-400 ring-1 ring-purple-400/50'
                  : 'bg-purple-950/30 border-purple-800/30 hover:bg-purple-900/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-600/30">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">
                      {t.paymentModal.cashOnCourtBtn}
                    </span>
                    <span className="text-[11px] text-purple-300/70">
                      {t.paymentModal.cashNoticeTitle}
                    </span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentOption === 'Pay on Court' ? 'border-purple-400 bg-purple-500' : 'border-purple-600'
                }`}>
                  {paymentOption === 'Pay on Court' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              <p className="text-xs text-purple-200/80 pl-1 leading-relaxed">
                {t.paymentModal.cashNoticeDesc.replace('{{price}}', String(activeMatchForPayment.pricePerPlayerGel))}
              </p>
            </div>

            {/* Option 2: Transfer with Bank of Georgia Button (Official Matches Only) */}
            {isOfficial && (
              <button
                onClick={() => {
                  setPaymentOption('Bank Transfer');
                  setShowBankSubModal(true);
                }}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-orange-950/60 via-purple-950/80 to-purple-900/50 hover:from-orange-900/60 hover:to-purple-800/60 border border-orange-500/40 text-left transition-all cursor-pointer flex items-center justify-between shadow-lg active:scale-[0.99] group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-amber-200 block group-hover:text-amber-100 transition-colors">
                      {t.paymentModal.bankTransferBtn}
                    </span>
                    <span className="text-[11px] text-purple-300/70">
                      {t.paymentModal.clickToViewIban}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-300 bg-orange-950/80 border border-orange-500/40 px-3 py-1.5 rounded-xl shrink-0 group-hover:bg-orange-900/80">
                  IBAN 📋
                </span>
              </button>
            )}

          </div>
        </div>

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

      {/* Sub-Modal / Second Popup: Bank of Georgia IBAN Transfer Details */}
      {showBankSubModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#160c2b] border border-orange-500/50 rounded-3xl shadow-2xl text-white p-6 space-y-5 animate-scaleUp my-auto max-h-[90vh] overflow-y-auto">
            
            {/* Sub-Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-800/40 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {t.paymentModal.bankModalTitle}
                  </h3>
                  <p className="text-[10px] text-purple-300/70">
                    Bank of Georgia
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowBankSubModal(false)}
                className="p-1.5 rounded-full bg-purple-950/80 hover:bg-purple-900 text-purple-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Details */}
            <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-800/40 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-purple-300/70 font-medium">{t.paymentModal.recipientName}:</span>
                <span className="font-bold text-white">Luca M.</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-purple-300/70 font-medium">{t.paymentModal.bankName}:</span>
                <span className="font-bold text-orange-300">Bank of Georgia</span>
              </div>
            </div>

            {/* IBAN Box with Copy Button */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-200 block">
                {t.paymentModal.ibanLabel}
              </span>
              <div className="rounded-2xl border border-purple-700/60 bg-[#090412] overflow-hidden shadow-inner">
                <div className="p-4 text-center font-mono text-base sm:text-lg font-black text-purple-200 tracking-wider select-all border-b border-purple-900/60">
                  {ibanNumber}
                </div>
                <button
                  onClick={handleCopyIban}
                  className="w-full py-3.5 px-4 bg-purple-800 hover:bg-purple-700 text-white text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
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

            {/* Done / Finish Sub-Modal Button */}
            <button
              onClick={() => setShowBankSubModal(false)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm transition-all cursor-pointer shadow-lg border border-purple-400/40 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{t.paymentModal.finishBtn || t.common.finish || 'დასრულება'}</span>
            </button>

          </div>
        </div>
      )}
    </div>
  );
};
