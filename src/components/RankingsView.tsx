import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Trophy, Award, Flame, Search, Filter, ArrowUpRight, Medal } from 'lucide-react';
import { formatDisplayName } from '../utils/formatters';

export const RankingsView: React.FC = () => {
  const { users, openUserProfile } = useApp();
  const { t } = useLanguage();

  const [skillFilter, setSkillFilter] = useState<string>('All');
  const [timePeriod, setTimePeriod] = useState<'all' | 'month' | 'week'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter users
  const filteredUsers = users.filter(user => {
    if (skillFilter !== 'All' && user.skillLevel !== skillFilter) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!user.name.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Sort by Padely Points (PP) or Monthly PP
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (timePeriod === 'month') {
      const aMonthly = a.stats.monthlyPadelyPoints ?? 0;
      const bMonthly = b.stats.monthlyPadelyPoints ?? 0;
      if (bMonthly !== aMonthly) return bMonthly - aMonthly;
    }
    const aPP = a.stats.padelyPoints ?? a.stats.skillRating ?? 1000;
    const bPP = b.stats.padelyPoints ?? b.stats.skillRating ?? 1000;
    return bPP - aPP;
  });

  const top1 = sortedUsers[0];
  const top2 = sortedUsers[1];
  const top3 = sortedUsers[2];
  const restUsers = sortedUsers.slice(3);

  return (
    <div className="min-h-screen bg-[#07040d] text-white py-8 px-4 sm:px-6 lg:px-8 pb-28 sm:pb-24">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-bold shadow-xl">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.rankings.officialBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t.rankings.title}
          </h1>
          <p className="text-xs text-purple-300/70">
            {t.rankings.subtitle}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-[#120a21] p-4 rounded-2xl border border-purple-900/40 space-y-3 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.rankings.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-purple-950/50 border border-purple-800/40 text-xs text-white placeholder-purple-400/60 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Time Period Filter */}
            <div className="md:col-span-3 flex items-center bg-purple-950/40 rounded-xl p-1 border border-purple-800/30 text-xs font-semibold">
              <button
                onClick={() => setTimePeriod('all')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${timePeriod === 'all' ? 'bg-purple-600 text-white' : 'text-purple-300/70 hover:text-white'}`}
              >
                {t.rankings.allTime}
              </button>
              <button
                onClick={() => setTimePeriod('month')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${timePeriod === 'month' ? 'bg-purple-600 text-white' : 'text-purple-300/70 hover:text-white'}`}
              >
                {t.rankings.thisMonth}
              </button>
            </div>

            {/* Skill Level Selector */}
            <div className="md:col-span-3">
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-purple-950/50 border border-purple-800/40 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="All">{t.rankings.allSkills}</option>
                <option value="Expert">Expert</option>
                <option value="Pro">Pro Level</option>
                <option value="Advanced">Advanced</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Beginner">Beginner</option>
              </select>
            </div>

          </div>
        </div>

        {/* Top 3 Podium (Visual Showcase) */}
        {sortedUsers.length >= 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 items-end max-w-3xl mx-auto">
            
            {/* 2nd Place Silver */}
            {top2 && (
              <div 
                onClick={() => openUserProfile(top2.id)}
                className="order-2 sm:order-1 glass-card rounded-3xl p-5 border border-purple-800/40 hover:border-purple-500/50 transition-all text-center space-y-3 cursor-pointer shadow-xl relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <Medal className="w-3 h-3 text-slate-800" />
                  <span>{t.rankings.secondPlace}</span>
                </div>
                <img
                  src={top2.avatar}
                  alt={top2.name}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto ring-4 ring-slate-400/50 shadow-xl"
                />
                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-1">{formatDisplayName(top2.name)}</h3>
                </div>
                <div className="p-2 glass-pill rounded-xl">
                  <div className="text-sm font-black text-slate-200">{top2.stats.padelyPoints ?? top2.stats.skillRating ?? 1000} PP</div>
                  <div className="text-[10px] text-purple-300/70">{top2.stats.winPercentage}% {t.rankings.winRate}</div>
                </div>
              </div>
            )}

            {/* 1st Place Gold */}
            {top1 && (
              <div 
                onClick={() => openUserProfile(top1.id)}
                className="order-1 sm:order-2 bg-gradient-to-b from-purple-900/80 via-[#160c2b] to-[#120a21] rounded-3xl p-6 border-2 border-amber-500/60 hover:border-amber-400 transition-all text-center space-y-3 cursor-pointer shadow-2xl relative sm:-translate-y-4"
              >
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xl">
                  <Trophy className="w-3.5 h-3.5 text-amber-900" />
                  <span>{t.rankings.champion}</span>
                </div>
                <img
                  src={top1.avatar}
                  alt={top1.name}
                  className="w-24 h-24 rounded-2xl object-cover mx-auto ring-4 ring-amber-400/70 shadow-2xl"
                />
                <div>
                  <h3 className="font-black text-white text-base line-clamp-1">{formatDisplayName(top1.name)}</h3>
                </div>
                <div className="p-2.5 bg-amber-950/60 rounded-xl border border-amber-500/40">
                  <div className="text-base font-black text-amber-300">{top1.stats.padelyPoints ?? top1.stats.skillRating ?? 1000} PP</div>
                  <div className="text-[10px] text-amber-200/80">{top1.stats.wins} Wins ({top1.stats.winPercentage}%)</div>
                </div>
              </div>
            )}

            {/* 3rd Place Bronze */}
            {top3 && (
              <div 
                onClick={() => openUserProfile(top3.id)}
                className="order-3 glass-card rounded-3xl p-5 border border-purple-800/40 hover:border-purple-500/50 transition-all text-center space-y-3 cursor-pointer shadow-xl relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-700 text-amber-100 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <Medal className="w-3 h-3 text-amber-300" />
                  <span>{t.rankings.thirdPlace}</span>
                </div>
                <img
                  src={top3.avatar}
                  alt={top3.name}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto ring-4 ring-amber-700/50 shadow-xl"
                />
                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-1">{formatDisplayName(top3.name)}</h3>
                </div>
                <div className="p-2 glass-pill rounded-xl">
                  <div className="text-sm font-black text-amber-400">{top3.stats.padelyPoints ?? top3.stats.skillRating ?? 1000} PP</div>
                  <div className="text-[10px] text-purple-300/70">{top3.stats.winPercentage}% {t.rankings.winRate}</div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-[#120a21] rounded-3xl border border-purple-900/40 overflow-hidden shadow-2xl">
          <div className="p-4 bg-purple-950/40 border-b border-purple-900/30 flex items-center justify-between">
            <h3 className="text-xs font-bold text-purple-200 uppercase tracking-wider">
              {t.rankings.playersList} ({sortedUsers.length})
            </h3>
            <span className="text-[10px] text-purple-300/70">{t.rankings.clickToInspect}</span>
          </div>

          <div className="divide-y divide-purple-900/30">
            {sortedUsers.map((user, index) => {
              const rank = index + 1;
              const points = user.stats.padelyPoints ?? user.stats.skillRating ?? 1000;
              return (
                <div
                  key={user.id}
                  onClick={() => openUserProfile(user.id)}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-purple-900/30 transition-colors cursor-pointer"
                >
                  
                  {/* Left Rank & Avatar & Name */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-7 text-center font-black text-sm text-purple-300/80">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                    </div>

                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-600/30"
                    />

                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{formatDisplayName(user.name)}</span>
                        <span className="px-2.5 py-0.5 rounded-full glass-pill text-purple-200 border border-purple-500/30 text-[10px] font-semibold">
                          {user.skillLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Stats: Rating, Win %, Streak */}
                  <div className="flex items-center gap-4 text-right">
                    
                    <div className="hidden sm:block">
                      <div className="text-xs font-bold text-white">{user.stats.wins}W - {user.stats.losses}L</div>
                      <div className="text-[10px] text-purple-300/70">{user.stats.winPercentage}% {t.rankings.winRate}</div>
                    </div>

                    {user.stats.currentStreak > 0 && (
                      <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-amber-950/60 border border-amber-800/40 text-[10px] font-bold text-amber-300">
                        <Flame className="w-3 h-3 text-amber-400" />
                        <span>{user.stats.currentStreak} streak</span>
                      </div>
                    )}

                    <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-800/30 min-w-[80px] text-center">
                      <div className="text-xs font-black text-emerald-400">{points} PP</div>
                      <div className="text-[9px] text-purple-300/60 uppercase font-semibold">{t.rankings.rating}</div>
                    </div>

                    <ArrowUpRight className="w-4 h-4 text-purple-400 opacity-60" />

                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

