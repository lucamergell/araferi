import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { X, MapPin, Calendar, Clock, ShieldCheck, Users, CheckCircle2, ChevronRight, Share2, Info } from 'lucide-react';
import { formatDisplayName, getLocalizedMatch } from '../utils/formatters';
import { UserAvatar } from './UserAvatar';

export const MatchDetailModal: React.FC = () => {
  const { 
    matches, 
    selectedMatchId, 
    openMatchDetails, 
    users, 
    currentUser, 
    startJoinMatchFlow, 
    openUserProfile,
    showNotification
  } = useApp();

  const { language, t } = useLanguage();

  if (!selectedMatchId) return null;

  const match = matches.find(m => m.id === selectedMatchId);
  if (!match) return null;

  const localized = getLocalizedMatch(match, language);

  const closeModal = () => openMatchDetails('');

  const joinedPlayers = users.filter(u => match.joinedUserIds.includes(u.id));
  const emptySpotsCount = Math.max(0, match.totalSpots - match.joinedUserIds.length);
  const isUserJoined = currentUser ? match.joinedUserIds.includes(currentUser.id) : false;
  const isFull = match.joinedUserIds.length >= match.totalSpots;
  const isCancelled = match.status === 'Cancelled';

  const shareMatch = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showNotification(t.matchDetails.shareSuccess, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#120a21] border border-purple-800/50 rounded-3xl shadow-2xl my-auto text-white custom-scrollbar">
        
        {/* Header Image Cover */}
        <div className="relative h-48 sm:h-56 w-full">
          <img
            src={match.imageUrl || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800'}
            alt={localized.locationName}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120a21] via-[#120a21]/60 to-transparent"></div>

          {/* Close & Share Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={shareMatch}
              title={t.matchDetails.shareBtn}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeModal}
              title={t.matchDetails.closeBtn}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Location & Title */}
          <div className="absolute bottom-4 left-5 right-5 space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-900/80 text-purple-200 border border-purple-600/40 text-[11px] font-bold">
                {match.district}, {t.matchCard.districtTbilisi}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 text-[11px] font-bold">
                {localized.skillLevel}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {localized.title}
            </h2>
            <p className="text-xs text-purple-200/90 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>{localized.locationName} • {localized.address}</span>
            </p>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6">
          
          {/* Key Match Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-purple-950/40 rounded-2xl border border-purple-800/30">
              <div className="text-[10px] text-purple-300/70 font-semibold uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3 text-purple-400" />
                <span>{t.matchDetails.date}</span>
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {localized.dayOfWeek}, {localized.formattedDate}
              </div>
            </div>

            <div className="p-3 bg-purple-950/40 rounded-2xl border border-purple-800/30">
              <div className="text-[10px] text-purple-300/70 font-semibold uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>{t.matchDetails.timeDuration}</span>
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {match.startTime} ({match.durationMinutes} {t.matchDetails.minutes})
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 bg-purple-950/40 rounded-2xl border border-purple-800/30">
              <div className="text-[10px] text-purple-300/70 font-semibold uppercase">
                {t.matchDetails.feePerPlayer}
              </div>
              <div className="text-sm font-black text-emerald-400 mt-1">
                {match.pricePerPlayerGel} {t.common.gel}
              </div>
            </div>
          </div>

          {/* Participants Spot Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                <span>{t.matchDetails.participants} ({match.joinedUserIds.length}/{match.totalSpots})</span>
              </h4>

              <span className="text-xs text-purple-300/80 font-semibold">
                {emptySpotsCount > 0 ? `${emptySpotsCount} ${t.matchDetails.spotsAvailable}` : t.matchCard.fullyBooked}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {joinedPlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => {
                    closeModal();
                    openUserProfile(player.id);
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/30 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar name={player.name} className="w-10 h-10 rounded-xl text-sm font-bold ring-2 ring-purple-500/40" />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{formatDisplayName(player.name)}</span>
                        {player.id === currentUser?.id && (
                          <span className="text-[10px] text-purple-300 font-normal">({t.common.you})</span>
                        )}
                      </div>
                      <div className="text-[10px] text-purple-300/70">
                        {player.skillLevel} • {player.stats.padelyPoints ?? player.stats.skillRating ?? 1000} PP
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                </div>
              ))}

              {/* Empty spots placeholders */}
              {Array.from({ length: emptySpotsCount }).map((_, i) => (
                <div
                  key={`spot_${i}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-purple-950/20 border-2 border-dashed border-purple-800/30 text-purple-400/60"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-900/20 flex items-center justify-center font-black text-xs">
                    +{i + 1}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-purple-300/70">{t.matchDetails.openSpot}</div>
                    <div className="text-[10px] text-purple-400/50">{t.matchDetails.waitingForPlayer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer Button */}
          <div className="pt-2 flex items-center justify-between gap-4 border-t border-purple-900/30">
            <div>
              <div className="text-[10px] text-purple-300/60 font-semibold uppercase">{t.matchDetails.totalFee}</div>
              <div className="text-2xl font-black text-white">{match.pricePerPlayerGel} {t.common.gel}</div>
            </div>

            {isUserJoined ? (
              <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t.matchDetails.bookedSuccess}</span>
              </div>
            ) : isFull ? (
              <button disabled className="px-6 py-3.5 rounded-2xl bg-zinc-800 text-zinc-400 font-bold text-xs cursor-not-allowed">
                {t.matchDetails.matchFull}
              </button>
            ) : isCancelled ? (
              <button disabled className="px-6 py-3.5 rounded-2xl bg-red-950/80 text-red-400 font-bold text-xs cursor-not-allowed">
                {t.matchDetails.matchCancelled}
              </button>
            ) : (
              <button
                onClick={() => {
                  closeModal();
                  startJoinMatchFlow(match);
                }}
                className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-purple-950/80 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <span>{t.matchDetails.joinMatchBtn} ({match.pricePerPlayerGel} {t.common.gel})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
