import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Match, User } from '../types';
import { X, Phone, User as UserIcon, Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Loader2, Sparkles, Trophy } from 'lucide-react';
import { normalizePhoneNumber, formatPhoneNumber, isValidPhoneNumber } from '../utils/phone';
import { formatDateDDMMYYYY } from '../utils/formatters';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface QuickJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
  onSuccess: (user: User) => void;
}

export const QuickJoinModal: React.FC<QuickJoinModalProps> = ({
  isOpen,
  onClose,
  match,
  onSuccess
}) => {
  const { t } = useLanguage();
  const { users, showNotification } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinedUser, setJoinedUser] = useState<User | null>(null);
  const [step, setStep] = useState<'form' | 'confirmed'>('form');

  // Pre-fill name and phone from localStorage on open
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setStep('form');
      setJoinedUser(null);
      const savedName = localStorage.getItem('padely_fast_join_name') || '';
      const savedPhone = localStorage.getItem('padely_fast_join_phone') || '';
      setName(savedName);
      setPhone(savedPhone);
    }
  }, [isOpen]);

  if (!isOpen || !match) return null;

  const isMatchFull = match.joinedUserIds.length >= match.totalSpots;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError(t.quickJoin.invalidName);
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      setError(t.quickJoin.invalidPhone);
      return;
    }

    const normPhone = normalizePhoneNumber(phone);
    const formattedPhone = formatPhoneNumber(phone);

    // Check capacity again
    if (match.joinedUserIds.length >= match.totalSpots) {
      setError(t.quickJoin.matchFull);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Check if user with this normalized phone already exists in local state or Firestore
      let existingUser: User | undefined = users.find(
        u => u.normalizedPhone === normPhone || normalizePhoneNumber(u.phoneNumber || '') === normPhone
      );

      if (!existingUser && db) {
        try {
          const userDoc = await getDoc(doc(db, 'users', `qj_${normPhone}`));
          if (userDoc.exists()) {
            existingUser = userDoc.data() as User;
          }
        } catch (err) {
          console.warn('Firestore user fetch note:', err);
        }
      }

      // Check if this user is ALREADY in this match
      if (existingUser && match.joinedUserIds.includes(existingUser.id)) {
        setError(t.quickJoin.alreadyInMatch);
        setIsSubmitting(false);
        return;
      }

      let targetUser: User;

      if (existingUser) {
        // Use existing user, update name if needed
        targetUser = {
          ...existingUser,
          name: trimmedName,
          phoneNumber: formattedPhone,
          normalizedPhone: normPhone,
        };
      } else {
        // Create new quick-join user
        targetUser = {
          id: `qj_${normPhone}`,
          name: trimmedName,
          email: `${normPhone}@phone.padely.ge`,
          phoneNumber: formattedPhone,
          normalizedPhone: normPhone,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${normPhone}`,
          age: 25,
          location: 'Tbilisi',
          skillLevel: 'Intermediate',
          preferredPosition: 'Flexible',
          bio: '',
          stats: {
            totalMatches: 0,
            wins: 0,
            losses: 0,
            winPercentage: 0,
            currentStreak: 0,
            longestStreak: 0,
            hoursPlayed: 0,
            matchesThisMonth: 0,
            favoritePartner: 'None',
            rankingPosition: 0,
            skillRating: 1000,
            padelyPoints: 1000,
            highestPadelyPoints: 1000,
            monthlyPadelyPoints: 0
          },
          matchHistory: [],
          role: 'user',
          isPhoneOnly: true, // Marked as phone-only so hidden from leaderboard
          isProfileComplete: true,
          createdAt: new Date().toISOString()
        };
      }

      // Persist user to Firestore
      if (db) {
        try {
          await setDoc(doc(db, 'users', targetUser.id), targetUser, { merge: true });
        } catch (err) {
          console.warn('Could not save phone user to Firestore:', err);
        }
      }

      // Remember in localStorage for fast auto-fill next time
      localStorage.setItem('padely_fast_join_name', trimmedName);
      localStorage.setItem('padely_fast_join_phone', formattedPhone);

      setJoinedUser(targetUser);
      setStep('confirmed');
    } catch (err: any) {
      console.error('Quick join error:', err);
      setError(err?.message || 'Error processing quick join. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToPayment = () => {
    if (joinedUser) {
      onSuccess(joinedUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#120a21] border border-purple-800/40 rounded-3xl overflow-hidden shadow-2xl space-y-0 relative text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 bg-gradient-to-r from-purple-950 via-[#180d30] to-purple-950 border-b border-purple-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-amber-400 font-bold shadow">
              🎾
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {step === 'form' ? t.quickJoin.modalTitle : t.quickJoin.successTitle}
              </h3>
              <p className="text-[11px] text-purple-300/70">
                {step === 'form' ? t.quickJoin.subtitle : match.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Match Snapshot */}
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/30 space-y-2 text-xs">
                <div className="font-extrabold text-amber-300 text-sm line-clamp-1">{match.title}</div>
                <div className="grid grid-cols-2 gap-2 text-purple-200/90 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{match.dayOfWeek}, {formatDateDDMMYYYY(match.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{match.startTime} ({match.durationMinutes}m)</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{match.locationName} • {match.district}</span>
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-600/50 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Capacity Warning */}
              {isMatchFull && (
                <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-600/50 text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t.quickJoin.matchFull}</span>
                </div>
              )}

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t.quickJoin.nameLabel}</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t.quickJoin.namePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-purple-950/60 border border-purple-800/40 text-sm text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t.quickJoin.phoneLabel}</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={t.quickJoin.phonePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-purple-950/60 border border-purple-800/40 text-sm text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400 transition-colors font-mono"
                />
                <p className="text-[10px] text-purple-300/60">
                  მაგალითად: 555 12 34 56 ან +995 555 123 456
                </p>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSubmitting || isMatchFull}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/50 transition-all active:scale-95 disabled:opacity-50 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>მუშავდება...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>{t.quickJoin.joinBtn}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: Confirmed State */
            <div className="space-y-5 text-center py-2 animate-fadeIn">
              
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center mx-auto text-white shadow-xl ring-4 ring-emerald-500/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-black text-white">
                  {t.quickJoin.successTitle}
                </h4>
                <p className="text-xs text-purple-300/80">
                  {joinedUser?.name}, თქვენ წარმატებით შეხვედით მატჩში.
                </p>
              </div>

              {/* Match Card Info */}
              <div className="p-4 rounded-2xl bg-purple-950/50 border border-purple-800/40 text-left space-y-2.5 text-xs">
                <div className="font-extrabold text-amber-300 text-sm">{match.title}</div>
                <div className="space-y-1.5 text-purple-200/90 text-[11px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{match.dayOfWeek}, {formatDateDDMMYYYY(match.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{match.startTime} ({match.durationMinutes} minutes)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{match.locationName} ({match.district})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="font-mono">{joinedUser?.phoneNumber}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 transition-all active:scale-95 cursor-pointer"
              >
                <span>{t.quickJoin.proceedToPayment} ({match.pricePerPlayerGel} GEL)</span>
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
