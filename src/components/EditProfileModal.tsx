import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { User, SkillLevel, PlayingPosition } from '../types';
import { X, Save, AlertCircle } from 'lucide-react';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose }) => {
  const { updatePlayerProfile, showNotification } = useApp();
  const { t, language } = useLanguage();

  const [name, setName] = useState(user.name);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [age, setAge] = useState<number | string>(user.age && user.age > 0 ? user.age : '');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(user.skillLevel);
  const [preferredPosition, setPreferredPosition] = useState<PlayingPosition>(user.preferredPosition);

  const [errors, setErrors] = useState<{ name?: string; phone?: string; age?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
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

    updatePlayerProfile(user.id, {
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      age: parsedAge,
      skillLevel,
      preferredPosition,
    });

    showNotification(language === 'ka' ? 'პროფილი წარმატებით განახლდა!' : 'Profile updated successfully!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#120a21] border border-purple-800/50 rounded-3xl shadow-2xl text-white my-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
        
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <h3 className="text-lg font-black text-white">{t.profileModal.editTitle}</h3>
          <button onClick={onClose} className="p-2 rounded-full bg-purple-950/50 text-purple-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.profileModal.fullName} <span className="text-amber-400">*</span></label>
              <input
                type="text"
                required
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                }}
                className={`w-full px-3 py-2 bg-purple-950/50 border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-purple-800/40'} rounded-xl text-white focus:outline-none focus:border-purple-500`}
              />
              {errors.name && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 inline" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.profileModal.phoneNumber} <span className="text-amber-400">*</span></label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={e => {
                  setPhoneNumber(e.target.value);
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                }}
                placeholder={t.profileModal.phonePlaceholder || '+995 5xx xx xx xx'}
                className={`w-full px-3 py-2 bg-purple-950/50 border ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-purple-800/40'} rounded-xl text-white focus:outline-none focus:border-purple-500`}
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
              <label className="block text-purple-300/80 font-bold mb-1">{t.profileModal.age} <span className="text-amber-400">*</span></label>
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
                className={`w-full px-3 py-2 bg-purple-950/50 border ${errors.age ? 'border-red-500 ring-1 ring-red-500' : 'border-purple-800/40'} rounded-xl text-white focus:outline-none focus:border-purple-500`}
              />
              {errors.age && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 inline" /> {errors.age}
                </p>
              )}
            </div>

            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.profileModal.skillLevel}</label>
              <select
                value={skillLevel}
                onChange={e => setSkillLevel(e.target.value as SkillLevel)}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Beginner">{t.common.beginner}</option>
                <option value="Intermediate">{t.common.intermediate}</option>
                <option value="Advanced">{t.common.advanced}</option>
                <option value="Pro">{t.common.pro}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-purple-300/80 font-bold mb-1">{t.profileModal.preferredPosition}</label>
            <select
              value={preferredPosition}
              onChange={e => setPreferredPosition(e.target.value as PlayingPosition)}
              className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Left / Drive">{t.profileModal.leftDrive}</option>
              <option value="Right / Backhand">{t.profileModal.rightBackhand}</option>
              <option value="Flexible">{t.profileModal.flexible}</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{t.profileModal.saveProfile}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
