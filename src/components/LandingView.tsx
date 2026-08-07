import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MatchCard } from './MatchCard';
import { CreateMatchModal } from './CreateMatchModal';
import { Match } from '../types';
import { ShieldCheck, Calendar, Trophy, Sparkles, MapPin, ArrowRight, Zap, Users2, Plus, Filter, Clock } from 'lucide-react';

export const LandingView: React.FC = () => {
  const { matches, setCurrentView, openMatchDetails, openAuthModal, currentUser } = useApp();
  const { language, t } = useLanguage();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'official' | 'player'>('all');

  // Display ALL matches (both open and official), sorted by nearest date & time
  const filteredAndSortedMatches = useMemo(() => {
    return matches
      .filter(m => {
        if (m.status === 'Cancelled') return false;
        if (filterCategory === 'official') {
          return m.category === 'official' || (!m.category && m.createdByAdminId);
        }
        if (filterCategory === 'player') {
          return m.category === 'player' || (!m.category && !m.createdByAdminId);
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(`${a.date}T${a.startTime || '00:00'}`).getTime();
        const timeB = new Date(`${b.date}T${b.startTime || '00:00'}`).getTime();
        return timeA - timeB;
      });
  }, [matches, filterCategory]);

  const handleCreateMatchClick = () => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    setIsCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen text-white pb-28 sm:pb-24">
      
      {/* Hero Section Header */}
      <section className="relative overflow-hidden pt-12 pb-10 px-4 sm:px-6 lg:px-8 border-b border-purple-500/20">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/websitepgpadely.png"
            alt="Padely Background"
            className="w-full h-full object-cover object-center opacity-85 saturate-110 filter brightness-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d061a]/30 via-[#0d061a]/50 to-[#0d061a]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
              {t.landing.titleLine1} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                {t.landing.titleLine2}
              </span>
            </h1>

            {/* Hero Quick Navigation Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={handleCreateMatchClick}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer uppercase tracking-wider border border-purple-400/40"
              >
                <Plus className="w-4.5 h-4.5 text-white stroke-[3]" />
                <span>{t.nav.createMatch}</span>
              </button>

              <button
                onClick={() => setCurrentView('official-matches')}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
              >
                <Trophy className="w-4 h-4 text-black" />
                <span>{t.nav.officialMatches}</span>
              </button>

              <button
                onClick={() => setCurrentView('player-matches')}
                className="px-5 py-3 rounded-2xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-800/40"
              >
                <Users2 className="w-4 h-4 text-purple-300" />
                <span>{t.nav.playerMatches}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured All Matches Section - Filtered by Nearest Date */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{language === 'ka' ? 'ყველა მატჩი' : 'All Matches'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h2>
            <p className="text-xs text-purple-300/80 font-medium flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-green-400" />
              <span>{language === 'ka' ? 'დალაგებულია უახლოესი თარიღის მიხედვით' : 'Sorted by nearest date & time'}</span>
            </p>
          </div>

          {/* Quick Category Filter Buttons */}
          <div className="flex items-center gap-2 bg-purple-950/40 p-1.5 rounded-2xl border border-purple-800/30 text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              {language === 'ka' ? 'ყველა' : 'All'} ({matches.filter(m => m.status !== 'Cancelled').length})
            </button>
            <button
              onClick={() => setFilterCategory('official')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterCategory === 'official'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-amber-300 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <Trophy className="w-3 h-3" />
              <span>{language === 'ka' ? 'ოფიციალური' : 'Official'}</span>
            </button>
            <button
              onClick={() => setFilterCategory('player')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterCategory === 'player'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <Users2 className="w-3 h-3" />
              <span>{language === 'ka' ? 'მოთამაშეების' : 'Player Matches'}</span>
            </button>
          </div>
        </div>

        {/* Matches Grid */}
        {filteredAndSortedMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onSelectMatch={(m) => openMatchDetails(m.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-3xl p-8 space-y-3 border border-purple-800/30">
            <div className="text-5xl">🎾</div>
            <h3 className="text-xl font-bold text-white">
              {language === 'ka' ? 'მატჩები არ მოიძებნა' : 'No Matches Found'}
            </h3>
            <p className="text-xs text-purple-200/70 max-w-md mx-auto">
              {language === 'ka'
                ? 'შექმენით ახალი მატჩი და მოიწვიეთ მოთამაშეები!'
                : 'Create a new match and invite players!'}
            </p>
            <button
              onClick={handleCreateMatchClick}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ka' ? 'მატჩის შექმნა' : 'Create Match'}</span>
            </button>
          </div>
        )}

        {/* Info Disclaimer Subtext under match section */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/30 border border-purple-800/25 text-purple-300/80 text-xs font-normal tracking-wide backdrop-blur-sm">
            <span>Padely აკავშირებს მოთამაშეებს ღია თამაშებში და არ არის დაკავშირებული კლუბებთან.</span>
          </div>
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

      {/* Create Match Modal */}
      {isCreateModalOpen && (
        <CreateMatchModal
          defaultCategory="player"
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

    </div>
  );
};


