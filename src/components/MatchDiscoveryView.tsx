import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MatchCard } from './MatchCard';
import { ShieldCheck } from 'lucide-react';

export const MatchDiscoveryView: React.FC = () => {
  const { matches, openMatchDetails } = useApp();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen text-white py-8 px-4 sm:px-6 lg:px-8 pb-28 sm:pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>{t.discovery.title}</span>
              <span className="text-xs px-3 py-1 rounded-full glass-pill text-purple-200 font-bold border border-white/15">
                {t.discovery.cityBadge}
              </span>
            </h1>
            <p className="text-xs text-purple-200/80 font-medium mt-1">
              {t.discovery.subtitle}
            </p>
          </div>

          {/* Refund Notice Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-emerald-500/40 text-xs text-purple-100 shadow-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.discovery.refundBanner}</span>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-purple-200/80 px-1 font-medium">
          <span>{t.discovery.showing} <strong className="text-white font-bold">{matches.length}</strong> {t.discovery.matchesAvailable}</span>
          <span>{t.discovery.currencyNote}</span>
        </div>

        {/* Matches Grid */}
        {matches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onSelectMatch={(m) => openMatchDetails(m.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-3xl p-8 space-y-3">
            <div className="text-4xl">🎾</div>
            <h3 className="text-lg font-bold text-white">{t.discovery.noMatches}</h3>
            <p className="text-xs text-purple-200/70 max-w-sm mx-auto">
              {t.discovery.noMatchesSub}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

