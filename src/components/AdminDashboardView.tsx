import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreateMatchModal } from './CreateMatchModal';
import { AdminEditPlayerModal } from './AdminEditPlayerModal';
import { ConfirmMatchResultModal } from './ConfirmMatchResultModal';
import { AdminEditCourtModal } from './AdminEditCourtModal';
import { Match, User, Court } from '../types';
import { 
  Shield, Plus, DollarSign, Calendar, Users, TrendingUp, Edit, Trash2, 
  Search, AlertTriangle, ShieldCheck, RefreshCw, BarChart2, CheckCircle2, XCircle, Trophy, RotateCcw, Power, Building, Navigation
} from 'lucide-react';
import { formatDateDDMMYYYY } from '../utils/formatters';
import { UserAvatar } from './UserAvatar';
import padelyLogo from '../assets/images/Padely.png';

export const AdminDashboardView: React.FC = () => {
  const { 
    matches, 
    users, 
    payments, 
    courts,
    deleteCourt,
    cancelMatch, 
    activateMatch,
    deactivateMatch,
    openUserProfile,
    openMatchDetails,
    adminAssignPlayerToMatch,
    removePlayerFromMatch,
    resetToDefaultData,
    resetAllRankings,
    showNotification,
    currentUser,
    firebaseUser,
    loginWithGoogle,
    logout,
    setCurrentView,
    isLeaderboardDisabled,
    toggleLeaderboardDisabled
  } = useApp();

  const ADMIN_EMAIL = 'luca.mergell@gmail.com';
  const loggedInEmail = (firebaseUser?.email || currentUser?.email || '').toLowerCase();
  const isAuthorizedAdmin = loggedInEmail === ADMIN_EMAIL;

  const [activeTab, setActiveTab] = useState<'analytics' | 'matches' | 'players' | 'payments' | 'courts'>('analytics');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | undefined>(undefined);
  const [editingPlayerUser, setEditingPlayerUser] = useState<User | null>(null);
  const [confirmingMatchResult, setConfirmingMatchResult] = useState<Match | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [assignPlayerForMatch, setAssignPlayerForMatch] = useState<{ [matchId: string]: string }>({});
  const [assignMatchForPlayer, setAssignMatchForPlayer] = useState<{ [userId: string]: string }>({});

  const [isEditCourtModalOpen, setIsEditCourtModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | undefined>(undefined);
  const [selectedCourtForNewMatch, setSelectedCourtForNewMatch] = useState<string | undefined>(undefined);

  const [matchSearch, setMatchSearch] = useState('');
  const [playerSearch, setPlayerSearch] = useState('');
  const [playerSort, setPlayerSort] = useState<'newest' | 'oldest' | 'matches' | 'points' | 'name'>('newest');

  const formatRegistrationDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // 1. Guard: Not Logged In
  if (!loggedInEmail) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-[#120a21]/90 backdrop-blur-xl border border-purple-900/40 rounded-3xl p-8 text-center shadow-2xl space-y-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <img 
              src={padelyLogo} 
              alt="Padely Logo" 
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-400/40 shadow-xl shadow-purple-950/60" 
            />
            <h2 className="text-xl font-black text-white">Padely Admin</h2>
            <p className="text-xs text-purple-300/70">Sign in with Google to continue</p>
          </div>
          <button
            onClick={() => loginWithGoogle()}
            className="w-full py-4 px-6 rounded-2xl bg-white text-zinc-950 font-bold text-sm flex items-center justify-center gap-3 hover:bg-purple-100 transition-all shadow-xl active:scale-95 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Login with Google</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Guard: Logged In as Unauthorized Email
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#120a21] border border-red-800/50 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-600/50 flex items-center justify-center mx-auto text-red-400 shadow-xl">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Access Restricted</h2>
            <p className="text-xs text-red-300/80 mt-1">
              Unauthorized Google Account
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/30 text-xs text-purple-200/90 text-left space-y-2">
            <p>
              You do not have permission to access the Padely Admin Panel.
            </p>
            <p className="text-purple-300/70 text-[11px]">
              Currently logged in as: <span className="text-amber-300 font-mono font-bold">{loggedInEmail}</span>
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={async () => {
                await logout();
                await loginWithGoogle();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95"
            >
              <span>Login with Authorized Google Account</span>
            </button>
            <button
              onClick={() => setCurrentView('landing')}
              className="w-full py-2.5 px-4 rounded-2xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 font-bold text-xs border border-purple-800/30 transition-all"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Business Analytics Calculations
  const totalRevenueGel = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amountGel, 0);

  const totalCourtCostsGel = matches.reduce((sum, m) => sum + m.courtCostGel, 0);
  const netMarginGel = totalRevenueGel - totalCourtCostsGel;

  const totalOrganizedMatches = matches.length;
  const totalSpotsAcrossMatches = matches.reduce((sum, m) => sum + m.totalSpots, 0);
  const totalJoinedAcrossMatches = matches.reduce((sum, m) => sum + m.joinedUserIds.length, 0);
  const fillRatePercentage = totalSpotsAcrossMatches > 0
    ? Number(((totalJoinedAcrossMatches / totalSpotsAcrossMatches) * 100).toFixed(1))
    : 0;

  // Filter out placeholder users for admin view
  const realUsers = users.filter(
    u => !u.isPlaceholder && !u.id.startsWith('ph_') && !u.id.startsWith('placeholder_') && !u.email?.includes('placeholder')
  );

  const mostActivePlayers = [...realUsers]
    .sort((a, b) => b.stats.totalMatches - a.stats.totalMatches)
    .slice(0, 4);

  const recentlyRegisteredUsers = [...realUsers]
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 4);

  // Filtered lists
  const filteredMatches = matches.filter(m => 
    `${m.title} ${m.locationName} ${m.district}`.toLowerCase().includes(matchSearch.toLowerCase())
  );

  const filteredPlayers = realUsers
    .filter(u => `${u.name} ${u.email} ${u.location}`.toLowerCase().includes(playerSearch.toLowerCase()))
    .sort((a, b) => {
      if (playerSort === 'newest') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }
      if (playerSort === 'oldest') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeA - timeB;
      }
      if (playerSort === 'matches') {
        return (b.stats?.totalMatches || 0) - (a.stats?.totalMatches || 0);
      }
      if (playerSort === 'points') {
        return (b.stats?.padelyPoints ?? b.stats?.skillRating ?? 1000) - (a.stats?.padelyPoints ?? a.stats?.skillRating ?? 1000);
      }
      if (playerSort === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  return (
    <div className="min-h-screen text-white py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Admin Header & Switch Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-900/40 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-600/50 flex items-center justify-center text-amber-400 font-bold shadow-xl">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">Padely Owner & Admin Control</h1>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/40 text-[10px] font-extrabold uppercase">
                  Private Panel
                </span>
              </div>
              <p className="text-xs text-purple-300/70">
                Manage Tbilisi matches, adjust player statistics, review revenue in GEL, and issue refunds
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingMatch(undefined);
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Match</span>
            </button>

            <button
              onClick={resetToDefaultData}
              title="Reset initial dataset"
              className="p-2.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-800/30 text-xs transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 bg-[#120a21] p-1.5 rounded-2xl border border-purple-900/40 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'analytics' ? 'bg-amber-600 text-white shadow-lg' : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Business Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'matches' ? 'bg-amber-600 text-white shadow-lg' : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Match Management ({matches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('players')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'players' ? 'bg-amber-600 text-white shadow-lg' : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Player Profiles & Stats ({realUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'payments' ? 'bg-amber-600 text-white shadow-lg' : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Payments & Refunds ({payments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('courts')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'courts' ? 'bg-amber-600 text-white shadow-lg' : 'text-purple-300/70 hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Pre-Made Courts ({courts.length})</span>
          </button>
        </div>

        {/* TAB 1: Business Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* High Level KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-2xl bg-[#120a21] border border-amber-900/30 space-y-1">
                <div className="text-[10px] text-amber-300/80 font-bold uppercase tracking-wider">
                  Total Player Revenue
                </div>
                <div className="text-3xl font-black text-emerald-400">{totalRevenueGel} GEL</div>
                <div className="text-[10px] text-purple-300/60">Collected player participation fees</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#120a21] border border-amber-900/30 space-y-1">
                <div className="text-[10px] text-amber-300/80 font-bold uppercase tracking-wider">
                  Court Rental Costs
                </div>
                <div className="text-3xl font-black text-white">{totalCourtCostsGel} GEL</div>
                <div className="text-[10px] text-purple-300/60">Court rent paid to Tbilisi clubs</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#120a21] border border-amber-900/30 space-y-1">
                <div className="text-[10px] text-amber-300/80 font-bold uppercase tracking-wider">
                  Estimated Net Margin
                </div>
                <div className={`text-3xl font-black ${netMarginGel >= 0 ? 'text-amber-300' : 'text-red-400'}`}>
                  {netMarginGel} GEL
                </div>
                <div className="text-[10px] text-purple-300/60">Padely organizer profit difference</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#120a21] border border-amber-900/30 space-y-1">
                <div className="text-[10px] text-amber-300/80 font-bold uppercase tracking-wider">
                  Match Fill Rate
                </div>
                <div className="text-3xl font-black text-indigo-300">{fillRatePercentage}%</div>
                <div className="text-[10px] text-purple-300/60">
                  {totalJoinedAcrossMatches}/{totalSpotsAcrossMatches} total player spots filled
                </div>
              </div>

            </div>

            {/* Platform Controls */}
            <div className="p-5 rounded-3xl bg-[#120a21] border border-amber-900/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Leaderboard Status Control</h3>
                    <p className="text-[11px] text-purple-300/70">
                      Temporarily disable or enable the public leaderboard for all players
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                  isLeaderboardDisabled 
                    ? 'bg-red-950/80 border-red-600/50 text-red-300' 
                    : 'bg-emerald-950/80 border-emerald-600/50 text-emerald-300'
                }`}>
                  {isLeaderboardDisabled ? 'DISABLED' : 'ACTIVE'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/30 flex items-center justify-between text-xs gap-3">
                <span className="text-purple-200">
                  {isLeaderboardDisabled 
                    ? 'The leaderboard is currently hidden from players with an admin notice.' 
                    : 'The leaderboard is active and publicly accessible.'}
                </span>
                <button
                  onClick={toggleLeaderboardDisabled}
                  className={`px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 ${
                    isLeaderboardDisabled
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-red-600 hover:bg-red-500 text-white'
                  }`}
                >
                  {isLeaderboardDisabled ? 'Enable Leaderboard' : 'Disable Leaderboard'}
                </button>
              </div>
            </div>

            {/* Business Mechanics, Most Active Players & Recently Registered */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-3xl bg-[#120a21] border border-purple-900/40 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>Padely Business Mechanics</span>
                </h3>

                <p className="text-xs text-purple-200/80 leading-relaxed">
                  Padely rents padel court slots across Tbilisi clubs (e.g. 80 GEL per 90 mins). 4 players pay 25 GEL each = 100 GEL collected. The 20 GEL difference covers organizing overhead, balls, and Padely profit margin.
                </p>

                <div className="p-3 bg-purple-950/40 rounded-2xl border border-purple-800/30 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Total Matches Organized:</span>
                    <strong className="text-white">{totalOrganizedMatches} matches</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Total Registered Players:</span>
                    <strong className="text-white">{realUsers.length} players</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Refund Guarantee Compliance:</span>
                    <strong className="text-emerald-400 font-bold">100% Active</strong>
                  </div>
                </div>
              </div>

              {/* Most Active Players */}
              <div className="p-5 rounded-3xl bg-[#120a21] border border-purple-900/40 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Most Active Tbilisi Players</span>
                </h3>

                <div className="space-y-2">
                  {mostActivePlayers.map((player, idx) => (
                    <div
                      key={player.id}
                      onClick={() => openUserProfile(player.id)}
                      className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-800/30 flex items-center justify-between cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-bold text-amber-400 w-4 shrink-0">#{idx + 1}</span>
                        <UserAvatar name={player.name} userId={player.id} className="w-8 h-8 rounded-lg text-xs font-bold shrink-0" />
                        <div className="truncate">
                          <div className="font-bold text-white truncate">{player.name}</div>
                          <div className="text-[10px] text-purple-300/70 truncate">{player.location}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-bold text-white">{player.stats.totalMatches} matches</div>
                        <div className="text-[10px] text-emerald-400">{player.stats.padelyPoints ?? player.stats.skillRating ?? 1000} PP</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recently Registered Players */}
              <div className="p-5 rounded-3xl bg-[#120a21] border border-purple-900/40 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>Recent Registrations</span>
                  </span>
                  <span className="text-[10px] text-purple-300/80 font-normal">
                    Latest {recentlyRegisteredUsers.length}
                  </span>
                </h3>

                <div className="space-y-2">
                  {recentlyRegisteredUsers.map((player) => (
                    <div
                      key={player.id}
                      onClick={() => openUserProfile(player.id)}
                      className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-800/30 flex items-center justify-between cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <UserAvatar name={player.name} userId={player.id} className="w-8 h-8 rounded-lg text-xs font-bold shrink-0" />
                        <div className="truncate min-w-0">
                          <div className="font-bold text-white truncate">{player.name}</div>
                          <div className="text-[10px] text-purple-300/70 truncate">{player.email}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] font-bold text-amber-300">
                          {formatRegistrationDate(player.createdAt)}
                        </div>
                        <div className="text-[9px] text-purple-300/70">{player.skillLevel}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: Match Management */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            
            {/* Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter matches by title or club..."
                  value={matchSearch}
                  onChange={e => setMatchSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#120a21] border border-purple-800/40 rounded-xl text-xs text-white"
                />
              </div>

              <button
                onClick={() => {
                  setEditingMatch(undefined);
                  setIsCreateModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Match</span>
              </button>
            </div>

            {/* Matches List */}
            <div className="bg-[#120a21] rounded-3xl border border-purple-900/40 overflow-hidden text-xs">
              <div className="p-4 bg-purple-950/40 border-b border-purple-900/30 grid grid-cols-12 font-bold text-purple-300 uppercase tracking-wider text-[10px]">
                <div className="col-span-4">Match & Location</div>
                <div className="col-span-3">Date & Time</div>
                <div className="col-span-2">Spots / Players</div>
                <div className="col-span-1">Price (GEL)</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              <div className="divide-y divide-purple-900/30">
                {filteredMatches.map((m) => {
                  const isExpanded = expandedMatchId === m.id;
                  const joinedPlayers = users.filter(u => m.joinedUserIds.includes(u.id));
                  const availablePlayersForMatch = users.filter(u => !m.joinedUserIds.includes(u.id));

                  return (
                    <div key={m.id} className="divide-y divide-purple-900/20">
                      <div className="p-4 grid grid-cols-12 items-center hover:bg-purple-900/20 transition-colors">
                        
                        {/* Title & Location */}
                        <div className="col-span-4 pr-2 flex items-center gap-2.5">
                          <img 
                            src={m.imageUrl || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800'} 
                            alt={m.title} 
                            className="w-10 h-10 rounded-lg object-cover shrink-0 ring-1 ring-purple-600/40 cursor-pointer"
                            onClick={() => openMatchDetails(m.id)}
                          />
                          <div>
                            <div 
                              onClick={() => openMatchDetails(m.id)}
                              className="font-bold text-white hover:text-purple-300 transition-colors cursor-pointer line-clamp-1"
                            >
                              {m.title}
                            </div>
                            <div className="text-[10px] text-purple-300/70">📍 {m.locationName} ({m.district})</div>
                          </div>
                        </div>

                        {/* Date & Time */}
                        <div className="col-span-3">
                          <div className="font-semibold text-purple-200">{m.dayOfWeek}, {formatDateDDMMYYYY(m.date)}</div>
                          <div className="text-[10px] text-purple-300/70">{m.startTime} ({m.durationMinutes}m)</div>
                        </div>

                        {/* Spots */}
                        <div className="col-span-2 flex items-center gap-1.5">
                          <button
                            onClick={() => setExpandedMatchId(isExpanded ? null : m.id)}
                            className={`px-2 py-0.5 rounded font-bold text-[10px] transition-all flex items-center gap-1 ${
                              m.status === 'Cancelled'
                                ? 'bg-red-950 text-red-400 border border-red-800/40'
                                : m.joinedUserIds.length >= m.totalSpots
                                ? 'bg-zinc-800 text-zinc-300 border border-zinc-700/40'
                                : 'bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700/40 cursor-pointer'
                            }`}
                            title="Click to view & manage player roster"
                          >
                            <Users className="w-3 h-3 text-purple-400" />
                            <span>{m.status === 'Cancelled' ? 'Deactivated' : `${m.joinedUserIds.length}/${m.totalSpots} Roster`}</span>
                          </button>
                        </div>

                        {/* Price */}
                        <div className="col-span-1 font-bold text-emerald-400">
                          {m.pricePerPlayerGel} GEL
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex items-center justify-end gap-1.5">
                          {m.status !== 'Cancelled' && (
                            <button
                              onClick={() => setConfirmingMatchResult(m)}
                              title="Record Match Score & Award Padely Points"
                              className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 ${
                                m.isResultConfirmed 
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50' 
                                  : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-600/50'
                              }`}
                            >
                              <Trophy className="w-3 h-3" />
                              <span>{m.isResultConfirmed ? 'Result Confirmed' : 'Record Result'}</span>
                            </button>
                          )}

                          <button
                            onClick={() => setExpandedMatchId(isExpanded ? null : m.id)}
                            title="Manage Roster & Assign/Remove Players"
                            className="p-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/30 cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setEditingMatch(m);
                              setIsCreateModalOpen(true);
                            }}
                            title="Edit Match Details"
                            className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/30 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {m.status === 'Cancelled' ? (
                            <button
                              onClick={() => activateMatch(m.id)}
                              title="Activate Match (Publish to Players)"
                              className="px-2 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Activate</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => deactivateMatch(m.id)}
                              title="Deactivate Match"
                              className="px-2 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <Power className="w-3 h-3 text-red-400" />
                              <span>Deactivate</span>
                            </button>
                          )}
                        </div>

                      </div>

                      {/* Expanded Match Roster Drawer */}
                      {isExpanded && (
                        <div className="p-4 bg-purple-950/30 border-t border-purple-900/40 space-y-3 animate-fadeIn">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-amber-400" />
                              <span>Player Roster Management for "{m.title}"</span>
                            </span>
                            
                            <div className="flex items-center gap-2">
                              {m.status === 'Cancelled' ? (
                                <button
                                  onClick={() => activateMatch(m.id)}
                                  className="px-2.5 py-1 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Activate Match</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => deactivateMatch(m.id)}
                                  className="px-2.5 py-1 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Power className="w-3.5 h-3.5 text-red-400" />
                                  <span>Deactivate Match</span>
                                </button>
                              )}
                              <span className="text-[10px] text-purple-300">
                                {m.joinedUserIds.length}/{m.totalSpots} spots filled
                              </span>
                            </div>
                          </div>

                          {/* Roster List */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                            {joinedPlayers.map((player) => (
                              <div
                                key={player.id}
                                className="flex items-center justify-between p-2 rounded-xl bg-[#120a21] border border-purple-800/40"
                              >
                                <div 
                                  className="flex items-center gap-2 cursor-pointer min-w-0 flex-1 pr-1"
                                  onClick={() => openUserProfile(player.id)}
                                >
                                  <UserAvatar name={player.name} userId={player.id} className="w-7 h-7 rounded-lg text-[10px] font-bold ring-1 ring-purple-600/40 shrink-0" />
                                  <div className="truncate">
                                    <div className="font-bold text-white text-[11px] truncate">{player.name}</div>
                                    <div className="text-[9px] text-purple-300/70">{player.skillLevel}</div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => removePlayerFromMatch(m.id, player.id)}
                                  title="Remove player from match"
                                  className="p-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-800/30 shrink-0 cursor-pointer"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}

                            {Array.from({ length: Math.max(0, m.totalSpots - m.joinedUserIds.length) }).map((_, i) => (
                              <div key={i} className="p-2 rounded-xl border border-dashed border-purple-800/40 text-purple-400/50 flex items-center justify-center text-[10px] font-semibold">
                                Empty Spot #{m.joinedUserIds.length + i + 1}
                              </div>
                            ))}
                          </div>

                          {/* Quick Assign Dropdown */}
                          {m.joinedUserIds.length < m.totalSpots && availablePlayersForMatch.length > 0 && (
                            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2 border-t border-purple-900/30">
                              <span className="text-[11px] font-bold text-purple-200 shrink-0">Assign Player:</span>
                              <select
                                value={assignPlayerForMatch[m.id] || ''}
                                onChange={(e) => setAssignPlayerForMatch({ ...assignPlayerForMatch, [m.id]: e.target.value })}
                                className="flex-1 w-full px-3 py-1.5 bg-[#120a21] border border-purple-800/40 rounded-xl text-xs text-white"
                              >
                                <option value="">-- Choose Registered Player --</option>
                                {availablePlayersForMatch.map(p => (
                                  <option key={p.id} value={p.id}>
                                    {p.name} ({p.skillLevel} • {p.stats.padelyPoints ?? 1000} PP)
                                  </option>
                                ))}
                              </select>
                              <button
                                disabled={!assignPlayerForMatch[m.id]}
                                onClick={() => {
                                  const pid = assignPlayerForMatch[m.id];
                                  if (pid) {
                                    adminAssignPlayerToMatch(m.id, pid);
                                    setAssignPlayerForMatch({ ...assignPlayerForMatch, [m.id]: '' });
                                  }
                                }}
                                className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-xs cursor-pointer shadow"
                              >
                                Assign Player
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: Player Management & Profile Editing */}
        {activeTab === 'players' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search player by name, email or district..."
                  value={playerSearch}
                  onChange={e => setPlayerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#120a21] border border-purple-800/40 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-300 font-bold shrink-0">Sort By:</span>
                <select
                  value={playerSort}
                  onChange={e => setPlayerSort(e.target.value as any)}
                  className="px-3 py-2 bg-[#120a21] border border-purple-800/40 rounded-xl text-xs text-amber-300 font-semibold cursor-pointer"
                >
                  <option value="newest">Newest Registered First</option>
                  <option value="oldest">Oldest Registered First</option>
                  <option value="matches">Most Matches Played</option>
                  <option value="points">Highest PadelyPoints</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>

            <div className="bg-[#120a21] rounded-3xl border border-purple-900/40 overflow-hidden text-xs">
              <div className="p-4 bg-purple-950/40 border-b border-purple-900/30 grid grid-cols-12 font-bold text-purple-300 uppercase tracking-wider text-[10px]">
                <div className="col-span-3">Player Info & Reg. Date</div>
                <div className="col-span-2">Skill & Position</div>
                <div className="col-span-2">Matches & Wins</div>
                <div className="col-span-1">PadelyPoints</div>
                <div className="col-span-2">Assign to Open Match</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              <div className="divide-y divide-purple-900/30">
                {filteredPlayers.map((player) => {
                  const openMatchesForPlayer = matches.filter(
                    m => m.status !== 'Cancelled' && m.joinedUserIds.length < m.totalSpots && !m.joinedUserIds.includes(player.id)
                  );

                  return (
                    <div key={player.id} className="p-4 grid grid-cols-12 items-center hover:bg-purple-900/20 transition-colors gap-1">
                      
                      {/* Player Info */}
                      <div 
                        onClick={() => openUserProfile(player.id)}
                        className="col-span-3 flex items-center gap-2.5 cursor-pointer min-w-0"
                      >
                        <UserAvatar name={player.name} userId={player.id} className="w-9 h-9 rounded-xl text-xs font-bold ring-2 ring-purple-600/30 shrink-0" />
                        <div className="truncate min-w-0">
                          <div className="font-bold text-white flex items-center gap-1 truncate hover:text-purple-300 transition-colors">
                            <span className="truncate">{player.name}</span>
                            {player.role === 'admin' && <span className="text-[9px] text-amber-300 font-bold shrink-0">(Admin)</span>}
                          </div>
                          <div className="text-[10px] text-purple-300/70 truncate">{player.email} • {player.location}</div>
                          <div className="text-[10px] text-amber-300/90 font-medium flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate">Reg: {formatRegistrationDate(player.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Skill & Position */}
                      <div className="col-span-2 space-y-0.5">
                        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-200 border border-purple-800/40 text-[10px] font-bold inline-block">
                          {player.skillLevel}
                        </span>
                        <div className="text-[10px] text-purple-300/70">{player.preferredPosition}</div>
                      </div>

                      {/* Matches & Wins */}
                      <div className="col-span-2">
                        <div className="font-bold text-white">{player.stats.totalMatches} matches</div>
                        <div className="text-[10px] text-emerald-400">{player.stats.wins}W - {player.stats.losses}L ({player.stats.winPercentage}%)</div>
                      </div>

                      {/* PP */}
                      <div className="col-span-1 font-black text-amber-300 text-xs">
                        {player.stats.padelyPoints ?? player.stats.skillRating ?? 1000} PP
                      </div>

                      {/* Assign to Match Dropdown */}
                      <div className="col-span-2 flex items-center gap-1">
                        <select
                          value={assignMatchForPlayer[player.id] || ''}
                          onChange={(e) => setAssignMatchForPlayer({ ...assignMatchForPlayer, [player.id]: e.target.value })}
                          className="w-full px-2 py-1 bg-purple-950/60 border border-purple-800/40 rounded-lg text-[10px] text-white truncate"
                        >
                          <option value="">-- Assign Match --</option>
                          {openMatchesForPlayer.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.title} ({m.joinedUserIds.length}/{m.totalSpots})
                            </option>
                          ))}
                        </select>
                        <button
                          disabled={!assignMatchForPlayer[player.id]}
                          onClick={() => {
                            const mid = assignMatchForPlayer[player.id];
                            if (mid) {
                              adminAssignPlayerToMatch(mid, player.id);
                              setAssignMatchForPlayer({ ...assignMatchForPlayer, [player.id]: '' });
                            }
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-[10px] cursor-pointer shrink-0"
                          title="Assign player to selected match"
                        >
                          Assign
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 text-right">
                        <button
                          onClick={() => setEditingPlayerUser(player)}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] shadow transition-all cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit Profile & Stats</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: Payments & Refund Audit Log */}
        {activeTab === 'payments' && (
          <div className="bg-[#120a21] rounded-3xl border border-purple-900/40 overflow-hidden text-xs space-y-2">
            <div className="p-4 bg-purple-950/40 border-b border-purple-900/30 flex items-center justify-between">
              <h3 className="font-bold text-purple-200 uppercase tracking-wider text-xs">
                Transaction & Refund Log ({payments.length})
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold">100% Refund Policy Active</span>
            </div>

            <div className="divide-y divide-purple-900/30">
              {payments.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-purple-900/20">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{p.userName}</div>
                    <div className="text-[10px] text-purple-300/70">{p.matchTitle} • Via {p.paymentMethod}</div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-white">{p.amountGel} GEL</div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Pre-Made Courts Management */}
        {activeTab === 'courts' && (
          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#120a21] rounded-2xl border border-purple-900/40">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-400" />
                  <span>Pre-Made Padel Courts / Stadiums</span>
                </h3>
                <p className="text-[11px] text-purple-300/70">
                  Pre-configure venues with addresses, maps, default prices & pictures to create matches in 1 click!
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCourt(undefined);
                  setIsEditCourtModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Pre-Made Court</span>
              </button>
            </div>

            {courts.length === 0 ? (
              <div className="p-8 text-center bg-[#120a21] rounded-2xl border border-purple-900/30 text-purple-300/70">
                No pre-made courts yet. Click "Add Pre-Made Court" to create your first venue.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courts.map((court) => (
                  <div key={court.id} className="bg-[#120a21] border border-purple-900/40 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
                    <div>
                      {/* Image Banner */}
                      <div className="relative h-36 w-full bg-purple-950">
                        <img 
                          src={court.imageUrl || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800'} 
                          alt={court.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#120a21] via-transparent to-black/30" />
                        <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/40 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          📍 {court.district}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-white text-sm">{court.nameKa || court.name}</h4>
                            <p className="text-[11px] text-purple-300/70">{court.nameEn || court.name}</p>
                          </div>
                        </div>

                        <p className="text-[11px] text-purple-300/80 flex items-center gap-1">
                          <Navigation className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{court.addressKa || court.address}</span>
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-900/30 text-[11px]">
                          <div className="p-2 bg-purple-950/40 rounded-xl border border-purple-800/30">
                            <span className="block text-[9px] text-purple-300/60 font-semibold">Default Court Cost</span>
                            <span className="font-bold text-white">{court.defaultCourtCostGel || 80} GEL</span>
                          </div>
                          <div className="p-2 bg-purple-950/40 rounded-xl border border-purple-800/30">
                            <span className="block text-[9px] text-purple-300/60 font-semibold">Price per Player</span>
                            <span className="font-bold text-emerald-400">{court.defaultPricePerPlayerGel || 25} GEL</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-3 bg-purple-950/30 border-t border-purple-900/30 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedCourtForNewMatch(court.id);
                          setEditingMatch(undefined);
                          setIsCreateModalOpen(true);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Match Here</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingCourt(court);
                          setIsEditCourtModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 border border-purple-700/40 transition-colors"
                        title="Edit Court"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete pre-made court "${court.nameKa || court.name}"?`)) {
                            deleteCourt(court.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-800/40 transition-colors"
                        title="Delete Court"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Create / Edit Match Modal */}
      {isCreateModalOpen && (
        <CreateMatchModal
          matchToEdit={editingMatch}
          initialSelectedCourtId={selectedCourtForNewMatch}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedCourtForNewMatch(undefined);
          }}
        />
      )}

      {/* Admin Edit Pre-Made Court Modal */}
      {isEditCourtModalOpen && (
        <AdminEditCourtModal
          courtToEdit={editingCourt}
          onClose={() => {
            setIsEditCourtModalOpen(false);
            setEditingCourt(undefined);
          }}
        />
      )}

      {/* Admin Edit Player Stats Modal */}
      {editingPlayerUser && (
        <AdminEditPlayerModal
          user={editingPlayerUser}
          onClose={() => setEditingPlayerUser(null)}
        />
      )}

      {/* Confirm Match Result Modal */}
      {confirmingMatchResult && (
        <ConfirmMatchResultModal
          match={confirmingMatchResult}
          onClose={() => setConfirmingMatchResult(null)}
        />
      )}
    </div>
  );
};
