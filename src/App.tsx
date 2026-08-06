import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { MobileTabNav } from './components/MobileTabNav';
import { LandingView } from './components/LandingView';
import { OfficialMatchesView } from './components/OfficialMatchesView';
import { PlayerMatchesView } from './components/PlayerMatchesView';
import { MatchDiscoveryView } from './components/MatchDiscoveryView';
import { ProfileView } from './components/ProfileView';
import { RankingsView } from './components/RankingsView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { TermsOfServiceView } from './components/TermsOfServiceView';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { MatchDetailModal } from './components/MatchDetailModal';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingProfileModal } from './components/OnboardingProfileModal';
import { AbstractBackgroundAnimation } from './components/AbstractBackgroundAnimation';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import padelyLogo from './assets/images/Padely.png';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView, notification } = useApp();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#06030c] font-sans antialiased text-white selection:bg-purple-600 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Dynamic Animated Abstract Background */}
      <AbstractBackgroundAnimation />

      <div className="relative flex-1">
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
          {currentView === 'official-matches' && <OfficialMatchesView />}
          {currentView === 'player-matches' && <PlayerMatchesView />}
          {currentView === 'discovery' && <PlayerMatchesView />}
          {currentView === 'profile' && <ProfileView />}
          {currentView === 'rankings' && <RankingsView />}
          {currentView === 'admin' && <AdminDashboardView />}
          {currentView === 'terms' && <TermsOfServiceView />}
          {currentView === 'privacy' && <PrivacyPolicyView />}
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
      <footer className="relative z-10 bg-[#06030d]/80 backdrop-blur-xl border-t border-white/10 pt-8 pb-20 md:pb-8 px-4 sm:px-6 lg:px-8 text-xs text-purple-300/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          
          <div className="flex items-center gap-2.5">
            <img 
              src={padelyLogo} 
              alt="Padely Logo" 
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-purple-400/40 shadow-md" 
            />
            <span className="font-normal text-white text-sm tracking-wider uppercase font-fugaz">PADELY</span>
            <span className="text-purple-400/80">— Organized Padel Matches in Georgia</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setCurrentView('terms');
                window.scrollTo(0, 0);
              }}
              className="text-purple-300/80 hover:text-purple-100 text-xs font-semibold underline underline-offset-4 decoration-purple-500/50 hover:decoration-purple-400 transition-all cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => {
                setCurrentView('privacy');
                window.scrollTo(0, 0);
              }}
              className="text-purple-300/80 hover:text-purple-100 text-xs font-semibold underline underline-offset-4 decoration-purple-500/50 hover:decoration-purple-400 transition-all cursor-pointer"
            >
              Privacy Policy
            </button>
            <div className="text-[11px] text-purple-300/60 font-medium hidden sm:block">
              {t.footer.clubsList}
            </div>
          </div>

        </div>

        {/* Complete Bottom Test Mode Notice */}
        <div className="border-t border-white/5 pt-4 text-center flex items-center justify-center gap-2 text-[11px] font-semibold text-purple-300/80">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>{t.landing.badge}</span>
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
        <Analytics />
      </AppProvider>
    </LanguageProvider>
  );
}


