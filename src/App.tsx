import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { MobileTabNav } from './components/MobileTabNav';
import { LandingView } from './components/LandingView';
import { MatchDiscoveryView } from './components/MatchDiscoveryView';
import { ProfileView } from './components/ProfileView';
import { RankingsView } from './components/RankingsView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { MatchDetailModal } from './components/MatchDetailModal';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingProfileModal } from './components/OnboardingProfileModal';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView, notification } = useApp();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#06030c] font-sans antialiased text-white selection:bg-purple-600 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Background Liquid Glass Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-purple-600/30 via-indigo-600/20 to-pink-500/20 blur-[130px] animate-blob-1" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-500/25 via-purple-700/20 to-cyan-500/20 blur-[140px] animate-blob-2" />
        <div className="absolute -bottom-32 left-1/4 w-[30rem] h-[30rem] rounded-full bg-gradient-to-t from-purple-900/30 via-violet-600/15 to-pink-600/15 blur-[150px] animate-blob-1" />
      </div>

      <div className="relative z-10 flex-1">
        {/* Navigation Bar */}
        <Navbar />

        {/* Global Toast Notification */}
        {notification && (
          <div className="fixed top-20 right-4 sm:right-6 z-50 animate-toast-fade pointer-events-none">
            <div className={`px-4 py-2.5 rounded-2xl glass-modal text-xs font-semibold flex items-center gap-2.5 ${
              notification.type === 'success' 
                ? 'text-emerald-300 border-emerald-500/40 shadow-emerald-950/50' 
                : notification.type === 'error'
                ? 'text-red-300 border-red-500/40 shadow-red-950/50'
                : 'text-purple-200 border-purple-400/30 shadow-purple-950/50'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className="tracking-wide">{notification.message}</span>
            </div>
          </div>
        )}

        {/* Active Page View Rendering */}
        <main>
          {currentView === 'landing' && <LandingView />}
          {currentView === 'discovery' && <MatchDiscoveryView />}
          {currentView === 'profile' && <ProfileView />}
          {currentView === 'rankings' && <RankingsView />}
          {currentView === 'admin' && <AdminDashboardView />}
        </main>
      </div>

      {/* Global Modals */}
      <MatchDetailModal />
      <PaymentModal />
      <AuthModal />
      <OnboardingProfileModal />

      {/* Mobile Tab Navigation */}
      <MobileTabNav />

      {/* Footer */}
      <footer className="relative z-10 bg-[#06030d]/80 backdrop-blur-xl border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8 text-xs text-purple-300/60 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-black text-white text-xs shadow-md shadow-purple-900/50">
              P
            </div>
            <span className="font-bold text-white tracking-tight">PADELY TBILISI</span>
            <span>— Organized Padel Matches in Georgia</span>
          </div>

          <div className="flex items-center gap-2 text-purple-200/90 glass-pill px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.footer.refundGuarantee}</span>
          </div>

          <div className="text-[11px] text-purple-300/60 font-medium">
            {t.footer.clubsList}
          </div>

        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </LanguageProvider>
  );
}


