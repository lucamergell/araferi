import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MatchCard } from './MatchCard';
import { Match } from '../types';
import { ShieldCheck, Calendar, Trophy, Sparkles, MapPin, ArrowRight, Zap, Users2, CheckCircle2 } from 'lucide-react';

export const LandingView: React.FC = () => {
  const { matches, setCurrentView, openMatchDetails, openAuthModal, currentUser } = useApp();
  const { t } = useLanguage();

  const openMatches = matches.filter(m => m.status === 'Open' || m.status === 'Fully Booked').slice(0, 4);

  return (
    <div className="min-h-screen text-white pb-28 sm:pb-24">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Tbilisi Padel Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-purple-200 text-xs font-bold shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{t.landing.badge}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
              {t.landing.titleLine1} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                {t.landing.titleLine2}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-purple-200/90 max-w-2xl mx-auto font-medium leading-relaxed">
              {t.landing.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => setCurrentView('discovery')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:opacity-90 text-white font-bold text-sm shadow-xl shadow-purple-900/50 border border-white/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.landing.browseBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('rankings')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full glass-pill hover:bg-white/15 text-purple-200 hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{t.landing.rankingsBtn}</span>
              </button>
            </div>

            {/* Transparent Refund Policy Highlight Banner */}
            <div className="pt-4 max-w-xl mx-auto">
              <div className="p-4 rounded-3xl glass-card border border-emerald-500/30 flex items-center justify-center gap-3.5 text-left shadow-2xl">
                <div className="w-10 h-10 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-inner">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                    {t.landing.refundTitle}
                  </div>
                  <div className="text-xs text-purple-200/90 font-medium">
                    {t.landing.refundDesc}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="p-6 rounded-3xl glass-card glass-card-hover space-y-3">
            <div className="w-11 h-11 rounded-2xl glass-pill flex items-center justify-center text-purple-300 font-bold text-lg">
              🎾
            </div>
            <h3 className="text-base font-bold text-white">{t.landing.feature1Title}</h3>
            <p className="text-xs text-purple-200/80 leading-relaxed font-medium">
              {t.landing.feature1Desc}
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card glass-card-hover space-y-3">
            <div className="w-11 h-11 rounded-2xl glass-pill flex items-center justify-center text-emerald-300 font-bold text-lg">
              🛡️
            </div>
            <h3 className="text-base font-bold text-white">{t.landing.feature2Title}</h3>
            <p className="text-xs text-purple-200/80 leading-relaxed font-medium">
              {t.landing.feature2Desc}
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card glass-card-hover space-y-3">
            <div className="w-11 h-11 rounded-2xl glass-pill flex items-center justify-center text-amber-300 font-bold text-lg">
              🏆
            </div>
            <h3 className="text-base font-bold text-white">{t.landing.feature3Title}</h3>
            <p className="text-xs text-purple-200/80 leading-relaxed font-medium">
              {t.landing.feature3Desc}
            </p>
          </div>

        </div>
      </section>

      {/* Featured Upcoming Matches Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{t.discovery.title}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h2>
            <p className="text-xs text-purple-300/70 font-medium">
              {t.discovery.subtitle}
            </p>
          </div>

          <button
            onClick={() => setCurrentView('discovery')}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-950/50 hover:bg-purple-900/60 px-3 py-1.5 rounded-xl border border-purple-800/30 transition-all"
          >
            <span>{t.landing.browseBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {openMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSelectMatch={(m) => openMatchDetails(m.id)}
            />
          ))}
        </div>
      </section>

    </div>
  );
};

