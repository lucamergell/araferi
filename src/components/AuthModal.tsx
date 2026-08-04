import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { X, ShieldCheck } from 'lucide-react';
import padelyLogo from '../assets/images/Padely.png';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle } = useApp();
  const { t } = useLanguage();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#120a21] border border-purple-800/50 rounded-3xl shadow-2xl overflow-hidden text-white p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <div className="flex items-center gap-3">
            <img 
              src={padelyLogo} 
              alt="Padely Logo" 
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-purple-400/40 shadow-lg shadow-purple-950/60" 
            />
            <div>
              <h3 className="text-lg font-black text-white">{t.authModal.title}</h3>
              <p className="text-xs text-purple-300/70">{t.authModal.subtitle}</p>
            </div>
          </div>

          <button onClick={closeAuthModal} className="p-2 rounded-full bg-purple-950/50 text-purple-300 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Highlight */}
        <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/20 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.authModal.googleSignIn}</span>
          </div>
          <p className="text-purple-200/80 leading-relaxed">
            {t.authModal.googleDesc}
          </p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={() => loginWithGoogle()}
          className="w-full py-3.5 px-4 rounded-2xl bg-white text-zinc-950 font-bold text-xs flex items-center justify-center gap-3 hover:bg-purple-100 transition-all shadow-xl active:scale-95 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{t.authModal.continueWithGoogle}</span>
        </button>

      </div>
    </div>
  );
};
