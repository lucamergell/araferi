import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Court } from '../types';
import { X, MapPin, Navigation, Image as ImageIcon, Plus, Trash2, Link as LinkIcon, DollarSign, Building } from 'lucide-react';

interface AdminEditCourtModalProps {
  courtToEdit?: Court;
  onClose: () => void;
}

export const AdminEditCourtModal: React.FC<AdminEditCourtModalProps> = ({ courtToEdit, onClose }) => {
  const { createCourt, updateCourt } = useApp();

  const [nameKa, setNameKa] = useState(courtToEdit?.nameKa || courtToEdit?.name || '');
  const [nameEn, setNameEn] = useState(courtToEdit?.nameEn || courtToEdit?.name || '');
  const [addressKa, setAddressKa] = useState(courtToEdit?.addressKa || courtToEdit?.address || '');
  const [addressEn, setAddressEn] = useState(courtToEdit?.addressEn || courtToEdit?.address || '');
  const [district, setDistrict] = useState(courtToEdit?.district || 'Lisi');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(courtToEdit?.googleMapsUrl || '');
  const [imageUrl, setImageUrl] = useState(
    courtToEdit?.imageUrl || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800'
  );
  const [defaultCourtCostGel, setDefaultCourtCostGel] = useState(courtToEdit?.defaultCourtCostGel || 80);
  const [defaultPricePerPlayerGel, setDefaultPricePerPlayerGel] = useState(courtToEdit?.defaultPricePerPlayerGel || 25);
  const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>(courtToEdit?.galleryImageUrls || []);
  const [newGalleryInput, setNewGalleryInput] = useState('');

  const handleAddGalleryImage = () => {
    if (!newGalleryInput.trim()) return;
    setGalleryImageUrls(prev => [...prev, newGalleryInput.trim()]);
    setNewGalleryInput('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImageUrls(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const courtPayload = {
      name: nameKa || nameEn,
      nameKa: nameKa || nameEn,
      nameEn: nameEn || nameKa,
      address: addressKa || addressEn,
      addressKa: addressKa || addressEn,
      addressEn: addressEn || addressKa,
      district,
      googleMapsUrl: googleMapsUrl.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800',
      galleryImageUrls: galleryImageUrls.filter(u => u && u.trim() !== ''),
      defaultCourtCostGel,
      defaultPricePerPlayerGel,
    };

    if (courtToEdit) {
      await updateCourt(courtToEdit.id, courtPayload);
    } else {
      await createCourt(courtPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#120a21] border border-amber-800/50 rounded-3xl shadow-2xl text-white my-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/30 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-600/40 flex items-center justify-center text-amber-400 font-bold shadow">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {courtToEdit ? 'Edit Pre-Made Court' : 'Add New Pre-Made Court'}
              </h3>
              <p className="text-[11px] text-amber-300/70">
                Pre-made courts allow 1-click match creation with auto-filled stadium data
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-purple-950/50 hover:bg-purple-900/60 text-purple-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Court Name (Bilingual) */}
          <div className="p-3 bg-purple-950/20 rounded-2xl border border-purple-800/30 space-y-2">
            <label className="block text-xs font-bold text-amber-300">Court / Stadium Name</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-purple-300/70 font-semibold mb-1">🇬🇪 Name (Georgian)</label>
                <input
                  type="text"
                  required
                  value={nameKa}
                  onChange={e => setNameKa(e.target.value)}
                  placeholder="მაგ: ლისი პადელ კლუბი"
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-purple-300/70 font-semibold mb-1">🇬🇧 Name (English)</label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={e => setNameEn(e.target.value)}
                  placeholder="e.g. Lisi Padel Club"
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* District & Address */}
          <div className="p-3 bg-purple-950/20 rounded-2xl border border-purple-800/30 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-purple-300/70 font-semibold mb-1">District (უბანი)</label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-amber-500"
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
                <label className="block text-[10px] text-purple-300/70 font-semibold mb-1">🇬🇪 Address (Georgian)</label>
                <input
                  type="text"
                  required
                  value={addressKa}
                  onChange={e => setAddressKa(e.target.value)}
                  placeholder="მაგ: ლისის ტბის გზა 4"
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-purple-300/70 font-semibold mb-1">🇬🇧 Address (English)</label>
              <input
                type="text"
                value={addressEn}
                onChange={e => setAddressEn(e.target.value)}
                placeholder="e.g. Lisi Lake Road 4, Tbilisi"
                className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Google Maps Link */}
          <div>
            <label className="block text-purple-300/80 font-bold mb-1 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span>Google Maps Location Link</span>
            </label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={e => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Default Economics */}
          <div className="p-3.5 bg-amber-950/20 border border-amber-800/30 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Default Economics for this Stadium</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-purple-300/80 font-semibold mb-1">Default Court Rental Cost (GEL)</label>
                <input
                  type="number"
                  required
                  value={defaultCourtCostGel}
                  onChange={e => setDefaultCourtCostGel(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] text-purple-300/80 font-semibold mb-1">Default Price per Player (GEL)</label>
                <input
                  type="number"
                  required
                  value={defaultPricePerPlayerGel}
                  onChange={e => setDefaultPricePerPlayerGel(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-emerald-400 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Image Banner URL */}
          <div>
            <label className="block text-purple-300/80 font-bold mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>Stadium Cover / Banner Image URL</span>
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
            />
            {imageUrl && (
              <div className="relative h-20 w-full rounded-xl overflow-hidden border border-purple-800/40 mt-2">
                <img src={imageUrl} alt="Court Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Gallery Images */}
          <div className="p-3 bg-purple-950/20 rounded-2xl border border-purple-800/30 space-y-2">
            <label className="block text-xs font-bold text-purple-200">Stadium Gallery Photos</label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={newGalleryInput}
                onChange={e => setNewGalleryInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-xl font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {galleryImageUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-1">
                {galleryImageUrls.map((url, idx) => (
                  <div key={idx} className="relative group h-16 rounded-lg overflow-hidden border border-purple-800/40">
                    <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 rounded-full text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-xl transition-all cursor-pointer active:scale-95"
          >
            {courtToEdit ? 'Save Court Changes' : 'Create Pre-Made Court'}
          </button>

        </form>

      </div>
    </div>
  );
};
