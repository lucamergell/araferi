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
      
      {/* Hero Section Header */}
      <section className="relative overflow-hidden pt-8 pb-6 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
              {t.landing.titleLine1} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                {t.landing.titleLine2}
              </span>
            </h1>

            {/* Info Disclaimer Subtext */}
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/30 border border-purple-800/25 text-purple-300/80 text-xs font-normal tracking-wide backdrop-blur-sm">
              <span>Padely აკავშირებს მოთამაშეებს ღია თამაშებში და არ არის დაკავშირებული კლუბებთან.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Matches Section - Directly Under Title */}
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
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-950/50 hover:bg-purple-900/60 px-3 py-1.5 rounded-xl border border-purple-800/30 transition-all cursor-pointer"
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

      {/* Feature Pillars Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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

      {/* Refund Policy Guarantee Box at the Bottom of the Page */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
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
      </section>

    </div>
  );
};

