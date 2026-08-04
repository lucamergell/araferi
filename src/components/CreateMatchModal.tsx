import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Match, SkillLevel } from '../types';
import { X, Calendar, Clock, MapPin, Plus, DollarSign } from 'lucide-react';

interface CreateMatchModalProps {
  onClose: () => void;
  matchToEdit?: Match;
}

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({ onClose, matchToEdit }) => {
  const { createMatch, updateMatch } = useApp();
  const { t } = useLanguage();

  const [title, setTitle] = useState(matchToEdit?.title || t.createMatchModal.defaultTitle);
  const [locationName, setLocationName] = useState(matchToEdit?.locationName || t.createMatchModal.defaultClub);
  const [address, setAddress] = useState(matchToEdit?.address || t.createMatchModal.defaultAddress);
  const [district, setDistrict] = useState(matchToEdit?.district || 'Lisi');
  const [date, setDate] = useState(matchToEdit?.date || new Date().toISOString().split('T')[0]);
  const [dayOfWeek, setDayOfWeek] = useState(matchToEdit?.dayOfWeek || t.createMatchModal.dayThursday);
  const [startTime, setStartTime] = useState(matchToEdit?.startTime || '18:00');
  const [durationMinutes, setDurationMinutes] = useState(matchToEdit?.durationMinutes || 90);
  const [totalSpots, setTotalSpots] = useState(matchToEdit?.totalSpots || 4);
  const [skillLevelRequired, setSkillLevelRequired] = useState<SkillLevel>(matchToEdit?.skillLevelRequired || 'Intermediate');
  const [courtCostGel, setCourtCostGel] = useState(matchToEdit?.courtCostGel || 80);
  const [pricePerPlayerGel, setPricePerPlayerGel] = useState(matchToEdit?.pricePerPlayerGel || 25);
  const [description, setDescription] = useState(matchToEdit?.description || t.createMatchModal.defaultDesc);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (matchToEdit) {
      updateMatch(matchToEdit.id, {
        title,
        locationName,
        address,
        district,
        date,
        dayOfWeek,
        startTime,
        durationMinutes,
        totalSpots,
        skillLevelRequired,
        courtCostGel,
        pricePerPlayerGel,
        description,
      });
    } else {
      createMatch({
        title,
        locationName,
        address,
        district,
        date,
        dayOfWeek,
        startTime,
        durationMinutes,
        totalSpots,
        skillLevelRequired,
        courtCostGel,
        pricePerPlayerGel,
        description,
        imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800',
      });
    }

    onClose();
  };

  const calculatedRevenue = totalSpots * pricePerPlayerGel;
  const calculatedMargin = calculatedRevenue - courtCostGel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#120a21] border border-purple-800/50 rounded-3xl shadow-2xl text-white my-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <h3 className="text-lg font-black text-white">
            {matchToEdit ? t.createMatchModal.titleEdit : t.createMatchModal.titleCreate}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full bg-purple-950/50 hover:bg-purple-900/60 text-purple-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.createMatchModal.matchTitle}</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.createMatchModal.clubLocation}</label>
              <input
                type="text"
                required
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.createMatchModal.district}</label>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Lisi">Lisi Lake</option>
                <option value="Saburtalo">Saburtalo</option>
                <option value="Vake">Vake</option>
                <option value="Dighomi">Dighomi</option>
                <option value="Mtatsminda">Mtatsminda</option>
              </select>
            </div>

            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.createMatchModal.address}</label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.createMatchModal.date}</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.createMatchModal.dayOfWeek}</label>
              <input
                type="text"
                required
                value={dayOfWeek}
                onChange={e => setDayOfWeek(e.target.value)}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.createMatchModal.startTime}</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.createMatchModal.durationMins}</label>
              <input
                type="number"
                required
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Pricing & Economics */}
          <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/30 space-y-3">
            <div className="text-xs font-bold text-purple-200">{t.createMatchModal.economicsHeader}</div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-purple-300/80 font-semibold mb-1">{t.createMatchModal.courtCost}</label>
                <input
                  type="number"
                  required
                  value={courtCostGel}
                  onChange={e => setCourtCostGel(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-purple-300/80 font-semibold mb-1">{t.createMatchModal.pricePerPlayer}</label>
                <input
                  type="number"
                  required
                  value={pricePerPlayerGel}
                  onChange={e => setPricePerPlayerGel(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-purple-300/80 font-semibold mb-1">{t.createMatchModal.spotsCount}</label>
                <input
                  type="number"
                  required
                  value={totalSpots}
                  onChange={e => setTotalSpots(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs pt-1 border-t border-purple-900/30">
              <span className="text-purple-300/80">
                {t.createMatchModal.revenue}: <strong className="text-white">{calculatedRevenue} {t.common.gel}</strong> ({totalSpots} x {pricePerPlayerGel})
              </span>
              <span className="text-purple-300/80">
                {t.createMatchModal.profitMargin}: <strong className={calculatedMargin >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{calculatedMargin} {t.common.gel}</strong>
              </span>
            </div>
          </div>

          {/* Skill Level & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.createMatchModal.skillRequired}</label>
              <select
                value={skillLevelRequired}
                onChange={e => setSkillLevelRequired(e.target.value as SkillLevel)}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white focus:outline-none"
              >
                <option value="Beginner">{t.common.beginner}</option>
                <option value="Intermediate">{t.common.intermediate}</option>
                <option value="Advanced">{t.common.advanced}</option>
                <option value="Pro">{t.common.pro}</option>
              </select>
            </div>

            <div>
              <label className="block text-purple-300/80 font-bold mb-1">{t.createMatchModal.description}</label>
              <input
                type="text"
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl transition-all cursor-pointer active:scale-95"
          >
            {matchToEdit ? t.createMatchModal.saveBtn : t.createMatchModal.createBtn}
          </button>

        </form>

      </div>
    </div>
  );
};
