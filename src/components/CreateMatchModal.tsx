import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Match, SkillLevel, MatchCategory, MatchType } from '../types';
import { X, Calendar, Clock, MapPin, Building, Phone, ShieldCheck, CheckCircle2, User as UserIcon, Award } from 'lucide-react';
import { formatDateDDMMYYYY, getLocalizedDayOfWeek } from '../utils/formatters';

interface CreateMatchModalProps {
  onClose: () => void;
  matchToEdit?: Match;
  initialSelectedCourtId?: string;
  defaultCategory?: MatchCategory;
}

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  onClose,
  matchToEdit,
  initialSelectedCourtId,
  defaultCategory,
}) => {
  const { createMatch, updateMatch, courts, currentUser, firebaseUser, matches } = useApp();
  const { language, t } = useLanguage();

  const userEmail = (firebaseUser?.email || currentUser?.email || '').toLowerCase();
  const isAdmin = userEmail === 'luca.mergell@gmail.com' || currentUser?.role === 'admin';

  // Category: Official or Player
  const [category, setCategory] = useState<MatchCategory>(
    matchToEdit?.category || defaultCategory || (isAdmin ? 'official' : 'player')
  );

  // Premade Court Selection
  const [selectedCourtId, setSelectedCourtId] = useState<string>(
    matchToEdit?.courtId || initialSelectedCourtId || (courts.length > 0 ? courts[0].id : '')
  );

  const initialCourt = courts.find(c => c.id === selectedCourtId) || courts[0];

  const [date, setDate] = useState(matchToEdit?.date || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(matchToEdit?.startTime || '18:30');
  const [durationMinutes, setDurationMinutes] = useState<number>(matchToEdit?.durationMinutes || 90);
  const [totalSpots, setTotalSpots] = useState<number>(matchToEdit?.totalSpots || 4);
  const [skillLevelRequired, setSkillLevelRequired] = useState<SkillLevel>(
    matchToEdit?.skillLevelRequired || 'Intermediate'
  );
  const [matchType, setMatchType] = useState<MatchType>(matchToEdit?.matchType || 'Friendly');
  const [pricePerPlayerGel, setPricePerPlayerGel] = useState<number>(
    matchToEdit?.pricePerPlayerGel || initialCourt?.defaultPricePerPlayerGel || 15
  );

  // Phone number state and disclosure agreement
  const [userPhone, setUserPhone] = useState<string>(
    currentUser?.phoneNumber || matchToEdit?.creatorPhone || ''
  );
  const [allowPhoneOnCard, setAllowPhoneOnCard] = useState<boolean>(
    matchToEdit ? matchToEdit.allowPhoneOnCard !== false : false
  );

  // Form errors state
  const [formErrors, setFormErrors] = useState<{
    court?: string;
    date?: string;
    time?: string;
    price?: string;
    phone?: string;
    general?: string;
  }>({});

  const handleSelectCourt = (courtId: string) => {
    setSelectedCourtId(courtId);
    setFormErrors(prev => ({ ...prev, court: undefined, general: undefined }));
    const selected = courts.find(c => c.id === courtId);
    if (selected && selected.defaultPricePerPlayerGel) {
      setPricePerPlayerGel(selected.defaultPricePerPlayerGel);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { court?: string; date?: string; time?: string; price?: string; phone?: string; general?: string } = {};

    if (!selectedCourtId) {
      errors.court = language === 'ka' ? 'გთხოვთ აირჩიოთ კორტი!' : 'Please select a court!';
    } else if (!courts.some(c => c.id === selectedCourtId)) {
      errors.court = language === 'ka' ? 'არჩეული კორტი მიუწვდომელია!' : 'Selected court is not available!';
    }

    if (!date) {
      errors.date = language === 'ka' ? 'გთხოვთ აირჩიოთ თარიღი!' : 'Please select a date!';
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      if (date < todayStr) {
        errors.date = language === 'ka' ? 'თარიღი არ შეიძლება იყოს წარსულში!' : 'Date cannot be in the past!';
      }
    }

    if (!startTime) {
      errors.time = language === 'ka' ? 'გთხოვთ მიუთითოთ დაწყების დრო!' : 'Please select start time!';
    }

    if (pricePerPlayerGel === undefined || pricePerPlayerGel === null || isNaN(pricePerPlayerGel) || Number(pricePerPlayerGel) < 0) {
      errors.price = language === 'ka' ? 'გთხოვთ მიუთითოთ სწორი ფასი (0 ან მეტი GEL)!' : 'Please enter a valid price (0 or more GEL)!';
    }

    if (category === 'player') {
      const trimmedPhone = userPhone.trim();
      if (!trimmedPhone) {
        errors.phone = language === 'ka' ? 'ტელეფონის ნომერი აუცილებელია!' : 'Phone number is required!';
      } else {
        const digits = trimmedPhone.replace(/\D/g, '');
        if (digits.length < 8) {
          errors.phone = language === 'ka' ? 'გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი (მინიმუმ 8 ციფრი)!' : 'Please enter a valid phone number (at least 8 digits)!';
        }
      }

      if (!allowPhoneOnCard) {
        errors.phone = language === 'ka' 
          ? 'გთხოვთ დაეთანხმოთ პირობას ტელეფონის ნომრის გამოჩენის შესახებ!' 
          : 'You must check the agreement to display your phone number on Padely.ge!';
      }
    }

    if (!matchToEdit && !isAdmin) {
      const activeCreatedMatches = matches.filter(m => {
        if (m.status === 'Cancelled' || m.status === 'Completed') return false;
        return Boolean(
          (m.creatorId && m.creatorId === currentUser?.id) ||
          (m.createdByAdminId && m.createdByAdminId === currentUser?.id) ||
          (firebaseUser && m.creatorId === firebaseUser.uid) ||
          (m.creatorName && currentUser?.name && m.creatorName.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
        );
      });

      if (activeCreatedMatches.length >= 1) {
        errors.general = language === 'ka'
          ? 'თქვენ უკვე გაქვთ 1 აქტიური მატჩი შექმნილი. ახალი მატჩის შესაქმნელად ჯერ დაასრულეთ ან გააუქმეთ არსებული მატჩი!'
          : 'You can only have 1 active open match created at a time. Please cancel or complete your existing match first!';
      }
    }

    if (Object.keys(errors).length > 0) {
      errors.general = language === 'ka' 
        ? 'გთხოვთ შეავსოთ ყველა აუცილებელი ველები სწორად!' 
        : 'Please fill in all required fields correctly!';
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const court = courts.find(c => c.id === selectedCourtId)!;

    const dayKa = getLocalizedDayOfWeek(date, 'ka');
    const dayEn = getLocalizedDayOfWeek(date, 'en');

    const matchNameKa = `${court.nameKa || court.name} - ${matchType === 'Friendly' ? 'ამხანაგური' : matchType === 'Competitive' ? 'სარეიტინგო' : 'ვარჯიში'}`;
    const matchNameEn = `${court.nameEn || court.name} - ${matchType}`;

    const matchPayload: Partial<Match> = {
      category,
      matchType,
      courtId: court.id,
      title: matchNameEn,
      titleKa: matchNameKa,
      titleEn: matchNameEn,
      locationName: court.name,
      locationNameKa: court.nameKa || court.name,
      locationNameEn: court.nameEn || court.name,
      address: court.address,
      addressKa: court.addressKa || court.address,
      addressEn: court.addressEn || court.address,
      district: court.district || 'Tbilisi',
      date,
      dayOfWeek: dayEn,
      dayOfWeekKa: dayKa,
      dayOfWeekEn: dayEn,
      startTime,
      durationMinutes,
      totalSpots,
      skillLevelRequired,
      courtCostGel: court.defaultCourtCostGel || (pricePerPlayerGel * totalSpots),
      pricePerPlayerGel,
      description: category === 'official' ? 'Official Padely Event' : `Player created match by ${currentUser?.name || 'Host'}`,
      descriptionKa: category === 'official' ? 'Padely-ს ოფიციალური თამაში' : `მოთამაშე ${currentUser?.name || 'ორგანიზატორი'}-ს მიერ შექმნილი მატჩი`,
      descriptionEn: category === 'official' ? 'Official Padely Event' : `Player created match by ${currentUser?.name || 'Host'}`,
      imageUrl: court.imageUrl || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800',
      googleMapsUrl: court.googleMapsUrl || '',
      galleryImageUrls: court.galleryImageUrls || [],
      allowPhoneOnCard: category === 'player' ? allowPhoneOnCard : false,
      creatorPhone: userPhone.trim(),
    };

    if (matchToEdit) {
      updateMatch(matchToEdit.id, matchPayload);
    } else {
      createMatch(matchPayload);
    }

    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-[#0f0921] border border-purple-800/50 rounded-3xl shadow-2xl text-white my-auto p-5 sm:p-6 pb-12 sm:pb-8 space-y-5 custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-4">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>{matchToEdit ? t.createMatchModal.titleEdit : t.createMatchModal.titleCreate}</span>
            </h3>
            <p className="text-xs text-purple-300/70 mt-0.5">
              {category === 'official' 
                ? (language === 'ka' ? 'ოფიციალური ორგანიზებული ღონისძიების შექმნა' : 'Create an official platform-organized match')
                : (language === 'ka' ? 'შექმენი შენი მატჩი და მოიწვიე სხვა მოთამაშეები' : 'Create your match & invite other padel players')}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* General Error Banner */}
          {formErrors.general && (
            <div className="p-3.5 rounded-2xl bg-red-950/90 border border-red-500/60 text-red-200 text-xs font-bold flex items-center gap-2 shadow-xl">
              <span className="text-base">⚠️</span>
              <span>{formErrors.general}</span>
            </div>
          )}

          {/* Admin Category Switcher if Admin */}
          {isAdmin && (
            <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-2xl space-y-2">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{language === 'ka' ? 'მატჩის კატეგორია (ადმინი)' : 'Match Category (Admin)'}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCategory('official')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    category === 'official'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-900/40'
                      : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/60'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Official Match</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('player')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    category === 'player'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                      : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/60'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Player Match</span>
                </button>
              </div>
            </div>
          )}

          {/* 1. COURT SELECTION SYSTEM (Strict Premade Courts) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-purple-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-purple-400" />
                <span>{language === 'ka' ? '1. აირჩიეთ პადელის კორტი' : '1. Select a Padel Court'}</span>
              </span>
            </label>

            {courts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {courts.map((court) => {
                  const isSelected = selectedCourtId === court.id;
                  return (
                    <div
                      key={court.id}
                      onClick={() => handleSelectCourt(court.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 relative overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border-purple-400 shadow-xl ring-2 ring-purple-500/50'
                          : 'bg-purple-950/40 hover:bg-purple-900/40 border-purple-800/30 text-purple-200'
                      }`}
                    >
                      <img 
                        src={court.imageUrl || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800'} 
                        alt={court.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-white truncate">{court.nameKa || court.name}</div>
                        <div className="text-[10px] text-purple-300/80 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                          <span className="truncate">{court.district}, {court.address}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-purple-300/70 p-3 bg-purple-950/50 rounded-xl">No courts configured in admin panel.</p>
            )}
            {formErrors.court && (
              <p className="text-red-400 text-[11px] font-bold mt-1 flex items-center gap-1">
                <span>⚠️</span> {formErrors.court}
              </p>
            )}
          </div>

          {/* 2. DATE & START TIME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-purple-300/90 font-bold mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>{language === 'ka' ? '2. აირჩიეთ თარიღი' : '2. Select Date'}</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => {
                  setDate(e.target.value);
                  if (formErrors.date) setFormErrors(prev => ({ ...prev, date: undefined, general: undefined }));
                }}
                className={`w-full px-3 py-2.5 bg-purple-950/60 border rounded-xl text-white font-semibold focus:outline-none ${
                  formErrors.date ? 'border-red-500' : 'border-purple-800/40 focus:border-purple-500'
                }`}
              />
              {formErrors.date && (
                <p className="text-red-400 text-[11px] font-bold mt-1 flex items-center gap-1">
                  <span>⚠️</span> {formErrors.date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-purple-300/90 font-bold mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>{language === 'ka' ? '3. დაწყების დრო' : '3. Select Start Time'}</span>
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => {
                  setStartTime(e.target.value);
                  if (formErrors.time) setFormErrors(prev => ({ ...prev, time: undefined, general: undefined }));
                }}
                className={`w-full px-3 py-2.5 bg-purple-950/60 border rounded-xl text-white font-semibold focus:outline-none ${
                  formErrors.time ? 'border-red-500' : 'border-purple-800/40 focus:border-purple-500'
                }`}
              />
              {formErrors.time && (
                <p className="text-red-400 text-[11px] font-bold mt-1 flex items-center gap-1">
                  <span>⚠️</span> {formErrors.time}
                </p>
              )}
            </div>
          </div>

          {/* 3. DURATION & PLAYERS COUNT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Duration */}
            <div>
              <label className="block text-purple-300/90 font-bold mb-1.5">
                {language === 'ka' ? '4. ხანგრძლივობა' : '4. Select Duration'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[60, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      durationMinutes === mins
                        ? 'bg-purple-600 text-white shadow-md border border-purple-400'
                        : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/60 border border-purple-800/30'
                    }`}
                  >
                    {mins} {language === 'ka' ? 'წუთი' : 'mins'}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Players */}
            <div>
              <label className="block text-purple-300/90 font-bold mb-1.5">
                {language === 'ka' ? '5. მოთამაშეთა რაოდენობა' : '5. Number of Players'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[2, 4].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setTotalSpots(count)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      totalSpots === count
                        ? 'bg-purple-600 text-white shadow-md border border-purple-400'
                        : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/60 border border-purple-800/30'
                    }`}
                  >
                    {count} {language === 'ka' ? 'მოთამაშე' : 'players'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. SKILL LEVEL & MATCH TYPE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-purple-300/90 font-bold mb-1">
                {language === 'ka' ? '6. სირთულის დონე' : '6. Skill Level'}
              </label>
              <select
                value={skillLevelRequired}
                onChange={e => setSkillLevelRequired(e.target.value as SkillLevel)}
                className="w-full px-3 py-2.5 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white font-semibold focus:outline-none focus:border-purple-500"
              >
                <option value="Beginner">{language === 'ka' ? 'დამწყები (Beginner)' : 'Beginner'}</option>
                <option value="Intermediate">{language === 'ka' ? 'საშუალო (Intermediate)' : 'Intermediate'}</option>
                <option value="Advanced">{language === 'ka' ? 'მაღალი (Advanced)' : 'Advanced'}</option>
                <option value="Any level">{language === 'ka' ? 'ნებისმიერი დონე (Any level)' : 'Any level'}</option>
              </select>
            </div>

            <div>
              <label className="block text-purple-300/90 font-bold mb-1">
                {language === 'ka' ? '7. მატჩის ტიპი' : '7. Match Type'}
              </label>
              <select
                value={matchType}
                onChange={e => setMatchType(e.target.value as MatchType)}
                className="w-full px-3 py-2.5 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white font-semibold focus:outline-none focus:border-purple-500"
              >
                <option value="Friendly">{language === 'ka' ? 'ამხანაგური (Friendly)' : 'Friendly'}</option>
                <option value="Competitive">{language === 'ka' ? 'სარეიტინგო (Competitive)' : 'Competitive'}</option>
                <option value="Training">{language === 'ka' ? 'სავარჯიშო (Training)' : 'Training'}</option>
              </select>
            </div>
          </div>

          {/* 5. PRICE PER PLAYER */}
          <div>
            <label className="block text-purple-300/90 font-bold mb-1">
              {language === 'ka' ? '8. ფასი თითო მოთამაშეზე (GEL)' : '8. Price per Player (GEL)'}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1"
                required
                value={pricePerPlayerGel}
                onChange={e => {
                  setPricePerPlayerGel(Number(e.target.value));
                  if (formErrors.price) setFormErrors(prev => ({ ...prev, price: undefined, general: undefined }));
                }}
                className={`w-full px-3 py-2.5 bg-purple-950/60 border rounded-xl text-emerald-400 font-extrabold text-sm focus:outline-none ${
                  formErrors.price ? 'border-red-500' : 'border-purple-800/40 focus:border-purple-500'
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-purple-300">GEL</div>
            </div>
            {formErrors.price && (
              <p className="text-red-400 text-[11px] font-bold mt-1 flex items-center gap-1">
                <span>⚠️</span> {formErrors.price}
              </p>
            )}
          </div>

          {/* PHONE DISCLOSURE & CREATOR DISCLOSURE (For Player Matches) */}
          {category === 'player' && (
            <div className={`p-4 rounded-2xl bg-purple-950/40 border space-y-3 ${
              formErrors.phone ? 'border-red-500/60' : 'border-purple-800/40'
            }`}>
              <div className="flex items-center gap-2 text-purple-200 font-bold">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>{language === 'ka' ? 'ორგანიზატორის საკონტაქტო ნომერი' : 'Host Contact Number'}</span>
              </div>

              <div>
                <label className="block text-[11px] text-purple-300/80 font-medium mb-1">
                  {language === 'ka' ? 'ტელეფონის ნომერი:' : 'Phone Number:'}
                </label>
                <input
                  type="tel"
                  required
                  value={userPhone}
                  onChange={e => {
                    setUserPhone(e.target.value);
                    if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: undefined, general: undefined }));
                  }}
                  placeholder="+995 5xx xx xx xx"
                  className={`w-full px-3 py-2 bg-purple-950/70 border rounded-xl text-white font-semibold focus:outline-none ${
                    formErrors.phone ? 'border-red-500 focus:border-red-400' : 'border-purple-800/50 focus:border-purple-500'
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-red-400 text-[11px] font-bold mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {formErrors.phone}
                  </p>
                )}
              </div>

              <label className={`flex items-start gap-2.5 cursor-pointer pt-2 pb-1 px-2 rounded-xl border transition-colors ${
                formErrors.phone && !allowPhoneOnCard ? 'bg-red-950/60 border-red-500/80' : 'border-transparent'
              }`}>
                <input
                  type="checkbox"
                  required
                  checked={allowPhoneOnCard}
                  onChange={e => {
                    setAllowPhoneOnCard(e.target.checked);
                    if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: undefined, general: undefined }));
                  }}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] text-purple-200/90 leading-tight">
                  {language === 'ka'
                    ? 'ვეთანხმები, რომ ჩემი ტელეფონის ნომერი გამოჩნდება Padely.ge-ზე, რათა სხვა მოთამაშეებმა შეძლონ დაკავშირება კითხვების შემთხვევაში.'
                    : 'I agree that my phone number will be displayed on Padely.ge so other players can contact me in case of questions.'}
                </span>
              </label>

              <div className="text-[11px] text-purple-300/70 bg-purple-900/20 p-2.5 rounded-xl border border-purple-800/20">
                💡 {language === 'ka' ? 'თქვენ ავტომატურად შეხვალთ ამ მატჩში პირველ მოთამაშედ.' : 'You will automatically join your match as the first player.'}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2 pb-6 sm:pb-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl transition-all cursor-pointer active:scale-98 uppercase tracking-wider"
            >
              {matchToEdit ? t.createMatchModal.saveBtn : t.createMatchModal.createBtn}
            </button>
          </div>

        </form>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
