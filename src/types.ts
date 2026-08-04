export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Pro' | 'Open to All';

export type PlayingPosition = 'Left / Drive' | 'Right / Backhand' | 'Flexible';

export type PlayingStyle = 
  | 'Aggressive Net Specialist'
  | 'Control & Lob Master'
  | 'Defensive Counter-attacker'
  | 'Tactical All-Rounder'
  | 'Power Smasher';

export type MatchStatus = 'Open' | 'Fully Booked' | 'Completed' | 'Cancelled';

export interface PlayerStats {
  totalMatches: number;
  wins: number;
  losses: number;
  winPercentage: number;
  currentStreak: number;
  longestStreak: number;
  hoursPlayed: number;
  matchesThisMonth: number;
  favoritePartner: string;
  rankingPosition: number;
  skillRating: number; // ELO / Rating points
  padelyPoints: number; // Competitive ranking Padely Points (Starts at 1000)
  highestPadelyPoints: number; // Highest rank achieved
  monthlyPadelyPoints: number; // Points gained in current month
}

export interface MatchHistoryItem {
  id: string;
  matchTitle: string;
  locationName: string;
  date: string;
  result: 'Win' | 'Loss';
  score: string;
  partnerName: string;
  opponents: string;
  isRanked?: boolean;
  pointsEarned?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  age: number;
  location: string; // e.g. "Vake, Tbilisi"
  skillLevel: SkillLevel;
  preferredPosition: PlayingPosition;
  playingStyle: PlayingStyle;
  bio?: string;
  stats: PlayerStats;
  matchHistory: MatchHistoryItem[];
  role: 'user' | 'admin';
  isProfileComplete?: boolean;
  createdAt: string;
}

export interface Match {
  id: string;
  title: string;
  locationName: string; // e.g. "Lisi Padel Club"
  address: string; // e.g. "Lisi Lake Road 4, Tbilisi"
  district: string; // e.g. "Lisi" | "Vake" | "Saburtalo" | "Dighomi"
  date: string; // e.g. "2026-08-05"
  dayOfWeek: string; // e.g. "Wednesday"
  startTime: string; // e.g. "18:00"
  durationMinutes: number; // e.g. 90
  totalSpots: number; // Default 4
  joinedUserIds: string[]; // List of user IDs
  skillLevelRequired: SkillLevel;
  courtCostGel: number; // e.g. 80 GEL
  pricePerPlayerGel: number; // e.g. 25 GEL
  description: string;
  status: MatchStatus;
  createdByAdminId: string;
  createdAt: string;
  imageUrl?: string;
  score?: string;
  team1UserIds?: string[];
  team2UserIds?: string[];
  winningTeam?: 1 | 2;
  isResultConfirmed?: boolean;
  ppChanges?: Record<string, number>;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  matchId: string;
  matchTitle: string;
  amountGel: number;
  paymentMethod: 'Bank Transfer' | 'Pay on Court' | 'Apple Pay' | 'Google Pay' | 'Credit Card' | string;
  status: 'Completed' | 'Refunded';
  createdAt: string;
}

export interface FilterState {
  district: string;
  skillLevel: string;
  date: string;
  maxPrice: number;
  searchQuery: string;
  onlyOpen: boolean;
}
