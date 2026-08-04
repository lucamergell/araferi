import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Home, Search, Trophy, User as UserIcon, Shield } from 'lucide-react';

export const MobileTabNav: React.FC = () => {
  const { currentUser, firebaseUser, currentView, setCurrentView, openUserProfile, openAuthModal } = useApp();
  const { t } = useLanguage();

  const userEmail = (firebaseUser?.email || currentUser?.email || '').toLowerCase();
  const isAuthorizedAdmin = userEmail === 'luca.mergell@gmail.com';

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#0d071d]/75 backdrop-blur-2xl border border-white/15 rounded-3xl px-3 py-2 text-white shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => setCurrentView('landing')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            currentView === 'landing' ? 'text-purple-400 font-bold scale-105' : 'text-purple-200/60'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">{t.mobileNav.home}</span>
        </button>

        <button
          onClick={() => setCurrentView('discovery')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            currentView === 'discovery' ? 'text-purple-400 font-bold scale-105' : 'text-purple-200/60'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">{t.mobileNav.matches}</span>
        </button>

        <button
          onClick={() => setCurrentView('rankings')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            currentView === 'rankings' ? 'text-purple-400 font-bold scale-105' : 'text-purple-200/60'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px]">{t.mobileNav.rankings}</span>
        </button>

        {(isAuthorizedAdmin || currentView === 'admin') ? (
          <button
            onClick={() => setCurrentView('admin')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              currentView === 'admin' ? 'text-amber-400 font-bold scale-105' : 'text-amber-300/70'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px]">{t.mobileNav.admin}</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (currentUser) {
                openUserProfile(currentUser.id);
              } else {
                openAuthModal();
              }
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              currentView === 'profile' ? 'text-purple-400 font-bold scale-105' : 'text-purple-200/60'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px]">{currentUser ? t.mobileNav.profile : t.nav.signIn}</span>
          </button>
        )}
      </div>
    </div>
  );
};

