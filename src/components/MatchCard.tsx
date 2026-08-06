import React, { useState } from 'react';
import { Match } from '../types';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Calendar, Clock, ShieldCheck, Users, ChevronRight, CheckCircle2, Image as ImageIcon, Navigation, Phone, Award, User as UserIcon, Pencil, Trash2 } from 'lucide-react';
import { formatDisplayName, getLocalizedMatch } from '../utils/formatters';
import { UserAvatar } from './UserAvatar';
import { CreateMatchModal } from './CreateMatchModal';

interface MatchCardProps {
  match: Match;
  onSelectMatch: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onSelectMatch }) => {
  const { users, currentUser, firebaseUser, deleteMatch, startJoinMatchFlow } = useApp();
  const { language, t } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);

  const localized = getLocalizedMatch(match, language);

  const isOfficial = match.category === 'official' || (!match.category && match.createdByAdminId);
  const joinedPlayers = users.filter(u => match.joinedUserIds.includes(u.id));
  const emptySpotsCount = Math.max(0, match.totalSpots - match.joinedUserIds.length);
  const isUserJoined = currentUser ? match.joinedUserIds.includes(currentUser.id) : false;
  const isFull = match.joinedUserIds.length >= match.totalSpots;
  const isCancelled = match.status === 'Cancelled';

  const userEmail = (firebaseUser?.email || currentUser?.email || '').toLowerCase();
  const isAdmin = currentUser?.role === 'admin' || userEmail === 'luca.mergell@gmail.com';
  const isCreator = Boolean(
    currentUser && (
      (match.creatorId && match.creatorId === currentUser.id) ||
      (match.createdByAdminId && match.createdByAdminId === currentUser.id) ||
      (firebaseUser && match.creatorId === firebaseUser.uid) ||
      (match.creatorName && currentUser.name && match.creatorName.trim().toLowerCase() === currentUser.name.trim().toLowerCase()) ||
      (match.joinedUserIds && match.joinedUserIds.length > 0 && match.joinedUserIds[0] === currentUser.id)
    )
  );
  const canManage = isCreator || isAdmin;

  const allGalleryImages = [match.imageUrl, ...(match.galleryImageUrls || [])].filter((url): url is string => Boolean(url && url.trim()));

  // Skill badge color styling
  const getSkillBadgeColor = (skill: string) => {
    switch (skill) {
      case 'Beginner': return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'Intermediate': return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
      case 'Advanced': return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
      case 'Pro': return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      default: return 'bg-zinc-900/80 text-zinc-300 border-zinc-700/40';
    }
  };

  const creatorUser = match.creatorId ? users.find(u => u.id === match.creatorId) : null;
  const creatorName = match.creatorName || creatorUser?.name || 'Player';
  const creatorPhone = match.creatorPhone || creatorUser?.phoneNumber;

  return (
    <div 
      onClick={() => onSelectMatch(match)}
      className={`group relative glass-card glass-card-hover rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between cursor-pointer transition-all transform-gpu ${
        isOfficial 
          ? 'border border-amber-500/40 hover:border-amber-400/80 shadow-amber-950/20' 
          : 'border border-purple-800/40 hover:border-purple-500/60 shadow-purple-950/20'
      }`}
    >
      
      {/* Top Banner & Location Header */}
      <div>
        <div className="relative h-36 w-full overflow-hidden rounded-t-3xl isolate">
          <img
            src={match.imageUrl || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800'}
            alt={localized.locationName}
            className="w-full h-full object-cover opacity-75 group-hover:opacity-85 group-hover:scale-[1.03] transition-all duration-300 ease-out transform-gpu pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e071c] via-[#0e071c]/40 to-transparent"></div>

          {/* Official vs Player Match Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {isOfficial ? (
              <div className="px-3 py-1 rounded-full bg-amber-500 text-black text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-amber-900/50">
                <Award className="w-3.5 h-3.5 text-black" />
                <span>{language === 'ka' ? 'Padely' : 'Padely'}</span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-full bg-purple-900/80 border border-purple-400/50 text-purple-200 text-[11px] font-bold flex items-center gap-1 backdrop-blur-md shadow-md">
                <UserIcon className="w-3.5 h-3.5 text-purple-300" />
                <span>{language === 'ka' ? 'მოთამაშის' : 'Player Match'}</span>
              </div>
            )}
          </div>

          {/* Skill Level Badge & Gallery Count Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {canManage && (
              <div className="flex items-center gap-1 mr-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="p-1.5 rounded-full bg-purple-900/90 hover:bg-purple-600 text-white border border-purple-400/50 backdrop-blur-md transition-all cursor-pointer shadow-lg"
                  title={language === 'ka' ? 'მატჩის რედაქტირება' : 'Edit Match'}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(language === 'ka' ? 'დარწმუნებული ხართ რომ გსურთ მატჩის წაშლა?' : 'Are you sure you want to delete this match?')) {
                      deleteMatch(match.id);
                    }
                  }}
                  className="p-1.5 rounded-full bg-red-950/90 hover:bg-red-800 text-red-200 border border-red-500/50 backdrop-blur-md transition-all cursor-pointer shadow-lg"
                  title={language === 'ka' ? 'მატჩის წაშლა' : 'Delete Match'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
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
                <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                <span className="truncate">{localized.locationName} ({localized.district || match.district})</span>
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

        {/* Creator Header (for Player Created Matches) */}
        {!isOfficial && (
          <div className="px-4 pt-3 pb-1 flex items-center justify-between border-b border-purple-900/30 text-xs">
            <div className="flex items-center gap-2">
              <UserAvatar
                name={creatorName}
                userId={match.creatorId || 'creator'}
                className="w-7 h-7 rounded-full text-[10px] font-bold ring-2 ring-purple-500/50"
              />
              <div>
                <span className="text-[10px] text-purple-300/70 block leading-none">{language === 'ka' ? 'შექმნილია:' : 'Created by:'}</span>
                <span className="font-bold text-white text-xs">{formatDisplayName(creatorName)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Host Phone Action */}
              {creatorPhone ? (
                <a
                  href={`tel:${creatorPhone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-2.5 py-1 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-500/40 text-emerald-300 hover:text-emerald-200 text-[11px] font-extrabold flex items-center gap-1.5 transition-all shadow-sm"
                  title={language === 'ka' ? `დარეკვა: ${creatorPhone}` : `Call Host: ${creatorPhone}`}
                >
                  <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{creatorPhone}</span>
                </a>
              ) : null}

              {/* Creator/Admin Actions */}
              {canManage && (
                <div className="flex items-center gap-1 border-l border-purple-800/40 pl-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="p-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 transition-all cursor-pointer"
                    title={language === 'ka' ? 'მატჩის რედაქტირება' : 'Edit Match'}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(language === 'ka' ? 'დარწმუნებული ხართ რომ გსურთ მატჩის წაშლა?' : 'Are you sure you want to delete this match?')) {
                        deleteMatch(match.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-800 text-red-300 hover:text-white border border-red-500/40 transition-all cursor-pointer"
                    title={language === 'ka' ? 'მატჩის წაშლა' : 'Delete Match'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

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
                <strong className="text-white">{match.joinedUserIds.length}/{match.totalSpots} {t.matchCard.players}</strong>
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

      {/* Edit Match Modal */}
      {isEditing && (
        <CreateMatchModal
          matchToEdit={match}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};
