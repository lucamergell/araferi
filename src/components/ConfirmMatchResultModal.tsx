import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Match } from '../types';
import { X, Trophy, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';
import { formatDisplayName } from '../utils/formatters';

interface ConfirmMatchResultModalProps {
  match: Match;
  onClose: () => void;
}

export const ConfirmMatchResultModal: React.FC<ConfirmMatchResultModalProps> = ({ match, onClose }) => {
  const { users, confirmMatchResult, removeMatchResult } = useApp();

  const joinedPlayers = users.filter(u => match.joinedUserIds.includes(u.id));

  // Initialize Team 1 & Team 2
  const initialTeam1 = match.team1UserIds?.length 
    ? match.team1UserIds 
    : joinedPlayers.slice(0, 2).map(u => u.id);
  const initialTeam2 = match.team2UserIds?.length 
    ? match.team2UserIds 
    : joinedPlayers.slice(2, 4).map(u => u.id);

  const [team1UserIds, setTeam1UserIds] = useState<string[]>(initialTeam1);
  const [team2UserIds, setTeam2UserIds] = useState<string[]>(initialTeam2);
  const [winningTeam, setWinningTeam] = useState<1 | 2>(match.winningTeam || 1);
  const [score, setScore] = useState<string>(match.score || '6-4, 6-3');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePlayerTeam = (userId: string) => {
    if (team1UserIds.includes(userId)) {
      setTeam1UserIds(team1UserIds.filter(id => id !== userId));
      setTeam2UserIds([...team2UserIds, userId]);
    } else {
      setTeam2UserIds(team2UserIds.filter(id => id !== userId));
      setTeam1UserIds([...team1UserIds, userId]);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (team1UserIds.length === 0 || team2UserIds.length === 0) {
      alert('Please select players for both Team 1 and Team 2');
      return;
    }
    setIsSubmitting(true);
    await confirmMatchResult(match.id, team1UserIds, team2UserIds, winningTeam, score);
    setIsSubmitting(false);
    onClose();
  };

  const handleRevert = async () => {
    if (confirm('Are you sure you want to revert this match result and roll back player Padely Points?')) {
      setIsSubmitting(true);
      await removeMatchResult(match.id);
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#120a21] border border-amber-600/50 rounded-3xl shadow-2xl text-white p-6 space-y-5 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-600/50 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Record Official Match Result</h3>
              <p className="text-xs text-purple-300/70">{match.title} ({match.date})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-purple-950/50 text-purple-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {match.isResultConfirmed && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Result confirmed! Score: {match.score}</span>
            </div>
            <button
              type="button"
              onClick={handleRevert}
              disabled={isSubmitting}
              className="px-2.5 py-1 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/50 text-red-300 font-bold text-[11px] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Revert Result</span>
            </button>
          </div>
        )}

        {joinedPlayers.length < 2 && (
          <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-2xl text-xs text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>This match requires joined players before confirming a result.</span>
          </div>
        )}

        <form onSubmit={handleConfirm} className="space-y-4 text-xs">
          
          {/* Teams Assignment */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Team 1 */}
            <div className={`p-3.5 rounded-2xl border ${winningTeam === 1 ? 'bg-amber-950/40 border-amber-500/60' : 'bg-purple-950/30 border-purple-900/40'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-300">Team 1</span>
                <input
                  type="radio"
                  name="winner"
                  checked={winningTeam === 1}
                  onChange={() => setWinningTeam(1)}
                  className="accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                {joinedPlayers.map(p => {
                  const isTeam1 = team1UserIds.includes(p.id);
                  if (!isTeam1) return null;
                  return (
                    <div
                      key={p.id}
                      onClick={() => togglePlayerTeam(p.id)}
                      className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/30 flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-semibold text-white">{formatDisplayName(p.name)}</span>
                      <span className="text-[10px] text-amber-300">{p.stats.padelyPoints ?? 1000} PP</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team 2 */}
            <div className={`p-3.5 rounded-2xl border ${winningTeam === 2 ? 'bg-amber-950/40 border-amber-500/60' : 'bg-purple-950/30 border-purple-900/40'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-300">Team 2</span>
                <input
                  type="radio"
                  name="winner"
                  checked={winningTeam === 2}
                  onChange={() => setWinningTeam(2)}
                  className="accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                {joinedPlayers.map(p => {
                  const isTeam2 = team2UserIds.includes(p.id);
                  if (!isTeam2) return null;
                  return (
                    <div
                      key={p.id}
                      onClick={() => togglePlayerTeam(p.id)}
                      className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/30 flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-semibold text-white">{formatDisplayName(p.name)}</span>
                      <span className="text-[10px] text-amber-300">{p.stats.padelyPoints ?? 1000} PP</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          <p className="text-[10px] text-purple-300/60 text-center">
            Click on a player card to swap them between Team 1 and Team 2. Select the radio button above for the winning team.
          </p>

          {/* Score Input */}
          <div>
            <label className="block font-bold text-purple-300 mb-1">Match Score</label>
            <input
              type="text"
              value={score}
              onChange={e => setScore(e.target.value)}
              placeholder="e.g. 6-4, 6-3"
              className="w-full px-3.5 py-2.5 bg-purple-950/60 border border-purple-800/40 rounded-xl text-white font-bold"
              required
            />
          </div>

          {/* Ranking Rule Info */}
          <div className="p-3 bg-purple-950/40 border border-purple-900/40 rounded-2xl text-[11px] text-purple-200/80 space-y-1">
            <div className="font-bold text-amber-300">Padely Points Calculation Rules:</div>
            <div>• Winners receive <strong className="text-emerald-400">+20 PP</strong> (or +30 for upset / +10 for weak opponent)</div>
            <div>• Losers lose <strong className="text-red-400">-10 PP</strong> (or -15 / -5)</div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || joinedPlayers.length === 0}
            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{match.isResultConfirmed ? 'Update Match Result & Points' : 'Confirm Result & Award Points'}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
