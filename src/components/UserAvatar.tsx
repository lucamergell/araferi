import React from 'react';

interface UserAvatarProps {
  name?: string;
  className?: string;
  textClassName?: string;
}

const GRADIENT_PALETTES = [
  'bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 text-white',
  'bg-gradient-to-br from-emerald-500 via-teal-600 to-teal-800 text-white',
  'bg-gradient-to-br from-amber-500 via-rose-500 to-red-600 text-white',
  'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 text-white',
  'bg-gradient-to-br from-fuchsia-600 via-pink-600 to-rose-600 text-white',
  'bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 text-white',
  'bg-gradient-to-br from-rose-500 via-red-500 to-amber-600 text-white',
  'bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-800 text-white',
  'bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 text-white',
  'bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-700 text-white',
  'bg-gradient-to-br from-indigo-500 via-sky-600 to-blue-700 text-white',
  'bg-gradient-to-br from-pink-500 via-purple-600 to-violet-700 text-white',
];

export const getAvatarGradient = (name: string = '') => {
  let hash = 0;
  const str = name.trim();
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[index];
};

export const getAvatarInitial = (name: string = '') => {
  const trimmed = name.trim();
  if (!trimmed) return 'P';
  return trimmed.charAt(0).toUpperCase();
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = '',
  className = 'w-8 h-8 rounded-lg',
  textClassName = '',
}) => {
  const initial = getAvatarInitial(name);
  const gradientClass = getAvatarGradient(name);

  return (
    <div
      className={`relative inline-flex items-center justify-center font-black select-none shrink-0 shadow-sm ${gradientClass} ${className}`}
    >
      <span className={textClassName}>{initial}</span>
    </div>
  );
};
