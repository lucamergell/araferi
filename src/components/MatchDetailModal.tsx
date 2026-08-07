import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { X, MapPin, Calendar, Clock, ShieldCheck, Users, CheckCircle2, ChevronRight, Share2, Info, UserPlus, Trash2, Bot, Power, Image as ImageIcon, Navigation, Phone, Pencil } from 'lucide-react';
import { formatDisplayName, getLocalizedMatch } from '../utils/formatters';
import { UserAvatar } from './UserAvatar';
import { MatchGalleryModal } from './MatchGalleryModal';
import { CreateMatchModal } from './CreateMatchModal';

export const MatchDetailModal: React.FC = () => {
  const { 
    matches, 
    selectedMatchId, 
    openMatchDetails, 
    users, 
    currentUser,
    firebaseUser, 
    startJoinMatchFlow, 
    openUserProfile,
    showNotification,
    addPlaceholderPlayer,
    fillMatchWithPlaceholders,
    adminAssignPlayerToMatch,
    removePlayerFromMatch,
    clearPlaceholdersFromMatch,
    activateMatch,
    deactivateMatch,
    deleteMatch
  } = useApp();

  const [selectedAssignUserId, setSelectedAssignUserId] = useState<string>('');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const creatorUser = match.creatorId ? users.find(u => u.id === match.creatorId) : null;
  const creatorPhone = match.creatorPhone || creatorUser?.phoneNumber;
  const isOfficial = match.category === 'official' || (!match.category && match.createdByAdminId);

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

  const shareMatch = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showNotification(t.matchDetails.shareSuccess, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-[#120a21] border border-purple-800/50 rounded-2xl sm:rounded-3xl shadow-2xl my-auto text-white custom-scrollbar pb-8 sm:pb-4">
        
        {/* Header Image Cover */}
        <div className="relative h-44 sm:h-56 w-full shrink-0">
          <img
            src={match.imageUrl || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800'}
            alt={localized.locationName}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120a21] via-[#120a21]/60 to-transparent"></div>

          {/* Top Control Bar: View Images, Share & Close */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between gap-2 pointer-events-none">
            {allGalleryImages.length > 0 ? (
              <button
                type="button"
                onClick={() => setIsGalleryOpen(true)}
                className="pointer-events-auto px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/70 hover:bg-purple-600 border border-white/20 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              >
                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>{t.matchDetails.viewImages} ({allGalleryImages.length})</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
              {canManage && (
                <>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    title={language === 'ka' ? 'მატჩის რედაქტირება' : 'Edit Match'}
                    className="px-2.5 sm:px-3 py-1.5 rounded-full bg-purple-900/90 hover:bg-purple-700 text-white border border-purple-400/50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg hover:scale-105"
                  >
                    <Pencil className="w-3.5 h-3.5 text-purple-200" />
                    <span className="hidden sm:inline">{language === 'ka' ? 'რედაქტირება' : 'Edit'}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(language === 'ka' ? 'დარწმუნებული ხართ რომ გსურთ მატჩის წაშლა?' : 'Are you sure you want to delete this match?')) {
                        deleteMatch(match.id);
                        closeModal();
                      }
                    }}
                    title={language === 'ka' ? 'მატჩის წაშლა' : 'Delete Match'}
                    className="px-2.5 sm:px-3 py-1.5 rounded-full bg-red-950/90 hover:bg-red-800 text-red-200 border border-red-500/50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg hover:scale-105"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-300" />
                    <span className="hidden sm:inline">{language === 'ka' ? 'წაშლა' : 'Delete'}</span>
                  </button>
                </>
              )}
              <button
                onClick={shareMatch}
                title={t.matchDetails.shareBtn}
                className="p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={closeModal}
                title={t.matchDetails.closeBtn}
                className="p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-all cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Location & Title */}
          <div className="absolute bottom-3 sm:bottom-4 left-3.5 sm:left-5 right-3.5 sm:right-5 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 rounded-md bg-purple-900/80 text-purple-200 border border-purple-600/40 text-[10px] sm:text-[11px] font-bold">
                {localized.district || match.district}, {t.matchCard.districtTbilisi}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 text-[10px] sm:text-[11px] font-bold">
                {localized.skillLevel}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 sm:gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug break-words whitespace-normal">
                  {localized.title}
                </h2>
                <p className="text-[11px] sm:text-xs text-purple-200/90 font-medium flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">{localized.locationName} • {localized.address}</span>
                </p>
              </div>

              {match.googleMapsUrl && (
                <a
                  href={match.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start sm:self-auto px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-all shrink-0 shadow-lg hover:scale-105 cursor-pointer"
                >
                  <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  <span>{t.matchDetails.openInGoogleMaps || 'Google Maps'}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Match Gallery Modal */}
        {isGalleryOpen && (
          <MatchGalleryModal
            images={allGalleryImages}
            title={localized.title}
            locationName={localized.locationName}
            onClose={() => setIsGalleryOpen(false)}
          />
        )}

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          
          {/* Organizer Info (Player Match) */}
          {!isOfficial && (
            <div className="p-3 bg-purple-950/40 rounded-2xl border border-purple-800/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserAvatar name={match.creatorName || creatorUser?.name || 'Player'} userId={match.creatorId || 'creator'} className="w-8 h-8 rounded-full ring-2 ring-purple-500/40 text-xs font-bold" />
                <div>
                  <div className="text-[10px] text-purple-300/70 font-semibold">{language === 'ka' ? 'ორგანიზატორი მოთამაშე:' : 'Organizing Player:'}</div>
                  <div className="text-xs font-bold text-white">{formatDisplayName(match.creatorName || creatorUser?.name || 'Player')}</div>
                </div>
              </div>
              {creatorPhone && (
                <a
                  href={`tel:${creatorPhone}`}
                  className="px-3 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-emerald-300 hover:text-emerald-200 border border-purple-500/40 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md"
                  title={language === 'ka' ? `დარეკვა: ${creatorPhone}` : `Call Host: ${creatorPhone}`}
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{creatorPhone}</span>
                </a>
              )}
            </div>
          )}

          {/* Key Match Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="p-2.5 sm:p-3 bg-purple-950/40 rounded-xl sm:rounded-2xl border border-purple-800/30">
              <div className="text-[10px] text-purple-300/70 font-semibold uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3 text-purple-400 shrink-0" />
                <span>{t.matchDetails.date}</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-1 truncate">
                {localized.dayOfWeek}, {localized.formattedDate}
              </div>
            </div>

            <div className="p-2.5 sm:p-3 bg-purple-950/40 rounded-xl sm:rounded-2xl border border-purple-800/30">
              <div className="text-[10px] text-purple-300/70 font-semibold uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400 shrink-0" />
                <span>{t.matchDetails.timeDuration}</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-1 truncate">
                {match.startTime} ({match.durationMinutes} {t.matchDetails.minutes})
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-2.5 sm:p-3 bg-purple-950/40 rounded-xl sm:rounded-2xl border border-purple-800/30 flex items-center justify-between sm:block">
              <div className="text-[10px] text-purple-300/70 font-semibold uppercase">
                {t.matchDetails.feePerPlayer}
              </div>
              <div className="text-xs sm:text-sm font-black text-emerald-400 sm:mt-1">
                {match.pricePerPlayerGel} {t.common.gel}
              </div>
            </div>
          </div>

          {/* Participants Spot Breakdown */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                <span>{t.matchDetails.participants} ({match.joinedUserIds.length}/{match.totalSpots})</span>
              </h4>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {currentUser?.role === 'admin' && (
                  <>
                    {emptySpotsCount > 0 && (
                      <>
                        <button
                          onClick={() => addPlaceholderPlayer(match.id)}
                          className="px-2 sm:px-2.5 py-1 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-[10px] sm:text-[11px] font-bold border border-purple-600/40 flex items-center gap-1 transition-all cursor-pointer"
                          title="Add single placeholder user"
                        >
                          <UserPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400" />
                          <span>+ Placeholder</span>
                        </button>
                        <button
                          onClick={() => fillMatchWithPlaceholders(match.id)}
                          className="px-2 sm:px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-[10px] sm:text-[11px] font-bold shadow-md flex items-center gap-1 transition-all cursor-pointer"
                          title="Fill all empty spots with placeholder players"
                        >
                          <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-300" />
                          <span>Fill Game</span>
                        </button>
                      </>
                    )}

                    {match.joinedUserIds.some(id => id.startsWith('ph_') || id.startsWith('placeholder_')) && (
                      <button
                        onClick={() => clearPlaceholdersFromMatch(match.id)}
                        className="px-2 sm:px-2.5 py-1 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 text-[10px] sm:text-[11px] font-bold border border-red-800/40 flex items-center gap-1 transition-all cursor-pointer"
                        title="Clear all placeholder players from this match"
                      >
                        <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400" />
                        <span>Clear Placeholders</span>
                      </button>
                    )}

                    {(currentUser?.role === 'admin' || currentUser?.id === match.creatorId) && (
                      <button
                        onClick={() => {
                          if (confirm(language === 'ka' ? 'დარწმუნებული ხართ, რომ გსურთ მატჩის წაშლა?' : 'Are you sure you want to delete this match?')) {
                            deleteMatch(match.id);
                            closeModal();
                          }
                        }}
                        className="px-2 sm:px-2.5 py-1 rounded-xl bg-red-900/80 hover:bg-red-800 text-white text-[10px] sm:text-[11px] font-bold border border-red-500/50 flex items-center gap-1 transition-all cursor-pointer"
                        title="Delete Match"
                      >
                        <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-300" />
                        <span>Delete</span>
                      </button>
                    )}
                  </>
                )}

                <span className="text-xs text-purple-300/80 font-semibold">
                  {emptySpotsCount > 0 ? `${emptySpotsCount} ${t.matchDetails.spotsAvailable}` : t.matchCard.fullyBooked}
                </span>
              </div>
            </div>

            {/* Admin Player Direct Assignment Bar */}
            {currentUser?.role === 'admin' && emptySpotsCount > 0 && (
              <div className="p-2.5 sm:p-3 mb-3 rounded-xl sm:rounded-2xl bg-amber-950/20 border border-amber-800/40 flex flex-col sm:flex-row items-center gap-2">
                <span className="text-xs font-bold text-amber-300 whitespace-nowrap self-start sm:self-auto">Admin Assign Player:</span>
                <select
                  value={selectedAssignUserId}
                  onChange={(e) => setSelectedAssignUserId(e.target.value)}
                  className="flex-1 w-full px-3 py-1.5 bg-[#120a21] border border-purple-800/50 rounded-xl text-xs text-white"
                >
                  <option value="">-- Select Registered Player --</option>
                  {users
                    .filter(u => !match.joinedUserIds.includes(u.id))
                    .map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.skillLevel} • {u.stats.padelyPoints ?? 1000} PP) {u.role === 'admin' ? '[Admin]' : ''}
                      </option>
                    ))}
                </select>
                <button
                  disabled={!selectedAssignUserId}
                  onClick={() => {
                    if (selectedAssignUserId) {
                      adminAssignPlayerToMatch(match.id, selectedAssignUserId);
                      setSelectedAssignUserId('');
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Assign</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {joinedPlayers.map((player) => {
                return (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/30 transition-all group"
                  >
                    <div 
                      onClick={() => {
                        closeModal();
                        openUserProfile(player.id);
                      }}
                      className="flex items-center gap-2.5 sm:gap-3 cursor-pointer flex-1 min-w-0 pr-2"
                    >
                      <UserAvatar name={player.name} userId={player.id} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold ring-2 ring-purple-500/40 shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-bold text-white flex items-center gap-1 truncate">
                          <span className="truncate">{formatDisplayName(player.name)}</span>
                          {player.id === currentUser?.id && (
                            <span className="text-[10px] text-purple-300 font-normal shrink-0">({t.common.you})</span>
                          )}
                        </div>
                        <div className="text-[10px] text-purple-300/70 truncate">
                          {player.skillLevel} • {player.stats.padelyPoints ?? player.stats.skillRating ?? 1000} PP
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePlayerFromMatch(match.id, player.id);
                          }}
                          title="Remove player from game"
                          className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/80 text-red-400 hover:text-white border border-red-800/30 transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          closeModal();
                          openUserProfile(player.id);
                        }}
                        className="p-1 text-purple-400 hover:text-white cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Empty spots placeholders */}
              {Array.from({ length: emptySpotsCount }).map((_, i) => (
                currentUser?.role === 'admin' ? (
                  <div
                    key={`spot_${i}`}
                    onClick={() => addPlaceholderPlayer(match.id)}
                    className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-purple-950/20 hover:bg-purple-900/30 border-2 border-dashed border-purple-800/30 hover:border-purple-600/50 text-purple-400/60 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-900/20 group-hover:bg-purple-800/40 flex items-center justify-center font-black text-xs text-purple-300 transition-all shrink-0">
                        +{i + 1}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-purple-300/80 group-hover:text-purple-200">{t.matchDetails.openSpot}</div>
                        <div className="text-[10px] text-purple-400/60 group-hover:text-purple-300">Click to add placeholder player</div>
                      </div>
                    </div>

                    <span className="text-xs font-bold px-2 py-1 rounded-lg bg-purple-900/40 text-purple-300 border border-purple-700/40 opacity-80 group-hover:opacity-100 flex items-center gap-1 shrink-0">
                      <UserPlus className="w-3 h-3" />
                      Add
                    </span>
                  </div>
                ) : (
                  <div
                    key={`spot_${i}`}
                    className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-purple-950/20 border-2 border-dashed border-purple-800/30 text-purple-400/60"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-900/20 flex items-center justify-center font-black text-xs shrink-0">
                      +{i + 1}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-purple-300/70">{t.matchDetails.openSpot}</div>
                      <div className="text-[10px] text-purple-400/50">{t.matchDetails.waitingForPlayer}</div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Action Footer Button */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-purple-900/30">
            <div className="flex items-center justify-between sm:block">
              <div className="text-[10px] text-purple-300/60 font-semibold uppercase">{t.matchDetails.totalFee}</div>
              <div className="text-xl sm:text-2xl font-black text-white">{match.pricePerPlayerGel} {t.common.gel}</div>
            </div>

            {isUserJoined ? (
              <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t.matchDetails.bookedSuccess}</span>
              </div>
            ) : isFull ? (
              <button disabled className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-800 text-zinc-400 font-bold text-xs cursor-not-allowed">
                {t.matchDetails.matchFull}
              </button>
            ) : isCancelled ? (
              <button disabled className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-red-950/80 text-red-400 font-bold text-xs cursor-not-allowed">
                {t.matchDetails.matchCancelled}
              </button>
            ) : (
              <button
                onClick={() => {
                  closeModal();
                  startJoinMatchFlow(match);
                }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-purple-950/80 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <span>{t.matchDetails.joinMatchBtn} ({match.pricePerPlayerGel} {t.common.gel})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Edit Match Modal */}
      {isEditModalOpen && (
        <CreateMatchModal
          matchToEdit={match}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};
