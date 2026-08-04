import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { SkillLevel, PlayingPosition } from '../types';
import { Sparkles, Trophy } from 'lucide-react';

export const OnboardingProfileModal: React.FC = () => {
  const { currentUser, updatePlayerProfile, setCurrentView } = useApp();
  const { t } = useLanguage();

  const [hasCompletedLocal, setHasCompletedLocal] = useState<boolean>(() => {
    if (!currentUser) return false;
    return localStorage.getItem(`padely_onboarding_completed_${currentUser.id}`) === 'true';
  });

  const [name, setName] = useState(currentUser?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [age, setAge] = useState<number>(currentUser?.age || 25);
  const [location, setLocation] = useState('Tbilisi');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(currentUser?.skillLevel || 'Beginner');
  const [preferredPosition, setPreferredPosition] = useState<PlayingPosition>(currentUser?.preferredPosition || 'Flexible');
  const [bio, setBio] = useState(currentUser?.bio || '');

  useEffect(() => {
    if (currentUser) {
      if (localStorage.getItem(`padely_onboarding_completed_${currentUser.id}`) === 'true') {
        setHasCompletedLocal(true);
      }
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.phoneNumber) setPhoneNumber(currentUser.phoneNumber);
      if (currentUser.age) setAge(currentUser.age);
      if (currentUser.location) setLocation(currentUser.location || 'Tbilisi');
      if (currentUser.skillLevel) setSkillLevel(currentUser.skillLevel);
      if (currentUser.preferredPosition) setPreferredPosition(currentUser.preferredPosition);
      if (currentUser.bio) setBio(currentUser.bio);
    }
  }, [currentUser?.id]);

  if (!currentUser || currentUser.isProfileComplete || hasCompletedLocal) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser?.id) {
      localStorage.setItem(`padely_onboarding_completed_${currentUser.id}`, 'true');
      setHasCompletedLocal(true);
    }

    await updatePlayerProfile(currentUser.id, {
      name,
      phoneNumber,
      age: Number(age) || 25,
      location: location || 'Tbilisi',
      skillLevel,
      preferredPosition,
      bio,
      isProfileComplete: true,
    });

    setCurrentView('discovery');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#120a21] border border-purple-600/50 rounded-3xl shadow-2xl text-white p-5 sm:p-8 space-y-6 my-auto custom-scrollbar">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center mx-auto shadow-xl text-white">
            <Trophy className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">{t.profileModal.onboardingTitle}</h2>
          <p className="text-xs text-purple-300/80 max-w-sm mx-auto">
            {t.profileModal.onboardingSub}
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
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Giorgi Kapanadze"
                className="w-full px-3.5 py-2.5 bg-purple-950/60 border border-purple-800/50 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-purple-300/90 font-bold mb-1">
                {t.profileModal.phoneNumber} <span className="text-amber-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder={t.profileModal.phonePlaceholder || '+995 5xx xx xx xx'}
                className="w-full px-3.5 py-2.5 bg-purple-950/60 border border-purple-800/50 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-purple-300/90 font-bold mb-1">
                {t.profileModal.age} <span className="text-amber-400">*</span>
              </label>
              <input
                type="number"
                required
                min={12}
                max={99}
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-purple-950/60 border border-purple-800/50 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-purple-300/90 font-bold mb-1">
                {t.profileModal.location} <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Tbilisi"
                className="w-full px-3.5 py-2.5 bg-purple-950/60 border border-purple-800/50 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-purple-300/90 font-bold mb-1">
                {t.profileModal.skillLevel} <span className="text-amber-400">*</span>
              </label>
              <select
                value={skillLevel}
                onChange={e => setSkillLevel(e.target.value as SkillLevel)}
                className="w-full px-3.5 py-2.5 bg-purple-950/60 border border-purple-800/50 rounded-xl text-white focus:outline-none focus:border-purple-500"
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
              className="w-full px-3.5 py-2.5 bg-purple-950/60 border border-purple-800/50 rounded-xl text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Left / Drive">{t.profileModal.leftDrive}</option>
              <option value="Right / Backhand">{t.profileModal.rightBackhand}</option>
              <option value="Flexible">{t.profileModal.flexible}</option>
            </select>
          </div>

          <div>
            <label className="block text-purple-300/90 font-bold mb-1">
              {t.profileModal.bio}
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder={t.profileModal.bioPlaceholder}
              className="w-full px-3.5 py-2.5 bg-purple-950/60 border border-purple-800/50 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500"
            />
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
