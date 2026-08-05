import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, MapPin } from 'lucide-react';

interface MatchGalleryModalProps {
  images: string[];
  initialIndex?: number;
  title?: string;
  locationName?: string;
  onClose: () => void;
}

export const MatchGalleryModal: React.FC<MatchGalleryModalProps> = ({
  images,
  initialIndex = 0,
  title,
  locationName,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const validImages = images.filter((img) => img && img.trim() !== '');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, validImages.length]);

  if (validImages.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const currentImage = validImages[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col items-center justify-between rounded-3xl bg-[#0f071a]/90 border border-purple-800/40 p-4 sm:p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="w-full flex items-center justify-between border-b border-purple-900/40 pb-3 mb-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-800/40 text-amber-400 shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="text-sm sm:text-base font-black text-white truncate">
                {title || 'Match Gallery'}
              </h3>
              {locationName && (
                <p className="text-xs text-purple-300/70 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                  <span className="truncate">{locationName}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-purple-200 bg-purple-950/80 border border-purple-700/50 px-3 py-1 rounded-full">
              {currentIndex + 1} / {validImages.length}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800/40 transition-all cursor-pointer"
              title="Close Gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Image View */}
        <div className="relative w-full flex-1 min-h-[280px] sm:min-h-[420px] flex items-center justify-center bg-black/60 rounded-2xl border border-purple-950 overflow-hidden my-2">
          <img
            src={currentImage}
            alt={`Gallery view ${currentIndex + 1}`}
            className="w-full h-full max-h-[60vh] object-contain transition-all duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800';
            }}
          />

          {/* Navigation Arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-purple-600 text-white border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95"
                title="Previous Image"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-purple-600 text-white border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95"
                title="Next Image"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails Row */}
        {validImages.length > 1 && (
          <div className="w-full pt-3 border-t border-purple-900/40 flex items-center justify-center gap-2 overflow-x-auto custom-scrollbar max-h-24">
            {validImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-14 w-20 sm:h-16 sm:w-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  currentIndex === idx
                    ? 'border-amber-400 scale-105 shadow-lg shadow-purple-900/50'
                    : 'border-purple-900/50 opacity-50 hover:opacity-100 hover:border-purple-600'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
