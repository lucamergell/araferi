import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Shield, User as UserIcon, Trophy, Calendar, LogIn, LogOut, Globe } from 'lucide-react';
import { formatDisplayName } from '../utils/formatters';
import { UserAvatar } from './UserAvatar';
import padelyLogo from '../assets/images/Padely.png';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    firebaseUser,
    currentView, 
    setCurrentView, 
    openAuthModal, 
    logout, 
    openUserProfile 
  } = useApp();

  const { language, setLanguage, t } = useLanguage();

  const userEmail = (firebaseUser?.email || currentUser?.email || '').toLowerCase();
  const isAuthorizedAdmin = userEmail === 'luca.mergell@gmail.com';

  return (
    <header className="sticky top-0 z-40 bg-[#090514]/70 backdrop-blur-2xl border-b border-white/10 text-white shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="cursor-pointer select-none flex items-center gap-2.5"
        >
          <img 
            src={padelyLogo} 
            alt="Padely Logo" 
            referrerPolicy="no-referrer"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-purple-400/40 shadow-md shadow-purple-900/50" 
          />
          <span className="text-xl font-black tracking-widest text-white hover:text-purple-300 transition-colors uppercase font-anta">
            PADELY.GE
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-purple-950/40 p-1 rounded-xl border border-purple-800/20">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              currentView === 'landing' 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40' 
                : 'text-purple-200/80 hover:text-white hover:bg-purple-900/30'
            }`}
          >
            {t.nav.home}
          </button>
          <button
            onClick={() => setCurrentView('discovery')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
              currentView === 'discovery' 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40' 
                : 'text-purple-200/80 hover:text-white hover:bg-purple-900/30'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {t.nav.matches}
          </button>
          <button
            onClick={() => setCurrentView('rankings')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
              currentView === 'rankings' 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40' 
                : 'text-purple-200/80 hover:text-white hover:bg-purple-900/30'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            {t.nav.rankings}
          </button>
          {(isAuthorizedAdmin || currentView === 'admin') && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                currentView === 'admin' 
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40' 
                  : 'text-amber-300 hover:text-white hover:bg-amber-900/30'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              {t.nav.admin}
            </button>
          )}
        </nav>

        {/* Right Actions / Language Switcher & Auth */}
        <div className="flex items-center gap-2.5">

          {/* Single Flag Emoji Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'ka' ? 'en' : 'ka')}
            className="w-9 h-9 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-white/10 flex items-center justify-center text-lg transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            title={language === 'ka' ? 'Switch to English' : 'გადართვა ქართულზე (Switch to Georgian)'}
          >
            <span>{language === 'ka' ? '🇬🇧' : '🇬🇪'}</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openUserProfile(currentUser.id)}
                title={`${t.nav.profile} (${formatDisplayName(currentUser.name)})`}
                className="w-9 h-9 rounded-xl border border-white/20 transition-all flex items-center justify-center shrink-0 cursor-pointer overflow-hidden shadow-md hover:scale-105"
              >
                <UserAvatar name={currentUser.name} userId={currentUser.id} className="w-full h-full rounded-xl text-xs font-bold" />
              </button>

              <button
                onClick={logout}
                title={t.nav.signOut}
                className="p-2 text-purple-300/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-900/40 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.signIn}</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

