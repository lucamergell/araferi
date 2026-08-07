import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MatchCard } from './MatchCard';
import { CreateMatchModal } from './CreateMatchModal';
import { ShieldCheck, Award, Plus, Sparkles, Filter } from 'lucide-react';

export const OfficialMatchesView: React.FC = () => {
  const { matches, openMatchDetails, currentUser, firebaseUser } = useApp();
  const { language, t } = useLanguage();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');

  const userEmail = (firebaseUser?.email || currentUser?.email || '').toLowerCase();
  const isAdmin = userEmail === 'luca.mergell@gmail.com' || currentUser?.role === 'admin';

  // Filter for Official matches only (category === 'official' or createdByAdminId or fallback)
  const officialMatches = matches.filter(m => {
    if (m.status === 'Cancelled') return false;
    const isOfficial = m.category === 'official' || (!m.category && m.createdByAdminId);
    if (!isOfficial) return false;

    if (selectedDistrict !== 'All' && m.district !== selectedDistrict) return false;
    if (selectedSkill !== 'All' && m.skillLevelRequired !== selectedSkill) return false;

    return true;
  });

  return (
    <div className="min-h-screen text-white py-8 px-4 sm:px-6 lg:px-8 pb-28 sm:pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Hero Section */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-amber-950/70 via-purple-950/80 to-amber-950/70 border border-amber-500/40 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{language === 'ka' ? 'Padely-ს მატჩები' : 'Padely Platform Matches'}</span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl leading-relaxed">
                {language === 'ka'
                  ? 'Padely-ს ორგანიზებული მატჩები.  გარანტირებული ბურთები, ჩოგნები და ოფიციალური სარეიტინგო ქულები!'
                  : 'Organized matches managed directly by Padely. Equipment included, and official ranking points!'}
              </p>
            </div>

            {/* Admin Create Official Match Button */}
            {isAdmin && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 text-black stroke-[3]" />
                <span>{language === 'ka' ? 'ოფიციალური მატჩის შექმნა' : 'Create Official Match'}</span>
              </button>
            )}
          </div>

          {/* Refund Banner Badge */}
          <div className="mt-6 pt-4 border-t border-amber-500/20 flex flex-wrap items-center gap-4 text-xs text-amber-200/90 font-medium">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.discovery.refundBanner}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-amber-500/30">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'ka' ? 'მოიცავს 4 ჩოგანს & 3 ბურთს' : 'Includes 4 rackets & 3 balls'}</span>
            </div>
          </div>
        </div>

        {/* Filters & Results Counter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-purple-950/30 p-4 rounded-2xl border border-purple-800/30">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>{t.discovery.showing} <strong className="text-white font-extrabold">{officialMatches.length}</strong> {t.discovery.matchesAvailable}</span>
          </div>

          {/* Quick Filter dropdowns */}
          <div className="flex items-center gap-2 text-xs">
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
              <option value="Pro">Pro</option>
            </select>
          </div>
        </div>

        {/* Matches Grid */}
        {officialMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {officialMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onSelectMatch={(m) => openMatchDetails(m.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-3xl p-8 space-y-3 border border-amber-500/20">
            <div className="text-5xl">🏆</div>
            <h3 className="text-xl font-bold text-white">
              {language === 'ka' ? 'ოფიციალური მატჩები ჯერ არ არის' : 'No Official Matches Available'}
            </h3>
            <p className="text-xs text-purple-200/70 max-w-md mx-auto">
              {language === 'ka'
                ? 'ახალი ოფიციალური ტურნირები და მატჩები მალე დაემატება!'
                : 'New platform-organized official events will be published soon.'}
            </p>
          </div>
        )}

      </div>

      {/* Create Official Match Modal */}
      {isCreateModalOpen && (
        <CreateMatchModal
          defaultCategory="official"
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
};
