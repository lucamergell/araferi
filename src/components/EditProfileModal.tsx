import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { User, SkillLevel, PlayingPosition } from '../types';
import { X, Save } from 'lucide-react';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose }) => {
  const { updatePlayerProfile } = useApp();
  const { t } = useLanguage();

  const [name, setName] = useState(user.name);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [age, setAge] = useState<number | string>(user.age && user.age > 0 ? user.age : '');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(user.skillLevel);
  const [preferredPosition, setPreferredPosition] = useState<PlayingPosition>(user.preferredPosition);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAge = Number(age);
    const validAge = !isNaN(parsedAge) && parsedAge > 0 ? parsedAge : 0;

    updatePlayerProfile(user.id, {
      name,
      phoneNumber,
      age: validAge,
      skillLevel,
      preferredPosition,
    });

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
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.profileModal.fullName}</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.profileModal.phoneNumber}</label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder={t.profileModal.phonePlaceholder || '+995 5xx xx xx xx'}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.profileModal.age}</label>
              <input
                type="number"
                required
                min={12}
                max={99}
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.profileModal.skillLevel}</label>
              <select
                value={skillLevel}
                onChange={e => setSkillLevel(e.target.value as SkillLevel)}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white"
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
              className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white"
            >
              <option value="Left / Drive">{t.profileModal.leftDrive}</option>
              <option value="Right / Backhand">{t.profileModal.rightBackhand}</option>
              <option value="Flexible">{t.profileModal.flexible}</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t.profileModal.saveProfile}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
