import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MatchCard } from './MatchCard';
import { CreateMatchModal } from './CreateMatchModal';
import { Plus, Users, Filter, Sparkles, PhoneCall } from 'lucide-react';

export const PlayerMatchesView: React.FC = () => {
  const { matches, openMatchDetails, currentUser, openAuthModal } = useApp();
  const { language, t } = useLanguage();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Filter for Player matches only (category === 'player' or not official)
  const playerMatches = matches.filter(m => {
    if (m.status === 'Cancelled') return false;
    const isPlayerMatch = m.category === 'player' || (!m.category && !m.createdByAdminId);
    if (!isPlayerMatch) return false;

    if (selectedDistrict !== 'All' && m.district !== selectedDistrict) return false;
    if (selectedSkill !== 'All' && m.skillLevelRequired !== selectedSkill) return false;
    if (selectedType !== 'All' && m.matchType !== selectedType) return false;

    return true;
  });

  const handleCreateMatchClick = () => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    setIsCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen text-white py-8 px-4 sm:px-6 lg:px-8 pb-28 sm:pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Marketplace Header Hero */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-purple-950/80 via-indigo-950/90 to-purple-950/80 border border-purple-500/30 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black uppercase tracking-wider">
                <Users className="w-4 h-4 text-purple-400" />
                <span>{language === 'ka' ? 'მოთამაშეების მატჩები' : 'Community Match Marketplace'}</span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl leading-relaxed">
                {language === 'ka'
                  ? 'შექმენი საკუთარი მატჩი და იპოვე პარტნიორები! ნებისმიერ მოთამაშეს შეუძლია შექმნას მატჩი და შეუერთდეს სხვების შექმნილს.'
                  : 'Organize your own padel match, pick your preferred court and time, and find players! Create a match or join one created by players in Tbilisi.'}
              </p>
            </div>

            {/* Prominent Create Match Button */}
            <button
              onClick={handleCreateMatchClick}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-2xl shadow-purple-900/60 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer uppercase tracking-wider border border-purple-400/40"
            >
              <Plus className="w-5 h-5 text-white stroke-[3]" />
              <span>{language === 'ka' ? 'მატჩის შექმნა' : 'Create Match'}</span>
            </button>
          </div>
        </div>

        {/* Filters & Count */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-purple-950/30 p-4 rounded-2xl border border-purple-800/30">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
            <Filter className="w-4 h-4 text-purple-400" />
            <span>{t.discovery.showing} <strong className="text-white font-extrabold">{playerMatches.length}</strong> {t.discovery.matchesAvailable}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="px-3 py-1.5 bg-purple-950/80 border border-purple-800/50 rounded-xl text-white font-semibold focus:outline-none"
            >
              <option value="All">{language === 'ka' ? 'ყველა უბანი' : 'All Districts'}</option>
              <option value="Lisi">Lisi Lake (ლისი)</option>
              <option value="Vake">Vake (ვაკე)</option>
              <option value="Saburtalo">Saburtalo (საბურთალო)</option>
              <option value="Dighomi">Dighomi (დიღომი)</option>
              <option value="Gldani">Gldani (გლდანი)</option>
            </select>

            <select
              value={selectedSkill}
              onChange={e => setSelectedSkill(e.target.value)}
              className="px-3 py-1.5 bg-purple-950/80 border border-purple-800/50 rounded-xl text-white font-semibold focus:outline-none"
            >
              <option value="All">{language === 'ka' ? 'ყველა დონე' : 'All Skill Levels'}</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Any level">Any level</option>
            </select>

            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="px-3 py-1.5 bg-purple-950/80 border border-purple-800/50 rounded-xl text-white font-semibold focus:outline-none"
            >
              <option value="All">{language === 'ka' ? 'ყველა ტიპი' : 'All Types'}</option>
              <option value="Friendly">Friendly</option>
              <option value="Competitive">Competitive</option>
              <option value="Training">Training</option>
            </select>
          </div>
        </div>

        {/* Player Matches Grid */}
        {playerMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playerMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onSelectMatch={(m) => openMatchDetails(m.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-3xl p-8 space-y-4 border border-purple-800/30">
            <div className="text-5xl">🎾</div>
            <h3 className="text-xl font-bold text-white">
              {language === 'ka' ? 'მოთამაშეთა მატჩები ჯერ არ არის' : 'No Player Matches Found'}
            </h3>
            <p className="text-xs text-purple-200/70 max-w-md mx-auto">
              {language === 'ka'
                ? 'იყავი პირველი! შექმენი შენი მატჩი და იპოვე მოთამაშეები დღესვე.'
                : 'Be the first! Create a match and find padel partners right now.'}
            </p>
            <button
              onClick={handleCreateMatchClick}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ka' ? 'შექმენი ახალი მატჩი' : 'Create New Match'}</span>
            </button>
          </div>
        )}

      </div>

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
