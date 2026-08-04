import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, SkillLevel, PlayingPosition } from '../types';
import { UserAvatar } from './UserAvatar';
import { X, Save, Trophy, Sliders } from 'lucide-react';

interface AdminEditPlayerModalProps {
  user: User;
  onClose: () => void;
}

export const AdminEditPlayerModal: React.FC<AdminEditPlayerModalProps> = ({ user, onClose }) => {
  const { updatePlayerStats, updatePlayerProfile } = useApp();

  const [padelyPoints, setPadelyPoints] = useState(user.stats.padelyPoints ?? user.stats.skillRating ?? 1000);
  const [totalMatches, setTotalMatches] = useState(user.stats.totalMatches);
  const [wins, setWins] = useState(user.stats.wins);
  const [losses, setLosses] = useState(user.stats.losses);
  const [currentStreak, setCurrentStreak] = useState(user.stats.currentStreak);
  const [hoursPlayed, setHoursPlayed] = useState(user.stats.hoursPlayed);
  const [matchesThisMonth, setMatchesThisMonth] = useState(user.stats.matchesThisMonth);

  const [skillLevel, setSkillLevel] = useState<SkillLevel>(user.skillLevel);
  const [preferredPosition, setPreferredPosition] = useState<PlayingPosition>(user.preferredPosition);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Update stats
    updatePlayerStats(user.id, {
      padelyPoints,
      skillRating: padelyPoints,
      totalMatches,
      wins,
      losses,
      currentStreak,
      hoursPlayed,
      matchesThisMonth,
    });

    // Update profile fields
    updatePlayerProfile(user.id, {
      skillLevel,
      preferredPosition,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#120a21] border border-amber-800/50 rounded-3xl shadow-2xl text-white my-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
        
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <div className="flex items-center gap-2.5">
            <UserAvatar name={user.name} userId={user.id} className="w-10 h-10 rounded-xl text-sm font-bold ring-2 ring-amber-500/50" />
            <div>
              <h3 className="text-base font-black text-white">Admin Stat Adjustment</h3>
              <p className="text-xs text-amber-300/80">{user.name} ({user.email})</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-purple-950/50 text-purple-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          <div className="p-3.5 bg-amber-950/20 border border-amber-800/30 rounded-2xl space-y-3">
            <div className="font-bold text-amber-300 text-xs">Padely Points & Ranking Controls</div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-purple-300/80 font-bold mb-1">Padely Points (PP)</label>
                <input
                  type="number"
                  value={padelyPoints}
                  onChange={e => setPadelyPoints(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl font-black text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-purple-300/80 font-bold mb-1">Self-Selected Level</label>
                <select
                  value={skillLevel}
                  onChange={e => setSkillLevel(e.target.value as SkillLevel)}
                  className="w-full px-3 py-2 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white font-semibold"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Match Counts */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-purple-300/80 font-bold mb-1">Total Matches</label>
              <input
                type="number"
                value={totalMatches}
                onChange={e => setTotalMatches(Number(e.target.value))}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-purple-300/80 font-bold mb-1">Wins</label>
              <input
                type="number"
                value={wins}
                onChange={e => setWins(Number(e.target.value))}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-emerald-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-purple-300/80 font-bold mb-1">Losses</label>
              <input
                type="number"
                value={losses}
                onChange={e => setLosses(Number(e.target.value))}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-red-400 font-bold"
              />
            </div>
          </div>

          {/* Streak & Hours */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-purple-300/80 font-bold mb-1">Win Streak 🔥</label>
              <input
                type="number"
                value={currentStreak}
                onChange={e => setCurrentStreak(Number(e.target.value))}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-amber-300 font-bold"
              />
            </div>

            <div>
              <label className="block text-purple-300/80 font-bold mb-1">Hours Played</label>
              <input
                type="number"
                value={hoursPlayed}
                onChange={e => setHoursPlayed(Number(e.target.value))}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-purple-300/80 font-bold mb-1">Matches This Month</label>
              <input
                type="number"
                value={matchesThisMonth}
                onChange={e => setMatchesThisMonth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white"
              />
            </div>
          </div>

          {/* Playing preferences */}
          <div>
            <label className="block text-purple-300/80 font-bold mb-1">Position</label>
            <select
              value={preferredPosition}
              onChange={e => setPreferredPosition(e.target.value as PlayingPosition)}
              className="w-full px-3 py-2 bg-purple-950/50 border border-purple-800/40 rounded-xl text-white"
            >
              <option value="Left / Drive">Left / Drive</option>
              <option value="Right / Backhand">Right / Backhand</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Update Player Statistics</span>
          </button>

        </form>

      </div>
    </div>
  );
};
