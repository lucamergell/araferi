import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { EditProfileModal } from './EditProfileModal';
import { MatchCard } from './MatchCard';
import { formatDisplayName } from '../utils/formatters';
import { UserAvatar } from './UserAvatar';
import { 
  Trophy, MapPin, Calendar, Flame, Clock, Users, ShieldCheck, 
  Award, TrendingUp, CheckCircle2, XCircle, Settings, Edit3, Target, PlusCircle
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { users, matches, selectedProfileUserId, currentUser, openUserProfile, openMatchDetails } = useApp();
  const { language, t } = useLanguage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const profileUser = users.find(u => u.id === selectedProfileUserId) || currentUser || users[1];

  if (!profileUser) return null;

  const isOwnProfile = currentUser?.id === profileUser.id;

  const isPlaceholderUser = profileUser.isPlaceholder || profileUser.id.startsWith('ph_') || profileUser.id.startsWith('placeholder_') || profileUser.email?.endsWith('@placeholder.padely.ge');

  const realUsersSorted = users
    .filter(u => !u.isPlaceholder && !u.id.startsWith('ph_') && !u.id.startsWith('placeholder_') && !u.email?.endsWith('@placeholder.padely.ge'))
    .sort((a, b) => (b.stats?.padelyPoints ?? b.stats?.skillRating ?? 1000) - (a.stats?.padelyPoints ?? a.stats?.skillRating ?? 1000));

  const userRankIdx = realUsersSorted.findIndex(u => u.id === profileUser.id);
  const displayRank = isPlaceholderUser ? '-' : (userRankIdx >= 0 ? userRankIdx + 1 : (profileUser.stats.rankingPosition || 1));

  const stats = profileUser.stats;

  const createdMatches = matches.filter(
    m => m.creatorId === profileUser.id || 
         m.createdByAdminId === profileUser.id ||
         (m.creatorName && profileUser.name && m.creatorName.trim().toLowerCase() === profileUser.name.trim().toLowerCase()) ||
         (m.joinedUserIds && m.joinedUserIds.length > 0 && m.joinedUserIds[0] === profileUser.id)
  );

  return (
    <div className="min-h-screen text-white py-8 px-4 sm:px-6 lg:px-8 pb-28 sm:pb-24">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Profile Header Banner (Strava style) */}
        <div className="relative rounded-3xl glass-card overflow-hidden shadow-2xl border border-white/10">
          
          {/* Cover Header */}
          <div className="h-36 sm:h-48 w-full bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-pink-950/80 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.35),transparent)]"></div>
            
            {/* Rank Position Badge */}
            {!isPlaceholderUser && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-xs font-bold text-amber-300 shadow-xl border border-amber-500/30">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{t.profile.rankBadge} #{displayRank}</span>
              </div>
            )}
          </div>

          {/* Avatar & Main Info */}
          <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <UserAvatar
                name={profileUser.name}
                userId={profileUser.id}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl ring-4 ring-[#07040d] shadow-2xl border-2 border-purple-400/60 text-4xl sm:text-5xl font-black"
              />

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {formatDisplayName(profileUser.name)}
                  </h1>
                  <span className="px-3 py-0.5 rounded-full glass-pill text-purple-200 border border-purple-400/40 text-xs font-bold">
                    {profileUser.skillLevel}
                  </span>
                  {profileUser.role === 'admin' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                      Admin
                    </span>
                  )}
                </div>

                <p className="text-xs text-purple-200/90 font-medium flex items-center gap-3 flex-wrap">
                  {typeof profileUser.age === 'number' && profileUser.age > 0 ? (
                    <>
                      <span>{profileUser.age} y/o</span>
                      <span>•</span>
                    </>
                  ) : null}
                  <span className="text-emerald-400 font-bold">{t.profile.ratingLabel}: {stats.padelyPoints ?? stats.skillRating ?? 1000} PP</span>
                  {profileUser.createdAt && (
                    <>
                      <span>•</span>
                      <span className="text-amber-300 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-amber-400 inline" />
                        Member since {new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Actions */}
            {isOwnProfile && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2.5 rounded-full glass-pill hover:bg-white/15 text-xs font-bold text-white flex items-center gap-2 transition-all self-start sm:self-auto border border-white/20"
              >
                <Edit3 className="w-4 h-4 text-purple-300" />
                <span>{t.profile.editProfile}</span>
              </button>
            )}

          </div>

          {/* Playing Preferences Bar */}
          <div className="px-6 py-4 bg-white/5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-purple-300 font-bold">{t.profile.position}:</span>
              <span className="glass-pill px-3 py-1 rounded-full text-white font-semibold">
                {profileUser.preferredPosition}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-purple-300 font-bold">{t.profile.favPartner}:</span>
              <span className="glass-pill px-3 py-1 rounded-full text-white font-semibold">
                {formatDisplayName(stats.favoritePartner) || 'N/A'}
              </span>
            </div>
          </div>

        </div>

        {/* Player Statistics Grid */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span>{t.profile.statsHeader}</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Total Matches */}
            <div className="p-4 rounded-3xl glass-card space-y-1">
              <div className="text-[10px] text-purple-300/70 font-semibold uppercase">{t.profile.totalMatches}</div>
              <div className="text-2xl font-black text-white">{stats.totalMatches}</div>
              <div className="text-[10px] text-purple-300/60">{stats.matchesThisMonth} matches this month</div>
            </div>

            {/* Wins & Losses */}
            <div className="p-4 rounded-3xl glass-card space-y-1">
              <div className="text-[10px] text-purple-300/70 font-semibold uppercase">{t.profile.winLoss}</div>
              <div className="text-2xl font-black text-white flex items-baseline gap-1.5">
                <span className="text-emerald-400">{stats.wins}W</span>
                <span className="text-xs text-purple-400">-</span>
                <span className="text-red-400">{stats.losses}L</span>
              </div>
              <div className="text-[10px] text-purple-300/60">Competitive court results</div>
            </div>

            {/* Win Percentage Gauge */}
            <div className="p-4 rounded-3xl glass-card space-y-1">
              <div className="text-[10px] text-purple-300/70 font-semibold uppercase">{t.profile.winRate}</div>
              <div className="text-2xl font-black text-indigo-300">{stats.winPercentage}%</div>
              <div className="w-full bg-white/10 rounded-full h-1.5 mt-1 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full" style={{ width: `${stats.winPercentage}%` }}></div>
              </div>
            </div>

            {/* Current Win Streak */}
            <div className="p-4 rounded-3xl glass-card space-y-1">
              <div className="text-[10px] text-purple-300/70 font-semibold uppercase flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>{t.profile.winStreak}</span>
              </div>
              <div className="text-2xl font-black text-amber-400">{stats.currentStreak} 🔥</div>
              <div className="text-[10px] text-purple-300/60">Longest streak: {stats.longestStreak} games</div>
            </div>

            {/* Hours Played */}
            <div className="p-4 rounded-3xl glass-card space-y-1">
              <div className="text-[10px] text-purple-300/70 font-semibold uppercase">{t.profile.courtTime}</div>
              <div className="text-2xl font-black text-white">{stats.hoursPlayed} hrs</div>
              <div className="text-[10px] text-purple-300/60">On court in Tbilisi</div>
            </div>

            {/* Padely Points */}
            <div className="p-4 rounded-3xl glass-card space-y-1">
              <div className="text-[10px] text-purple-300/70 font-semibold uppercase">{t.profile.ratingLabel}</div>
              <div className="text-2xl font-black text-emerald-400">{stats.padelyPoints ?? stats.skillRating ?? 1000} PP</div>
              <div className="text-[10px] text-purple-300/60">Highest: {stats.highestPadelyPoints ?? 1000} PP</div>
            </div>

            {/* Ranking Position */}
            <div className="p-4 rounded-3xl glass-card space-y-1">
              <div className="text-[10px] text-purple-300/70 font-semibold uppercase">{t.profile.leaderboardPos}</div>
              <div className="text-2xl font-black text-amber-300">#{stats.rankingPosition}</div>
              <div className="text-[10px] text-purple-300/60">Out of {users.length} registered players</div>
            </div>

            {/* Matches this Month */}
            <div className="p-4 rounded-3xl glass-card space-y-1">
              <div className="text-[10px] text-purple-300/70 font-semibold uppercase">{t.profile.thisMonth}</div>
              <div className="text-2xl font-black text-white">{stats.matchesThisMonth}</div>
              <div className="text-[10px] text-purple-300/60">Active monthly matches</div>
            </div>

          </div>
        </div>

        {/* Created Matches Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-purple-400" />
              <span>{t.profile.createdMatches || (language === 'ka' ? 'შექმნილი მატჩები' : 'Created Matches')}</span>
            </h2>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-700/40 text-purple-300">
              {createdMatches.length}
            </span>
          </div>

          {createdMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {createdMatches.map(match => (
                <MatchCard key={match.id} match={match} onSelectMatch={openMatchDetails} />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-[#120a21] rounded-2xl border border-purple-900/30 text-xs text-purple-300/70">
              <p>{t.profile.noCreatedMatches || (language === 'ka' ? 'შექმნილი მატჩები არ არის' : 'No created matches yet.')}</p>
            </div>
          )}
        </div>

        {/* Match History */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>{t.profile.matchHistory}</span>
          </h2>

          {profileUser.matchHistory && profileUser.matchHistory.length > 0 ? (
            <div className="space-y-2.5">
              {profileUser.matchHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#120a21] border border-purple-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-700/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        item.result === 'Win' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {item.result}
                      </span>
                      <span className="text-xs font-bold text-white">{item.matchTitle}</span>
                      {item.isRanked && item.pointsEarned !== undefined && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.pointsEarned > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' : 'bg-red-950 text-red-300 border border-red-700/50'}`}>
                          {item.pointsEarned > 0 ? `+${item.pointsEarned}` : item.pointsEarned} PP
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-purple-300/70 flex items-center gap-3">
                      <span>📍 {item.locationName}</span>
                      <span>•</span>
                      <span>Partner: {formatDisplayName(item.partnerName)}</span>
                      <span>•</span>
                      <span>vs {item.opponents}</span>
                    </div>
                  </div>

                  <div className="text-right flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-xs font-bold text-purple-200 font-mono bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/30">
                      {item.score}
                    </div>
                    <div className="text-[10px] text-purple-300/60">
                      {item.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[#120a21] rounded-2xl border border-purple-900/30 text-xs text-purple-300/70 space-y-2">
              <p>{t.profile.noMatchHistory}</p>
              <p className="text-[11px] text-purple-400">{t.profile.noHistorySub}</p>
            </div>
          )}
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          user={profileUser}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

