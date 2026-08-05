import React from 'react';
import { Match } from '../types';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Calendar, Clock, ShieldCheck, Users, ChevronRight, CheckCircle2, Image as ImageIcon, Navigation } from 'lucide-react';
import { formatDisplayName, getLocalizedMatch } from '../utils/formatters';
import { UserAvatar } from './UserAvatar';

interface MatchCardProps {
  match: Match;
  onSelectMatch: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onSelectMatch }) => {
  const { users, currentUser, startJoinMatchFlow } = useApp();
  const { language, t } = useLanguage();

  const localized = getLocalizedMatch(match, language);

  const joinedPlayers = users.filter(u => match.joinedUserIds.includes(u.id));
  const emptySpotsCount = Math.max(0, match.totalSpots - match.joinedUserIds.length);
  const isUserJoined = currentUser ? match.joinedUserIds.includes(currentUser.id) : false;
  const isFull = match.joinedUserIds.length >= match.totalSpots;
  const isCancelled = match.status === 'Cancelled';

  const allGalleryImages = [match.imageUrl, ...(match.galleryImageUrls || [])].filter((url): url is string => Boolean(url && url.trim()));

  // Skill badge color styling
  const getSkillBadgeColor = (skill: string) => {
    switch (skill) {
      case 'Beginner': return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30';
      case 'Intermediate': return 'bg-cyan-950/70 text-cyan-300 border-cyan-500/30';
      case 'Advanced': return 'bg-purple-950/70 text-purple-300 border-purple-500/30';
      case 'Pro': return 'bg-amber-950/70 text-amber-300 border-amber-500/30';
      default: return 'bg-zinc-900/70 text-zinc-300 border-zinc-700/30';
    }
  };

  return (
    <div 
      onClick={() => onSelectMatch(match)}
      className="group relative glass-card glass-card-hover rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between cursor-pointer transition-all hover:border-purple-500/50 transform-gpu"
    >
      
      {/* Top Banner & Location Header */}
      <div>
        <div className="relative h-36 w-full overflow-hidden rounded-t-3xl isolate">
          <img
            src={match.imageUrl || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800'}
            alt={localized.locationName}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-85 group-hover:scale-[1.03] transition-all duration-300 ease-out transform-gpu pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e071c] via-[#0e071c]/40 to-transparent"></div>

          {/* District Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 glass-pill px-3 py-1 rounded-full text-[11px] font-semibold text-white">
            <MapPin className="w-3 h-3 text-purple-400" />
            <span>{match.district}, {t.matchCard.districtTbilisi}</span>
          </div>

          {/* Skill Level Badge & Gallery Count Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {allGalleryImages.length > 0 && (
              <div
                className="px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-md shadow-lg"
                title={t.matchCard.viewImages}
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{allGalleryImages.length}</span>
              </div>
            )}

            <div className={`px-3 py-1 rounded-full border text-[11px] font-bold backdrop-blur-md ${getSkillBadgeColor(match.skillLevelRequired)}`}>
              {localized.skillLevel}
            </div>
          </div>

          {/* Match Title & Location */}
          <div className="absolute bottom-2 left-3.5 right-3.5 flex items-end justify-between gap-2">
            <div className="truncate">
              <h3 className="text-base font-bold text-white leading-tight line-clamp-1 group-hover:text-purple-300 transition-colors">
                {localized.title}
              </h3>
              <p className="text-xs text-purple-200/90 font-medium flex items-center gap-1 mt-0.5 truncate">
                <span>📍</span> <span className="truncate">{localized.locationName}</span>
              </p>
            </div>

            {/* Google Maps Link Button */}
            {match.googleMapsUrl && (
              <a
                href={match.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-[10px] font-extrabold flex items-center gap-1 transition-all shrink-0 shadow-md hover:scale-105 cursor-pointer"
                title="Google Maps"
              >
                <Navigation className="w-3 h-3 text-white" />
                <span>{t.matchCard.openMaps || 'Map'}</span>
              </a>
            )}
          </div>
        </div>

        {/* Date & Time Info */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-purple-200/90 glass-pill p-2.5 rounded-2xl">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-semibold text-white">{localized.dayOfWeek}, {localized.formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>{match.startTime} ({match.durationMinutes}m)</span>
            </div>
          </div>

          {/* Joined Players Spot Tracker */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-purple-300/90 font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                {t.matchCard.spots}: <strong className="text-white">{match.joinedUserIds.length}/{match.totalSpots} {t.matchCard.players}</strong>
              </span>
              <span className="text-[11px] font-semibold text-purple-400">
                {emptySpotsCount > 0 ? `${emptySpotsCount} left!` : 'Full'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Joined User Avatars */}
              <div className="flex -space-x-2 overflow-hidden">
                {joinedPlayers.map((player) => (
                  <div key={player.id} title={`${formatDisplayName(player.name)} (${player.skillLevel})`}>
                    <UserAvatar
                      name={player.name}
                      userId={player.id}
                      className="inline-flex h-8 w-8 rounded-full ring-2 ring-purple-500/40 text-xs font-bold"
                    />
                  </div>
                ))}

                {/* Empty Spots Placeholders */}
                {Array.from({ length: emptySpotsCount }).map((_, i) => (
                  <div
                    key={`empty_${i}`}
                    className="h-8 w-8 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-[10px] text-purple-300 font-bold backdrop-blur-sm"
                  >
                    +1
                  </div>
                ))}
              </div>

              {isUserJoined && (
                <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/40 backdrop-blur-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {t.matchCard.joined}
                </span>
              )}
            </div>
          </div>

          {/* Included Equipment Badge */}
          <div className="flex items-center gap-1.5 text-[11px] glass-pill p-2.5 rounded-2xl text-purple-200/90">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="leading-tight">
              <span className="font-semibold text-emerald-300">{t.matchCard.refundGuarantee}</span> {t.matchCard.refundSub}
            </p>
          </div>
        </div>
      </div>

      {/* Price & Full Width Bottom Action Button */}
      <div className="mt-2 space-y-2">
        {/* Price Tag Line */}
        <div className="px-4 flex items-center justify-between text-xs">
          <span className="text-[10px] text-purple-300/70 font-semibold uppercase tracking-wider">{t.matchCard.price}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-white">{match.pricePerPlayerGel} {t.common.gel}</span>
            <span className="text-[10px] text-purple-300/60">/ {t.matchCard.perPlayer}</span>
          </div>
        </div>

        {/* Full-width Join Match Button filling bottom corners */}
        {!isUserJoined && !isFull && !isCancelled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              startJoinMatchFlow(match);
            }}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xl transition-all active:scale-[0.99] cursor-pointer uppercase tracking-wider"
          >
            <span>{t.matchCard.join}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {isUserJoined && (
          <div className="w-full py-3 px-4 bg-emerald-950/90 text-emerald-300 border-t border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t.matchCard.joined}</span>
          </div>
        )}

        {isFull && !isUserJoined && (
          <div className="w-full py-3 px-4 bg-zinc-900/90 text-zinc-400 border-t border-zinc-800 text-xs font-semibold text-center">
            {t.matchCard.fullyBooked}
          </div>
        )}

        {isCancelled && (
          <div className="w-full py-3 px-4 bg-red-950/90 text-red-400 border-t border-red-800/40 text-xs font-semibold text-center">
            {t.matchCard.cancelled}
          </div>
        )}
      </div>

    </div>
  );
};
