import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Match, SkillLevel } from '../types';
import { X, Calendar, Clock, MapPin, Plus, DollarSign, Globe, Image as ImageIcon, Link as LinkIcon, Sparkles, Navigation, Trash2 } from 'lucide-react';
import { formatDateDDMMYYYY, getLocalizedDayOfWeek } from '../utils/formatters';

const PRESET_BANNERS = [
  { name: 'Lisi Court', url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Sunset Match', url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=800' },
  { name: 'Indoor Arena', url: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Pro Game', url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800' },
];

interface CreateMatchModalProps {
  onClose: () => void;
  matchToEdit?: Match;
}

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({ onClose, matchToEdit }) => {
  const { createMatch, updateMatch } = useApp();
  const { t } = useLanguage();

  const [titleKa, setTitleKa] = useState(matchToEdit?.titleKa || matchToEdit?.title || t.createMatchModal.defaultTitleKa);
  const [titleEn, setTitleEn] = useState(matchToEdit?.titleEn || matchToEdit?.title || t.createMatchModal.defaultTitleEn);

  const [locationNameKa, setLocationNameKa] = useState(matchToEdit?.locationNameKa || matchToEdit?.locationName || t.createMatchModal.defaultClubKa);
  const [locationNameEn, setLocationNameEn] = useState(matchToEdit?.locationNameEn || matchToEdit?.locationName || t.createMatchModal.defaultClubEn);

  const [address, setAddress] = useState(matchToEdit?.address || t.createMatchModal.defaultAddress);
  const [district, setDistrict] = useState(matchToEdit?.district || 'Lisi');
  
  const [date, setDate] = useState(matchToEdit?.date || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(matchToEdit?.startTime || '18:00');
  const [durationMinutes, setDurationMinutes] = useState(matchToEdit?.durationMinutes || 90);
  const [totalSpots, setTotalSpots] = useState(matchToEdit?.totalSpots || 4);
  const [skillLevelRequired, setSkillLevelRequired] = useState<SkillLevel>(matchToEdit?.skillLevelRequired || 'Intermediate');
  const [courtCostGel, setCourtCostGel] = useState(matchToEdit?.courtCostGel || 80);
  const [pricePerPlayerGel, setPricePerPlayerGel] = useState(matchToEdit?.pricePerPlayerGel || 25);
  
  const [imageUrl, setImageUrl] = useState(
    matchToEdit?.imageUrl || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800'
  );
  const [googleMapsUrl, setGoogleMapsUrl] = useState(matchToEdit?.googleMapsUrl || '');
  const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>(matchToEdit?.galleryImageUrls || []);
  const [newGalleryInput, setNewGalleryInput] = useState('');

  const handleAddGalleryImage = () => {
    if (!newGalleryInput.trim()) return;
    setGalleryImageUrls(prev => [...prev, newGalleryInput.trim()]);
    setNewGalleryInput('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImageUrls(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dayKa = getLocalizedDayOfWeek(date, 'ka');
    const dayEn = getLocalizedDayOfWeek(date, 'en');

    const matchPayload = {
      title: titleKa || titleEn,
      titleKa: titleKa || titleEn,
      titleEn: titleEn || titleKa,
      locationName: locationNameKa || locationNameEn,
      locationNameKa: locationNameKa || locationNameEn,
      locationNameEn: locationNameEn || locationNameKa,
      address,
      district,
      date,
      dayOfWeek: dayEn,
      dayOfWeekKa: dayKa,
      dayOfWeekEn: dayEn,
      startTime,
      durationMinutes,
      totalSpots,
      skillLevelRequired,
      courtCostGel,
      pricePerPlayerGel,
      description: '',
      descriptionKa: '',
      descriptionEn: '',
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800',
      googleMapsUrl: googleMapsUrl.trim(),
      galleryImageUrls: galleryImageUrls.filter(u => u && u.trim() !== ''),
    };

    if (matchToEdit) {
      updateMatch(matchToEdit.id, matchPayload);
    } else {
      createMatch(matchPayload);
    }

    onClose();
  };

  const calculatedRevenue = totalSpots * pricePerPlayerGel;
  const calculatedMargin = calculatedRevenue - courtCostGel;
  const formattedDisplayDate = formatDateDDMMYYYY(date);
  const computedDayKa = getLocalizedDayOfWeek(date, 'ka');
  const computedDayEn = getLocalizedDayOfWeek(date, 'en');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#120a21] border border-purple-800/50 rounded-3xl shadow-2xl text-white my-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>{matchToEdit ? t.createMatchModal.titleEdit : t.createMatchModal.titleCreate}</span>
            <span className="text-xs font-normal text-purple-300/60 bg-purple-950/60 border border-purple-800/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Globe className="w-3 h-3 text-purple-400" />
              <span>KA & EN</span>
            </span>
          </h3>
          <button onClick={onClose} className="p-2 rounded-full bg-purple-950/50 hover:bg-purple-900/60 text-purple-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Match Title (Bilingual) */}
          <div className="p-3 bg-purple-950/20 rounded-2xl border border-purple-800/30 space-y-2">
            <div className="text-xs font-bold text-purple-300 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>{t.createMatchModal.matchTitle}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-purple-300/70 font-semibold mb-1">🇬🇪 {t.createMatchModal.matchTitleKa}</label>
                <input
                  type="text"
                  required
                  value={titleKa}
                  onChange={e => setTitleKa(e.target.value)}
                  placeholder="მაგ: ლისის საღამოს პადელის თამაში"
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-purple-300/70 font-semibold mb-1">🇬🇧 {t.createMatchModal.matchTitleEn}</label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={e => setTitleEn(e.target.value)}
                  placeholder="e.g. Lisi Evening Padel Match"
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Location Name (Bilingual) */}
          <div className="p-3 bg-purple-950/20 rounded-2xl border border-purple-800/30 space-y-2">
            <div className="text-xs font-bold text-purple-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>{t.createMatchModal.clubLocation}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-purple-300/70 font-semibold mb-1">🇬🇪 {t.createMatchModal.clubLocationKa}</label>
                <input
                  type="text"
                  required
                  value={locationNameKa}
                  onChange={e => setLocationNameKa(e.target.value)}
                  placeholder="მაგ: ლისი პადელ კლუბი"
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-purple-300/70 font-semibold mb-1">🇬🇧 {t.createMatchModal.clubLocationEn}</label>
                <input
                  type="text"
                  required
                  value={locationNameEn}
                  onChange={e => setLocationNameEn(e.target.value)}
                  placeholder="e.g. Lisi Padel Club"
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
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
                <option value="Lisi">Lisi Lake (ლისი)</option>
                <option value="Saburtalo">Saburtalo (საბურთალო)</option>
                <option value="Vake">Vake (ვაკე)</option>
                <option value="Dighomi">Dighomi (დიღომი)</option>
                <option value="Mtatsminda">Mtatsminda (მთაწმინდა)</option>
                <option value="Marjanishvili">Marjanishvili (მარჯანიშვილი)</option>
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

          {/* Google Maps Link Field */}
          <div>
            <label className="block text-purple-300/80 font-bold mb-1 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.createMatchModal.googleMapsUrl}</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={googleMapsUrl}
                onChange={e => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full pl-3 pr-20 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
              />
              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Test Link</span>
                </a>
              )}
            </div>
            <p className="text-[10px] text-purple-300/60 mt-1">{t.createMatchModal.googleMapsHelp}</p>
          </div>

          {/* Date Selection with dd.mm.yyyy preview */}
          <div className="p-3 bg-purple-950/20 rounded-2xl border border-purple-800/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-purple-300/80 font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.createMatchModal.date}</span>
              </label>
              <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                {formattedDisplayDate} ({computedDayKa} / {computedDayEn})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-purple-300/70 font-semibold mb-1">{t.createMatchModal.startTime}</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-purple-300/70 font-semibold mb-1">{t.createMatchModal.durationMins}</label>
                <input
                  type="number"
                  required
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
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

          {/* Difficulty / Skill Level */}
          <div>
            <label className="block text-purple-300/80 font-bold mb-1">{t.createMatchModal.skillRequired}</label>
            <select
              value={skillLevelRequired}
              onChange={e => setSkillLevelRequired(e.target.value as SkillLevel)}
              className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white focus:outline-none font-semibold"
            >
              <option value="Beginner">Beginner / დამწყები</option>
              <option value="Intermediate">Intermediate / საშუალო</option>
              <option value="Advanced">Advanced / მაღალი</option>
              <option value="Expert">Expert / ექსპერტი</option>
              <option value="Pro">Pro / პრო</option>
              <option value="Open to All">Open to All / ყველასთვის</option>
            </select>
          </div>

          {/* Banner Image URL (Individual Match Banner) */}
          <div className="p-3.5 bg-purple-950/20 rounded-2xl border border-purple-800/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <span>{t.createMatchModal.bannerImageUrl}</span>
              </div>
              <span className="text-[10px] text-purple-300/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Card Cover</span>
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-9 pr-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1">
              <div className="text-[10px] font-semibold text-purple-300/70">Quick Presets:</div>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_BANNERS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      imageUrl === preset.url
                        ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                        : 'bg-purple-950/50 border-purple-800/40 text-purple-300 hover:bg-purple-900/60'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Banner Preview */}
            {imageUrl && (
              <div className="relative h-24 w-full rounded-xl overflow-hidden border border-purple-800/40 mt-2">
                <img
                  src={imageUrl}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback on broken image link
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2.5">
                  <span className="text-[10px] font-bold text-white bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-700/50">
                    Live Card Banner Preview
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Additional Gallery Photos Section */}
          <div className="p-3.5 bg-purple-950/20 rounded-2xl border border-purple-800/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>{t.createMatchModal.galleryImages}</span>
              </div>
              <span className="text-[10px] text-purple-300/60">
                {galleryImageUrls.length} photo(s)
              </span>
            </div>

            <p className="text-[10px] text-purple-300/60">{t.createMatchModal.galleryImagesHelp}</p>

            {/* Input to add new photo */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <input
                  type="url"
                  value={newGalleryInput}
                  onChange={e => setNewGalleryInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddGalleryImage();
                    }
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-9 pr-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1 transition-all shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.createMatchModal.addGalleryPhoto}</span>
              </button>
            </div>

            {/* Current Gallery List Thumbnails */}
            {galleryImageUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                {galleryImageUrls.map((url, idx) => (
                  <div key={idx} className="relative group h-20 rounded-xl overflow-hidden border border-purple-800/40 bg-black/40">
                    <img
                      src={url}
                      alt={`Gallery thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-red-600 text-white transition-all cursor-pointer shadow-md"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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

