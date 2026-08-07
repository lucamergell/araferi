import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { SkillLevel, PlayingPosition } from '../types';
import { Sparkles, Trophy, PhoneCall, AlertCircle } from 'lucide-react';

export const OnboardingProfileModal: React.FC = () => {
  const { currentUser, isAuthLoading, isUsersLoaded, updatePlayerProfile, setCurrentView, showNotification } = useApp();
  const { t, language } = useLanguage();

  const [hasCompletedLocal, setHasCompletedLocal] = useState<boolean>(() => {
    if (!currentUser) return false;
    return localStorage.getItem(`padely_onboarding_completed_${currentUser.id}`) === 'true';
  });

  const [name, setName] = useState(currentUser?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [age, setAge] = useState<number | string>(currentUser?.age && currentUser.age > 0 ? currentUser.age : '');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(currentUser?.skillLevel || 'Beginner');
  const [preferredPosition, setPreferredPosition] = useState<PlayingPosition>(currentUser?.preferredPosition || 'Flexible');

  const [errors, setErrors] = useState<{ name?: string; phone?: string; age?: string }>({});

  useEffect(() => {
    if (currentUser) {
      if (localStorage.getItem(`padely_onboarding_completed_${currentUser.id}`) === 'true') {
        setHasCompletedLocal(true);
      }
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.phoneNumber) setPhoneNumber(currentUser.phoneNumber);
      if (currentUser.age && currentUser.age > 0) setAge(currentUser.age);
      if (currentUser.skillLevel) setSkillLevel(currentUser.skillLevel);
      if (currentUser.preferredPosition) setPreferredPosition(currentUser.preferredPosition);
    }
  }, [currentUser?.id, currentUser?.phoneNumber]);

  // Do not show modal while authentication or Firestore users snapshot is loading
  if (isAuthLoading || !isUsersLoaded || !currentUser) {
    return null;
  }

  const hasPhone = Boolean(currentUser.phoneNumber && currentUser.phoneNumber.trim() !== '');

  // If user profile is complete and has a valid phone number, do not open popup
  if ((currentUser.isProfileComplete && hasPhone) || (hasCompletedLocal && hasPhone)) {
    return null;
  }

  const isPhoneOnlyPrompt = !hasPhone && Boolean(currentUser?.name && currentUser?.age);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; phone?: string; age?: string } = {};

    if (!name || !name.trim() || name.trim().length < 2) {
      newErrors.name = language === 'ka' 
        ? 'გთხოვთ შეიყვანოთ თქვენი სრული სახელი და გვარი!' 
        : 'Please enter your full name!';
    }

    const cleanPhoneDigits = phoneNumber.replace(/[^0-9]/g, '');
    if (!phoneNumber || !phoneNumber.trim()) {
      newErrors.phone = language === 'ka' 
        ? 'ტელეფონის ნომრის შეყვანა სავალდებულოა!' 
        : 'Mobile phone number is required!';
    } else if (cleanPhoneDigits.length < 8 || cleanPhoneDigits.length > 15) {
      newErrors.phone = language === 'ka' 
        ? 'გთხოვთ შეიყვანოთ სწორი მობილურის ნომერი (მინიმუმ 8 ციფრი, მაგ: 599123456)!' 
        : 'Please enter a valid mobile phone number (at least 8 digits, e.g. 599123456)!';
    }

    const parsedAge = Number(age);
    if (!age || isNaN(parsedAge) || parsedAge < 10 || parsedAge > 99) {
      newErrors.age = language === 'ka' 
        ? 'გთხოვთ მიუთითოთ სწორი ასაკი (10-დან 99 წლამდე).' 
        : 'Please enter a valid age between 10 and 99.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showNotification(
        language === 'ka' ? 'გთხოვთ შეავსოთ ყველა სავალდებულო ველი სწორად!' : 'Please fill all required profile fields correctly!',
        'error'
      );
      return;
    }

    setErrors({});

    if (currentUser?.id) {
      localStorage.setItem(`padely_onboarding_completed_${currentUser.id}`, 'true');
      setHasCompletedLocal(true);
    }

    await updatePlayerProfile(currentUser.id, {
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      age: parsedAge,
      skillLevel,
      preferredPosition,
      isProfileComplete: true,
    });

    showNotification(language === 'ka' ? 'პროფილი წარმატებით განახლდა!' : 'Profile updated successfully!', 'success');
    setCurrentView('landing');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-[#120a21] border border-purple-600/50 rounded-3xl shadow-2xl text-white p-5 sm:p-8 pb-10 sm:pb-8 space-y-6 my-auto custom-scrollbar">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center mx-auto shadow-xl text-white">
            {isPhoneOnlyPrompt ? <PhoneCall className="w-7 h-7 text-amber-300" /> : <Trophy className="w-7 h-7" />}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isPhoneOnlyPrompt ? t.profileModal.enterPhoneTitle : t.profileModal.onboardingTitle}
          </h2>
          <p className="text-xs text-purple-300/80 max-w-sm mx-auto">
            {isPhoneOnlyPrompt ? t.profileModal.enterPhoneSub : t.profileModal.onboardingSub}
          </p>
        </div>

        {/* Requirements Banner */}
        <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-700/40 text-xs text-purple-200 flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{t.profileModal.reqBanner}</span>
        </div>

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-purple-300/90 font-bold mb-1">
                {t.profileModal.fullName} <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                }}
                placeholder="e.g. Giorgi Kapanadze"
                className={`w-full px-3.5 py-2.5 bg-purple-950/60 border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-purple-800/50'} rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500`}
              />
              {errors.name && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 inline" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-purple-300/90 font-bold mb-1">
                {t.profileModal.phoneNumber} <span className="text-amber-400 font-bold">*</span>
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={e => {
                  setPhoneNumber(e.target.value);
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                }}
                placeholder={t.profileModal.phonePlaceholder || '+995 5xx xx xx xx'}
                className={`w-full px-3.5 py-2.5 bg-purple-950/60 border ${errors.phone ? 'border-red-500 ring-2 ring-red-500' : 'border-purple-500 focus:ring-2 focus:ring-purple-400'} rounded-xl text-white placeholder-purple-400/50 focus:outline-none shadow-lg shadow-purple-900/30`}
              />
              {errors.phone && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 inline" /> {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-purple-300/90 font-bold mb-1">
                {t.profileModal.age} <span className="text-amber-400">*</span>
              </label>
              <input
                type="number"
                required
                min={10}
                max={99}
                value={age}
                onChange={e => {
                  setAge(e.target.value === '' ? '' : e.target.value);
                  if (errors.age) setErrors(prev => ({ ...prev, age: undefined }));
                }}
                placeholder="e.g. 25"
                className={`w-full px-3.5 py-2.5 bg-purple-950/60 border ${errors.age ? 'border-red-500 ring-1 ring-red-500' : 'border-purple-800/50'} rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500`}
              />
              {errors.age && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 inline" /> {errors.age}
                </p>
              )}
            </div>

            <div>
              <label className="block text-purple-300/90 font-bold mb-1">
                {t.profileModal.skillLevel} <span className="text-amber-400">*</span>
              </label>
              <select
                value={skillLevel}
                onChange={e => setSkillLevel(e.target.value as SkillLevel)}
                className="w-full px-3.5 py-2.5 bg-purple-950/60 border border-purple-800/50 rounded-xl text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Beginner">{t.common.beginner} (1.0 - 2.5)</option>
                <option value="Intermediate">{t.common.intermediate} (3.0 - 4.0)</option>
                <option value="Advanced">{t.common.advanced} (4.5 - 5.5)</option>
                <option value="Pro">{t.common.pro} (6.0+)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-purple-300/90 font-bold mb-1">
              {t.profileModal.preferredPosition} <span className="text-amber-400">*</span>
            </label>
            <select
              value={preferredPosition}
              onChange={e => setPreferredPosition(e.target.value as PlayingPosition)}
              className="w-full px-3.5 py-2.5 bg-purple-950/60 border border-purple-800/50 rounded-xl text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Left / Drive">{t.profileModal.leftDrive}</option>
              <option value="Right / Backhand">{t.profileModal.rightBackhand}</option>
              <option value="Flexible">{t.profileModal.flexible}</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>{t.profileModal.saveProfile}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
