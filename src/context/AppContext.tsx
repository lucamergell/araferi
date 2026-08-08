import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Match, PaymentRecord, PlayerStats, SkillLevel, PlayingPosition, Court } from '../types';
import { INITIAL_USERS, INITIAL_MATCHES, INITIAL_PAYMENTS, INITIAL_COURTS } from '../data/initialData';
import { auth, db, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebaseError';

export type AppView = 'landing' | 'discovery' | 'official-matches' | 'player-matches' | 'profile' | 'rankings' | 'admin' | 'dashboard' | 'terms' | 'privacy';

interface AppContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthLoading: boolean;
  isUsersLoaded: boolean;
  users: User[];
  matches: Match[];
  payments: PaymentRecord[];
  courts: Court[];
  currentView: AppView;
  selectedMatchId: string | null;
  selectedProfileUserId: string | null;
  isAuthModalOpen: boolean;
  isPaymentModalOpen: boolean;
  activeMatchForPayment: Match | null;
  isQuickJoinModalOpen: boolean;
  activeMatchForQuickJoin: Match | null;
  activeQuickJoinUser: User | null;
  notification: { message: string; type: 'success' | 'info' | 'error' } | null;
  isLeaderboardDisabled: boolean;
  
  // Actions
  setCurrentView: (view: AppView) => void;
  openMatchDetails: (matchId: string) => void;
  openUserProfile: (userId: string) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openQuickJoinModal: (match: Match) => void;
  closeQuickJoinModal: () => void;
  handleQuickJoinSuccess: (user: User) => void;
  loginWithGoogle: (customData?: { email: string; name: string; avatar: string }) => Promise<void>;
  logout: () => Promise<void>;
  toggleAdminDemoMode: () => void;
  toggleLeaderboardDisabled: () => Promise<void>;
  
  // Match Actions
  startJoinMatchFlow: (match: Match) => void;
  closePaymentModal: () => void;
  confirmJoinMatch: (paymentMethod: 'Bank Transfer' | 'Pay on Court' | 'Apple Pay' | 'Google Pay' | 'Credit Card' | string) => boolean;
  createMatch: (newMatch: Partial<Match>) => Promise<void>;
  updateMatch: (matchId: string, updatedFields: Partial<Match>) => void;
  cancelMatch: (matchId: string) => void;
  deleteMatch: (matchId: string) => Promise<void>;
  removePlayerFromMatch: (matchId: string, userIdToRemove: string) => Promise<void>;
  activateMatch: (matchId: string) => Promise<void>;
  deactivateMatch: (matchId: string) => Promise<void>;
  confirmMatchResult: (matchId: string, team1UserIds: string[], team2UserIds: string[], winningTeam: 1 | 2, score: string) => Promise<void>;
  removeMatchResult: (matchId: string) => Promise<void>;
  resetAllRankings: () => Promise<void>;
  
  // Admin & User Actions
  updatePlayerStats: (userId: string, newStats: Partial<PlayerStats>) => void;
  updatePlayerProfile: (userId: string, updatedProfile: Partial<User>) => void;
  
  // Pre-Made Courts Actions
  createCourt: (courtData: Omit<Court, 'id' | 'createdAt'>) => Promise<void>;
  updateCourt: (courtId: string, updatedFields: Partial<Court>) => Promise<void>;
  deleteCourt: (courtId: string) => Promise<void>;
  
  // Placeholder Management Actions
  addPlaceholderPlayer: (matchId: string) => Promise<void>;
  fillMatchWithPlaceholders: (matchId: string) => Promise<void>;
  adminAssignPlayerToMatch: (matchId: string, userId: string) => Promise<void>;
  clearPlaceholdersFromMatch: (matchId: string) => Promise<void>;
  
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [courts, setCourts] = useState<Court[]>(INITIAL_COURTS);

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isUsersLoaded, setIsUsersLoaded] = useState<boolean>(false);

  const getInitialView = (): AppView => {
    if (typeof window === 'undefined') return 'landing';
    const path = window.location.pathname;
    if (path === '/admin' || path === '/admin/') return 'admin';
    if (path === '/discovery') return 'discovery';
    if (path === '/rankings') return 'rankings';
    if (path === '/profile') return 'profile';
    return 'landing';
  };

  const [currentView, setCurrentViewInternal] = useState<AppView>(getInitialView);

  const setCurrentView = (view: AppView) => {
    setCurrentViewInternal(view);
    if (typeof window !== 'undefined') {
      const targetPath = view === 'admin' ? '/admin' : view === 'landing' ? '/' : `/${view}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin' || path === '/admin/') setCurrentViewInternal('admin');
      else if (path === '/discovery') setCurrentViewInternal('discovery');
      else if (path === '/rankings') setCurrentViewInternal('rankings');
      else if (path === '/profile') setCurrentViewInternal('profile');
      else setCurrentViewInternal('landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [activeMatchForPayment, setActiveMatchForPayment] = useState<Match | null>(null);
  const [isQuickJoinModalOpen, setIsQuickJoinModalOpen] = useState<boolean>(false);
  const [activeMatchForQuickJoin, setActiveMatchForQuickJoin] = useState<Match | null>(null);
  const [activeQuickJoinUser, setActiveQuickJoinUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isLeaderboardDisabled, setIsLeaderboardDisabled] = useState<boolean>(false);

  const openQuickJoinModal = (match: Match) => {
    setActiveMatchForQuickJoin(match);
    setIsQuickJoinModalOpen(true);
  };

  const closeQuickJoinModal = () => {
    setIsQuickJoinModalOpen(false);
    setActiveMatchForQuickJoin(null);
  };

  const handleQuickJoinSuccess = (user: User) => {
    setActiveQuickJoinUser(user);
    if (activeMatchForQuickJoin) {
      setActiveMatchForPayment(activeMatchForQuickJoin);
      setIsPaymentModalOpen(true);
    }
    setIsQuickJoinModalOpen(false);
  };

  // Firestore listener for app settings (leaderboard status)
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'appSettings'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (typeof data.isLeaderboardDisabled === 'boolean') {
            setIsLeaderboardDisabled(data.isLeaderboardDisabled);
          }
        }
      },
      (error) => {
        console.warn('Settings listener note:', error);
      }
    );
    return () => unsub();
  }, []);

  const usersRef = React.useRef(users);
  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  // Handle mobile auth redirect result
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          showNotification(`Signed in with Google as ${result.user.displayName}!`, 'success');
        }
      })
      .catch((error) => {
        console.error('Redirect sign-in error:', error);
        if (error?.code !== 'auth/redirect-cancelled-by-user' && error?.code !== 'auth/cancelled-popup-request') {
          showNotification('Google Sign-In failed or was cancelled.', 'error');
        }
      });
  }, []);

  // Sync with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userUid = fbUser.uid;
        const fbEmail = (fbUser.email || '').toLowerCase();
        
        try {
          // Direct fetch from Firestore is necessary because the local `users` state list
          // has a loading delay on refresh, which previously caused race conditions that overwrote existing profiles.
          const userDocRef = doc(db, 'users', userUid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as User;
            setUsers(prev => {
              if (prev.some(u => u.id === userUid)) {
                return prev.map(u => u.id === userUid ? { ...u, ...userData } : u);
              }
              return [...prev, userData];
            });
            setCurrentUserId(userUid);
          } else {
            // Create new user profile in Firestore only if they don't exist yet
            const newUser: User = {
              id: userUid,
              name: fbUser.displayName || 'Padel Player',
              email: fbUser.email || 'player@padely.ge',
              avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
              age: 0,
              location: 'Tbilisi',
              skillLevel: 'Intermediate',
              preferredPosition: 'Flexible',
              bio: '',
              stats: {
                totalMatches: 0,
                wins: 0,
                losses: 0,
                winPercentage: 0,
                currentStreak: 0,
                longestStreak: 0,
                hoursPlayed: 0,
                matchesThisMonth: 0,
                favoritePartner: 'None yet',
                rankingPosition: usersRef.current.length + 1,
                skillRating: 1000,
                padelyPoints: 1000,
                highestPadelyPoints: 1000,
                monthlyPadelyPoints: 0,
              },
              matchHistory: [],
              role: fbEmail === 'luca.mergell@gmail.com' ? 'admin' : 'user',
              isProfileComplete: false,
              createdAt: new Date().toISOString(),
            };

            await setDoc(userDocRef, newUser, { merge: true });
            setUsers(prev => {
              if (prev.some(u => u.id === userUid)) {
                return prev.map(u => u.id === userUid ? { ...u, ...newUser } : u);
              }
              return [...prev, newUser];
            });
            setCurrentUserId(userUid);
          }
        } catch (e) {
          console.error('Error on auth check:', e);
          // Fallback to checking local state if firestore read fails
          const existing = usersRef.current.find(u => u.id === userUid || (u.email && u.email.toLowerCase() === fbEmail));
          if (existing) {
            setCurrentUserId(existing.id);
          } else {
            setCurrentUserId(userUid);
          }
        }
      } else {
        setCurrentUserId(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Firestore Real-time listener for USERS
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const loadedUsers: User[] = [];
        snapshot.forEach(docSnap => {
          const uData = docSnap.data() as User;
          if (!uData.createdAt) {
            uData.createdAt = new Date().toISOString();
          }
          loadedUsers.push(uData);
        });
        setUsers(loadedUsers);
        setIsUsersLoaded(true);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'users');
        setIsUsersLoaded(true);
      }
    );
    return () => unsub();
  }, []);

  // Firestore Real-time listener for MATCHES
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'matches'),
      (snapshot) => {
        const loadedMatches: Match[] = [];
        snapshot.forEach(docSnap => {
          loadedMatches.push(docSnap.data() as Match);
        });
        setMatches(loadedMatches.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'matches');
      }
    );
    return () => unsub();
  }, []);

  // Firestore Real-time listener for PAYMENTS
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'payments'),
      (snapshot) => {
        const loadedPayments: PaymentRecord[] = [];
        snapshot.forEach(docSnap => {
          loadedPayments.push(docSnap.data() as PaymentRecord);
        });
        setPayments(loadedPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'payments');
      }
    );
    return () => unsub();
  }, []);

  // Firestore Real-time listener for COURTS
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'courts'),
      (snapshot) => {
        if (snapshot.empty) {
          setCourts([]);
        } else {
          const loadedCourts: Court[] = [];
          snapshot.forEach(docSnap => {
            loadedCourts.push(docSnap.data() as Court);
          });
          setCourts(loadedCourts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'courts');
        setCourts([]);
      }
    );
    return () => unsub();
  }, []);

  const currentUser = firebaseUser ? (() => {
    const found = users.find(u => u.id === currentUserId || (u.email && u.email.toLowerCase() === (firebaseUser.email || '').toLowerCase()));
    const userId = found?.id || firebaseUser.uid;
    const hasPhone = Boolean(found?.phoneNumber && found.phoneNumber.trim() !== '');
    const isCompleted = (Boolean(found?.isProfileComplete) || localStorage.getItem(`padely_onboarding_completed_${userId}`) === 'true') && hasPhone;

    if (found) {
      return { ...found, isProfileComplete: isCompleted };
    }

    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'Padel Player',
      email: firebaseUser.email || '',
      avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
      age: 26,
      location: 'Tbilisi',
      skillLevel: 'Intermediate',
      preferredPosition: 'Flexible',
      bio: '',
      stats: {
        totalMatches: 0,
        wins: 0,
        losses: 0,
        winPercentage: 0,
        currentStreak: 0,
        longestStreak: 0,
        hoursPlayed: 0,
        matchesThisMonth: 0,
        favoritePartner: 'None',
        rankingPosition: 1,
        skillRating: 1000,
        padelyPoints: 1000,
        highestPadelyPoints: 1000,
        monthlyPadelyPoints: 0,
      },
      matchHistory: [],
      role: (firebaseUser.email || '').toLowerCase() === 'luca.mergell@gmail.com' ? 'admin' : 'user',
      isProfileComplete: isCompleted,
      createdAt: new Date().toISOString()
    };
  })() : null;

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 2500);
  };

  const openMatchDetails = (matchId: string) => {
    setSelectedMatchId(matchId);
  };

  const openUserProfile = (userId: string) => {
    setSelectedProfileUserId(userId);
    setCurrentView('profile');
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginWithGoogle = async (customData?: { email: string; name: string; avatar: string }) => {
    try {
      if (customData) {
        // Custom name sign-in fallback
        const existing = users.find(u => u.email.toLowerCase() === customData.email.toLowerCase());
        if (existing) {
          setCurrentUserId(existing.id);
          showNotification(`Welcome back, ${existing.name}! Signed in.`, 'success');
        } else {
          const newUser: User = {
            id: `usr_${Date.now()}`,
            name: customData.name,
            email: customData.email,
            avatar: customData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
            age: 0,
            location: 'Tbilisi',
            skillLevel: 'Intermediate',
            preferredPosition: 'Flexible',
            bio: '',
            stats: {
              totalMatches: 0,
              wins: 0,
              losses: 0,
              winPercentage: 0,
              currentStreak: 0,
              longestStreak: 0,
              hoursPlayed: 0,
              matchesThisMonth: 0,
              favoritePartner: 'None yet',
              rankingPosition: users.length + 1,
              skillRating: 1000,
              padelyPoints: 1000,
              highestPadelyPoints: 1000,
              monthlyPadelyPoints: 0,
            },
            matchHistory: [],
            role: 'user',
            createdAt: new Date().toISOString(),
          };

          await setDoc(doc(db, 'users', newUser.id), newUser);
          setCurrentUserId(newUser.id);
          showNotification(`Welcome, ${newUser.name}! Account created.`, 'success');
        }
      } else {
        try {
          const res = await signInWithPopup(auth, googleProvider);
          if (res?.user) {
            showNotification(`Signed in with Google as ${res.user.displayName}!`, 'success');
          }
        } catch (popupError: any) {
          console.error('Google Sign-in error:', popupError);
          if (popupError?.code !== 'auth/popup-closed-by-user' && popupError?.code !== 'auth/cancelled-popup-request') {
            showNotification('Google Sign-In failed or was cancelled.', 'error');
          }
        }
      }
    } catch (e: any) {
      console.error('Auth error:', e);
    }
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign-out error:', e);
    }
    setCurrentUserId(null);
    showNotification('Signed out successfully', 'info');
  };

  const toggleAdminDemoMode = () => {
    setCurrentView('admin');
  };

  const toggleLeaderboardDisabled = async () => {
    const newValue = !isLeaderboardDisabled;
    setIsLeaderboardDisabled(newValue);
    try {
      await setDoc(doc(db, 'settings', 'appSettings'), { isLeaderboardDisabled: newValue }, { merge: true });
      showNotification(
        newValue ? 'Leaderboard has been temporarily disabled.' : 'Leaderboard has been enabled.',
        'info'
      );
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'settings/appSettings');
    }
  };

  const startJoinMatchFlow = (match: Match) => {
    if (match.status === 'Cancelled') {
      showNotification('This match has been cancelled.', 'error');
      return;
    }

    if (match.joinedUserIds.length >= match.totalSpots) {
      showNotification('This match is already fully booked!', 'error');
      return;
    }

    if (currentUser) {
      if (!currentUser.isProfileComplete) {
        showNotification('Please complete your profile details first.', 'info');
        return;
      }

      if (match.joinedUserIds.includes(currentUser.id)) {
        showNotification('You have already joined this match!', 'info');
        return;
      }

      setActiveMatchForPayment(match);
      setIsPaymentModalOpen(true);
      return;
    }

    openQuickJoinModal(match);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setActiveMatchForPayment(null);
  };

  const confirmJoinMatch = (paymentMethod: 'Bank Transfer' | 'Pay on Court' | 'Apple Pay' | 'Google Pay' | 'Credit Card' | string): boolean => {
    const targetUser = currentUser || activeQuickJoinUser;
    if (!targetUser || !activeMatchForPayment) return false;

    const matchId = activeMatchForPayment.id;
    if (activeMatchForPayment.joinedUserIds.includes(targetUser.id)) {
      showNotification('You have already joined this match!', 'info');
      closePaymentModal();
      return false;
    }

    if (activeMatchForPayment.joinedUserIds.length >= activeMatchForPayment.totalSpots) {
      showNotification('This match is full!', 'error');
      closePaymentModal();
      return false;
    }

    const updatedJoined = [...activeMatchForPayment.joinedUserIds, targetUser.id];
    const newStatus = updatedJoined.length >= activeMatchForPayment.totalSpots ? 'Fully Booked' : 'Open';

    // 1. Update match in Firestore
    try {
      updateDoc(doc(db, 'matches', matchId), {
        joinedUserIds: updatedJoined,
        status: newStatus,
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `matches/${matchId}`);
    }

    // 2. Create Payment Record in Firestore
    const newPayment: PaymentRecord = {
      id: `pay_${Date.now()}`,
      userId: targetUser.id,
      userName: targetUser.name,
      matchId: activeMatchForPayment.id,
      matchTitle: activeMatchForPayment.title,
      amountGel: activeMatchForPayment.pricePerPlayerGel,
      paymentMethod,
      status: 'Completed',
      createdAt: new Date().toISOString(),
    };

    try {
      setDoc(doc(db, 'payments', newPayment.id), newPayment);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `payments/${newPayment.id}`);
    }

    // 3. Update player stats in Firestore
    const currentStats = targetUser.stats || { totalMatches: 0, matchesThisMonth: 0, hoursPlayed: 0 };
    const newTotal = (currentStats.totalMatches || 0) + 1;
    const newMonth = (currentStats.matchesThisMonth || 0) + 1;
    const newHours = (currentStats.hoursPlayed || 0) + Math.round(activeMatchForPayment.durationMinutes / 60);

    try {
      updateDoc(doc(db, 'users', targetUser.id), {
        'stats.totalMatches': newTotal,
        'stats.matchesThisMonth': newMonth,
        'stats.hoursPlayed': newHours,
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${targetUser.id}`);
    }

    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, joinedUserIds: updatedJoined, status: newStatus } : m));
    setUsers(prev => {
      if (prev.some(u => u.id === targetUser.id)) {
        return prev.map(u => u.id === targetUser.id ? {
          ...u,
          stats: { ...u.stats, totalMatches: newTotal, matchesThisMonth: newMonth, hoursPlayed: newHours }
        } : u);
      }
      return [...prev, targetUser];
    });

    showNotification(
      `Payment of ${activeMatchForPayment.pricePerPlayerGel} GEL confirmed via ${paymentMethod}! You joined ${activeMatchForPayment.title}.`,
      'success'
    );

    closePaymentModal();
    setActiveQuickJoinUser(null);
    return true;
  };

  const createMatch = async (newMatchData: Partial<Match>) => {
    const isPlayerCategory = newMatchData.category === 'player';
    const creatorUser = currentUser;

    const userEmail = (firebaseUser?.email || currentUser?.email || '').toLowerCase();
    const isAdmin = userEmail === 'luca.mergell@gmail.com' || currentUser?.role === 'admin';

    if (!isAdmin) {
      const activeCreatedMatches = matches.filter(m => {
        if (m.status === 'Cancelled' || m.status === 'Completed') return false;
        return Boolean(
          (m.creatorId && m.creatorId === currentUser?.id) ||
          (m.createdByAdminId && m.createdByAdminId === currentUser?.id) ||
          (firebaseUser && m.creatorId === firebaseUser.uid) ||
          (m.creatorName && currentUser?.name && m.creatorName.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
        );
      });

      if (activeCreatedMatches.length >= 1) {
        const lang = localStorage.getItem('padely_language') || 'ka';
        showNotification(
          lang === 'ka'
            ? 'თქვენ უკვე გაქვთ 1 აქტიური მატჩი შექმნილი. ახალი მატჩის შესაქმნელად ჯერ დაასრულეთ ან გააუქმეთ არსებული მატჩი.'
            : 'You can only have 1 active open match created at a time. Please cancel or complete your existing match first.',
          'error'
        );
        return;
      }
    }

    // For player matches, creator automatically joins as the first player
    let initialJoined = newMatchData.joinedUserIds || [];
    if (isPlayerCategory && creatorUser && !initialJoined.includes(creatorUser.id)) {
      initialJoined = [creatorUser.id, ...initialJoined];
    }

    const matchId = `match_${Date.now()}`;
    const totalSpots = newMatchData.totalSpots || 4;

    const newMatch: Match = {
      title: newMatchData.title || 'Padel Match',
      titleKa: newMatchData.titleKa || newMatchData.title || 'პადელის თამაში',
      titleEn: newMatchData.titleEn || newMatchData.title || 'Padel Match',
      locationName: newMatchData.locationName || 'Padel Court',
      locationNameKa: newMatchData.locationNameKa || newMatchData.locationName || 'პადელ კორტი',
      locationNameEn: newMatchData.locationNameEn || newMatchData.locationName || 'Padel Court',
      address: newMatchData.address || 'Tbilisi',
      addressKa: newMatchData.addressKa || newMatchData.address || 'თბილისი',
      addressEn: newMatchData.addressEn || newMatchData.address || 'Tbilisi',
      district: newMatchData.district || 'Lisi',
      date: newMatchData.date || new Date().toISOString().split('T')[0],
      dayOfWeek: newMatchData.dayOfWeek || 'Today',
      startTime: newMatchData.startTime || '18:00',
      durationMinutes: newMatchData.durationMinutes || 90,
      totalSpots,
      joinedUserIds: initialJoined,
      skillLevelRequired: newMatchData.skillLevelRequired || 'Intermediate',
      courtCostGel: newMatchData.courtCostGel || 80,
      pricePerPlayerGel: newMatchData.pricePerPlayerGel || 20,
      description: newMatchData.description || 'Padel match',
      descriptionKa: newMatchData.descriptionKa || newMatchData.description || 'პადელის თამაში',
      descriptionEn: newMatchData.descriptionEn || newMatchData.description || 'Padel match',
      imageUrl: newMatchData.imageUrl,
      googleMapsUrl: newMatchData.googleMapsUrl,
      galleryImageUrls: newMatchData.galleryImageUrls || [],
      ...newMatchData,
      id: matchId,
      category: newMatchData.category || (isAdmin ? 'official' : 'player'),
      matchType: newMatchData.matchType || 'Friendly',
      status: initialJoined.length >= totalSpots ? 'Fully Booked' : 'Open',
      createdByAdminId: isAdmin ? (creatorUser?.id || 'usr_admin') : undefined,
      creatorId: creatorUser?.id,
      creatorName: creatorUser?.name,
      creatorAvatar: creatorUser?.avatar,
      creatorPhone: creatorUser?.phoneNumber,
      allowPhoneOnCard: newMatchData.allowPhoneOnCard ?? true,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'matches', newMatch.id), newMatch);
      showNotification(`Match "${newMatch.title}" created successfully!`, 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `matches/${newMatch.id}`);
    }
  };

  const updateMatch = async (matchId: string, updatedFields: Partial<Match>) => {
    try {
      await updateDoc(doc(db, 'matches', matchId), updatedFields);
      showNotification('Match details updated!', 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `matches/${matchId}`);
    }
  };

  const cancelMatch = async (matchId: string) => {
    const matchToCancel = matches.find(m => m.id === matchId);
    if (!matchToCancel) return;

    try {
      await updateDoc(doc(db, 'matches', matchId), { status: 'Cancelled' });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `matches/${matchId}`);
    }

    // Auto Refund payment records for this match
    payments
      .filter(p => p.matchId === matchId)
      .forEach(async (p) => {
        try {
          await updateDoc(doc(db, 'payments', p.id), { status: 'Refunded' });
        } catch (e) {
          console.error('Failed to update refund status:', e);
        }
      });

    const refundedCount = matchToCancel.joinedUserIds.length;
    showNotification(
      `Match "${matchToCancel.title}" cancelled. ${refundedCount > 0 ? `${refundedCount} players notified.` : ''}`,
      'info'
    );
  };

  const deleteMatch = async (matchId: string) => {
    const targetMatch = matches.find(m => m.id === matchId);
    if (!targetMatch) return;

    // Immediately remove from state so UI updates instantly
    setMatches(prev => prev.filter(m => m.id !== matchId));
    if (selectedMatchId === matchId) {
      setSelectedMatchId(null);
    }

    try {
      await deleteDoc(doc(db, 'matches', matchId));
      showNotification(`Match "${targetMatch.title}" has been deleted.`, 'info');
    } catch (e) {
      console.error('Firestore deleteDoc error:', e);
      showNotification(`Match "${targetMatch.title}" has been deleted.`, 'info');
    }
  };

  const removePlayerFromMatch = async (matchId: string, userIdToRemove: string) => {
    const targetMatch = matches.find(m => m.id === matchId);
    if (!targetMatch) return;

    const updatedJoined = targetMatch.joinedUserIds.filter(id => id !== userIdToRemove);
    const newStatus = updatedJoined.length >= targetMatch.totalSpots ? 'Fully Booked' : 'Open';

    try {
      await updateDoc(doc(db, 'matches', matchId), {
        joinedUserIds: updatedJoined,
        status: newStatus,
      });
      showNotification('Player removed from match.', 'info');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `matches/${matchId}`);
    }
  };

  const activateMatch = async (matchId: string) => {
    if (currentUser?.role !== 'admin') {
      showNotification('Only admins can activate matches.', 'error');
      return;
    }
    const targetMatch = matches.find(m => m.id === matchId);
    if (!targetMatch) return;

    const newStatus = targetMatch.joinedUserIds.length >= targetMatch.totalSpots ? 'Fully Booked' : 'Open';

    try {
      await updateDoc(doc(db, 'matches', matchId), { status: newStatus });
      showNotification(`Activated match "${targetMatch.title}"!`, 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `matches/${matchId}`);
    }
  };

  const deactivateMatch = async (matchId: string) => {
    if (currentUser?.role !== 'admin') {
      showNotification('Only admins can deactivate matches.', 'error');
      return;
    }
    const targetMatch = matches.find(m => m.id === matchId);
    if (!targetMatch) return;

    try {
      await updateDoc(doc(db, 'matches', matchId), { status: 'Cancelled' });
      showNotification(`Deactivated match "${targetMatch.title}".`, 'info');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `matches/${matchId}`);
    }
  };

  // Placeholder User Generation & Management
  const PH_FIRST_NAMES = [
    'Giga', 'Nino', 'Alexandre', 'Sopho', 'Dachi', 'Elena', 'Luka', 'Sofi', 'Nikoloz', 'Tamar', 
    'Giorgi', 'Mariam', 'Irakli', 'Ana', 'Revaz', 'Salome', 'Tornike', 'Keti', 'Erekle', 'Nutsa', 
    'Beka', 'Lela', 'Vakhtang', 'Tina', 'David', 'Mia', 'Levan', 'Nita', 'Sandro', 'Lia',
    'Guram', 'Nia', 'Andria', 'Maka', 'Otar', 'Khatia', 'Shota', 'Eka', 'Archil', 'Natia',
    'Mate', 'Tatia', 'Zuka', 'Salomea', 'Demetre', 'Anano', 'Guga', 'Barbare', 'Lasha', 'Tekla'
  ];

  const PH_LAST_NAMES = [
    'Kapanadze', 'Beridze', 'Gelashvili', 'Shengelia', 'Maisuradze', 'Batiashvili', 'Giorgadze', 
    'Khurtsidze', 'Tkemaladze', 'Gogoladze', 'Japaridze', 'Kobakhidze', 'Chkhaidze', 'Tsiklauri', 
    'Lomidze', 'Abashidze', 'Natsvlishvili', 'Dolidze', 'Kvaratskhelia', 'Gaprindashvili', 
    'Mshvildadze', 'Kiknadze', 'Melikidze', 'Chikovani', 'Berdzenishvili', 'Kavtaradze', 'Mikadze'
  ];

  const PH_BIOS = [
    'Padel enthusiast from Tbilisi. Always up for high-tempo games!',
    'Playing padel regularly. Love tactical baseline rallies and fast smashes.',
    'Right court player searching for competitive and friendly matches.',
    'Padel lover! Ready for a match anytime courts are open.',
    'Left court specialist. Passionate about improving my padel game.',
    'Active player looking for good rallies and competitive fun.'
  ];

  const PH_SKILL_LEVELS: SkillLevel[] = ['Intermediate', 'Advanced', 'Pro', 'Beginner', 'Expert'];
  const PH_POSITIONS: PlayingPosition[] = ['Left / Drive', 'Right / Backhand', 'Flexible'];

  const createOrGetPlaceholderUser = async (excludeIds: string[]): Promise<User> => {
    // Generate a unique name that is not used by any user currently in state or in excludeIds
    const takenNames = new Set(users.map(u => u.name.toLowerCase()));
    
    let uniqueName = '';
    let level: SkillLevel = 'Intermediate';
    let pos: PlayingPosition = 'Flexible';

    for (let attempt = 0; attempt < 300; attempt++) {
      const fName = PH_FIRST_NAMES[Math.floor(Math.random() * PH_FIRST_NAMES.length)];
      const lName = PH_LAST_NAMES[Math.floor(Math.random() * PH_LAST_NAMES.length)];
      const candidate = `${fName} ${lName}`;
      if (!takenNames.has(candidate.toLowerCase())) {
        uniqueName = candidate;
        level = PH_SKILL_LEVELS[Math.floor(Math.random() * PH_SKILL_LEVELS.length)];
        pos = PH_POSITIONS[Math.floor(Math.random() * PH_POSITIONS.length)];
        break;
      }
    }

    if (!uniqueName) {
      uniqueName = `Player ${Math.floor(Math.random() * 9000) + 1000}`;
    }

    const slug = uniqueName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const phId = `ph_${slug}_${Math.random().toString(36).substring(2, 7)}`;
    const rating = 950 + Math.floor(Math.random() * 300);
    const randomBio = PH_BIOS[Math.floor(Math.random() * PH_BIOS.length)];

    const newUser: User = {
      id: phId,
      name: uniqueName,
      email: `${slug}@placeholder.padely.ge`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${slug}`,
      age: 21 + Math.floor(Math.random() * 15),
      location: 'Tbilisi',
      skillLevel: level,
      preferredPosition: pos,
      playingStyle: 'Balanced',
      bio: randomBio,
      role: 'user',
      isPlaceholder: true,
      isProfileComplete: true,
      createdAt: new Date().toISOString(),
      stats: {
        totalMatches: Math.floor(Math.random() * 15) + 3,
        wins: Math.floor(Math.random() * 8) + 1,
        losses: Math.floor(Math.random() * 7) + 1,
        winPercentage: 50,
        currentStreak: 1,
        longestStreak: 3,
        hoursPlayed: Math.floor(Math.random() * 20) + 5,
        matchesThisMonth: Math.floor(Math.random() * 5) + 1,
        favoritePartner: 'None yet',
        rankingPosition: 999,
        skillRating: rating,
        padelyPoints: rating,
        highestPadelyPoints: rating + 100,
        monthlyPadelyPoints: 40,
      },
      matchHistory: [],
    };

    try {
      await setDoc(doc(db, 'users', phId), newUser, { merge: true });
    } catch (e) {
      console.error('Failed to create placeholder user in Firestore:', e);
    }
    return newUser;
  };

  const addPlaceholderPlayer = async (matchId: string) => {
    if (currentUser?.role !== 'admin') {
      showNotification('Only admins can manage placeholder players.', 'error');
      return;
    }
    const targetMatch = matches.find(m => m.id === matchId);
    if (!targetMatch) return;
    if (targetMatch.joinedUserIds.length >= targetMatch.totalSpots) {
      showNotification('Match is already full!', 'info');
      return;
    }

    const placeholderUser = await createOrGetPlaceholderUser(targetMatch.joinedUserIds);
    const updatedJoined = [...targetMatch.joinedUserIds, placeholderUser.id];
    const newStatus = updatedJoined.length >= targetMatch.totalSpots ? 'Fully Booked' : 'Open';

    try {
      await updateDoc(doc(db, 'matches', matchId), {
        joinedUserIds: updatedJoined,
        status: newStatus,
      });
      showNotification(`Added ${placeholderUser.name} to the game!`, 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `matches/${matchId}`);
    }
  };

  const fillMatchWithPlaceholders = async (matchId: string) => {
    if (currentUser?.role !== 'admin') {
      showNotification('Only admins can manage placeholder players.', 'error');
      return;
    }
    const targetMatch = matches.find(m => m.id === matchId);
    if (!targetMatch) return;

    let currentJoined = [...targetMatch.joinedUserIds];
    const needed = targetMatch.totalSpots - currentJoined.length;
    if (needed <= 0) {
      showNotification('Match is already full!', 'info');
      return;
    }

    const addedNames: string[] = [];
    for (let i = 0; i < needed; i++) {
      const phUser = await createOrGetPlaceholderUser(currentJoined);
      currentJoined.push(phUser.id);
      addedNames.push(phUser.name);
    }

    try {
      await updateDoc(doc(db, 'matches', matchId), {
        joinedUserIds: currentJoined,
        status: 'Fully Booked',
      });
      showNotification(`Filled game with ${addedNames.length} placeholder user(s)!`, 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `matches/${matchId}`);
    }
  };

  const adminAssignPlayerToMatch = async (matchId: string, userId: string) => {
    if (currentUser?.role !== 'admin') {
      showNotification('Only admins can assign players to matches.', 'error');
      return;
    }
    const targetMatch = matches.find(m => m.id === matchId);
    if (!targetMatch) return;

    if (targetMatch.joinedUserIds.includes(userId)) {
      showNotification('Player is already assigned to this match.', 'info');
      return;
    }

    if (targetMatch.joinedUserIds.length >= targetMatch.totalSpots) {
      showNotification('This match is already fully booked.', 'error');
      return;
    }

    const assignedUser = users.find(u => u.id === userId);
    const updatedJoined = [...targetMatch.joinedUserIds, userId];
    const newStatus = updatedJoined.length >= targetMatch.totalSpots ? 'Fully Booked' : 'Open';

    try {
      await updateDoc(doc(db, 'matches', matchId), {
        joinedUserIds: updatedJoined,
        status: newStatus,
      });
      showNotification(`Assigned ${assignedUser ? assignedUser.name : 'player'} to match!`, 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `matches/${matchId}`);
    }
  };

  const clearPlaceholdersFromMatch = async (matchId: string) => {
    if (currentUser?.role !== 'admin') {
      showNotification('Only admins can manage placeholder players.', 'error');
      return;
    }
    const targetMatch = matches.find(m => m.id === matchId);
    if (!targetMatch) return;

    const nonPlaceholderIds = targetMatch.joinedUserIds.filter(id => !id.startsWith('ph_') && !id.startsWith('placeholder_'));
    try {
      await updateDoc(doc(db, 'matches', matchId), {
        joinedUserIds: nonPlaceholderIds,
        status: 'Open',
      });
      showNotification('Cleared all placeholder users from match!', 'info');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `matches/${matchId}`);
    }
  };

  const updatePlayerStats = async (userId: string, newStats: Partial<PlayerStats>) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const updatedStats = { ...targetUser.stats, ...newStats };
    if (updatedStats.padelyPoints !== undefined) {
      updatedStats.skillRating = updatedStats.padelyPoints;
      if (updatedStats.highestPadelyPoints === undefined || updatedStats.padelyPoints > updatedStats.highestPadelyPoints) {
        updatedStats.highestPadelyPoints = updatedStats.padelyPoints;
      }
    }
    if (updatedStats.totalMatches > 0) {
      updatedStats.winPercentage = Number(((updatedStats.wins / updatedStats.totalMatches) * 100).toFixed(1));
    }

    try {
      await updateDoc(doc(db, 'users', userId), { stats: updatedStats });
      showNotification('Player statistics updated!', 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const confirmMatchResult = async (
    matchId: string,
    team1UserIds: string[],
    team2UserIds: string[],
    winningTeam: 1 | 2,
    score: string
  ) => {
    const matchObj = matches.find(m => m.id === matchId);
    if (!matchObj) return;

    const team1Users = users.filter(u => team1UserIds.includes(u.id));
    const team2Users = users.filter(u => team2UserIds.includes(u.id));

    const team1Avg = team1Users.length > 0
      ? team1Users.reduce((sum, u) => sum + (u.stats.padelyPoints ?? 1000), 0) / team1Users.length
      : 1000;
    const team2Avg = team2Users.length > 0
      ? team2Users.reduce((sum, u) => sum + (u.stats.padelyPoints ?? 1000), 0) / team2Users.length
      : 1000;

    const winningTeamUsers = winningTeam === 1 ? team1Users : team2Users;
    const losingTeamUsers = winningTeam === 1 ? team2Users : team1Users;

    const winnerAvgPP = winningTeam === 1 ? team1Avg : team2Avg;
    const loserAvgPP = winningTeam === 1 ? team2Avg : team1Avg;

    // Difficulty adjustment logic:
    // If defeating opponents 200+ points higher (upset): +30 winners, -15 losers
    // If defeating opponents 200+ points lower (expected): +10 winners, -5 losers
    // Otherwise (similar rank): +20 winners, -10 losers
    let winnerGain = 20;
    let loserLoss = -10;

    if (loserAvgPP >= winnerAvgPP + 200) {
      winnerGain = 30;
      loserLoss = -15;
    } else if (loserAvgPP <= winnerAvgPP - 200) {
      winnerGain = 10;
      loserLoss = -5;
    }

    const ppChanges: Record<string, number> = {};

    // Update winning players
    for (const player of winningTeamUsers) {
      ppChanges[player.id] = winnerGain;

      const currentPP = player.stats.padelyPoints ?? 1000;
      const newPP = currentPP + winnerGain;
      const newHighestPP = Math.max(player.stats.highestPadelyPoints ?? 1000, newPP);
      const newMonthlyPP = (player.stats.monthlyPadelyPoints ?? 0) + winnerGain;
      const newWins = player.stats.wins + 1;
      const newTotalMatches = player.stats.totalMatches + 1;
      const newStreak = player.stats.currentStreak + 1;
      const newLongestStreak = Math.max(player.stats.longestStreak || 0, newStreak);
      const newWinPct = Number(((newWins / newTotalMatches) * 100).toFixed(1));

      const partner = winningTeamUsers.find(u => u.id !== player.id)?.name || 'Team Partner';
      const oppNames = losingTeamUsers.map(u => u.name).join(' & ') || 'Opponents';

      const newHistoryItem = {
        id: `hist_${Date.now()}_${player.id}`,
        matchTitle: matchObj.title,
        locationName: matchObj.locationName,
        date: matchObj.date,
        result: 'Win' as const,
        score,
        partnerName: partner,
        opponents: oppNames,
        isRanked: true,
        pointsEarned: winnerGain,
      };

      const updatedStats: PlayerStats = {
        ...player.stats,
        padelyPoints: newPP,
        skillRating: newPP,
        highestPadelyPoints: newHighestPP,
        monthlyPadelyPoints: newMonthlyPP,
        wins: newWins,
        totalMatches: newTotalMatches,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        winPercentage: newWinPct,
      };

      const updatedHistory = [newHistoryItem, ...(player.matchHistory || [])];

      try {
        await updateDoc(doc(db, 'users', player.id), {
          stats: updatedStats,
          matchHistory: updatedHistory,
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `users/${player.id}`);
      }
    }

    // Update losing players
    for (const player of losingTeamUsers) {
      ppChanges[player.id] = loserLoss;

      const currentPP = player.stats.padelyPoints ?? 1000;
      const newPP = Math.max(0, currentPP + loserLoss);
      const newHighestPP = player.stats.highestPadelyPoints ?? 1000;
      const newMonthlyPP = (player.stats.monthlyPadelyPoints ?? 0) + loserLoss;
      const newLosses = player.stats.losses + 1;
      const newTotalMatches = player.stats.totalMatches + 1;
      const newStreak = 0;
      const newWinPct = Number(((player.stats.wins / newTotalMatches) * 100).toFixed(1));

      const partner = losingTeamUsers.find(u => u.id !== player.id)?.name || 'Team Partner';
      const oppNames = winningTeamUsers.map(u => u.name).join(' & ') || 'Opponents';

      const newHistoryItem = {
        id: `hist_${Date.now()}_${player.id}`,
        matchTitle: matchObj.title,
        locationName: matchObj.locationName,
        date: matchObj.date,
        result: 'Loss' as const,
        score,
        partnerName: partner,
        opponents: oppNames,
        isRanked: true,
        pointsEarned: loserLoss,
      };

      const updatedStats: PlayerStats = {
        ...player.stats,
        padelyPoints: newPP,
        skillRating: newPP,
        highestPadelyPoints: newHighestPP,
        monthlyPadelyPoints: newMonthlyPP,
        losses: newLosses,
        totalMatches: newTotalMatches,
        currentStreak: newStreak,
        winPercentage: newWinPct,
      };

      const updatedHistory = [newHistoryItem, ...(player.matchHistory || [])];

      try {
        await updateDoc(doc(db, 'users', player.id), {
          stats: updatedStats,
          matchHistory: updatedHistory,
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `users/${player.id}`);
      }
    }

    // Update match document
    try {
      await updateDoc(doc(db, 'matches', matchId), {
        status: 'Completed',
        score,
        team1UserIds,
        team2UserIds,
        winningTeam,
        isResultConfirmed: true,
        ppChanges,
      });
      showNotification(`Match result confirmed! Winners +${winnerGain} PP, Losers ${loserLoss} PP`, 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `matches/${matchId}`);
    }
  };

  const removeMatchResult = async (matchId: string) => {
    const matchObj = matches.find(m => m.id === matchId);
    if (!matchObj || !matchObj.ppChanges) return;

    for (const [userId, rawChange] of Object.entries(matchObj.ppChanges)) {
      const change = Number(rawChange) || 0;
      const player = users.find(u => u.id === userId);
      if (!player) continue;

      const revertedPP = Math.max(0, (player.stats.padelyPoints ?? 1000) - change);
      const revertedMonthlyPP = (player.stats.monthlyPadelyPoints ?? 0) - change;

      let newWins = player.stats.wins;
      let newLosses = player.stats.losses;
      if (change > 0) newWins = Math.max(0, newWins - 1);
      else newLosses = Math.max(0, newLosses - 1);

      const newTotal = Math.max(0, player.stats.totalMatches - 1);
      const newWinPct = newTotal > 0 ? Number(((newWins / newTotal) * 100).toFixed(1)) : 0;

      const updatedStats: PlayerStats = {
        ...player.stats,
        padelyPoints: revertedPP,
        skillRating: revertedPP,
        monthlyPadelyPoints: revertedMonthlyPP,
        wins: newWins,
        losses: newLosses,
        totalMatches: newTotal,
        winPercentage: newWinPct,
      };

      const filteredHistory = (player.matchHistory || []).filter(h => h.matchTitle !== matchObj.title || h.date !== matchObj.date);

      try {
        await updateDoc(doc(db, 'users', userId), {
          stats: updatedStats,
          matchHistory: filteredHistory,
        });
      } catch (e) {
        console.error('Failed to revert stats for user:', userId, e);
      }
    }

    try {
      await updateDoc(doc(db, 'matches', matchId), {
        isResultConfirmed: false,
        status: 'Open',
        score: null,
        winningTeam: null,
        ppChanges: null,
      });
      showNotification('Match result removed and Padely Points reverted!', 'info');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `matches/${matchId}`);
    }
  };

  const resetAllRankings = async () => {
    for (const user of users) {
      const updatedStats: PlayerStats = {
        ...user.stats,
        padelyPoints: 1000,
        skillRating: 1000,
        highestPadelyPoints: 1000,
        monthlyPadelyPoints: 0,
        wins: 0,
        losses: 0,
        currentStreak: 0,
        longestStreak: 0,
        winPercentage: 0,
        totalMatches: 0,
      };

      try {
        await updateDoc(doc(db, 'users', user.id), {
          stats: updatedStats,
          matchHistory: [],
        });
      } catch (e) {
        console.error('Failed to reset user stats:', user.id, e);
      }
    }
    showNotification('All player rankings reset to 1000 PP!', 'info');
  };

  const updatePlayerProfile = async (userId: string, updatedProfile: Partial<User>) => {
    if (updatedProfile.isProfileComplete) {
      localStorage.setItem(`padely_onboarding_completed_${userId}`, 'true');
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedProfile } : u));
    try {
      await updateDoc(doc(db, 'users', userId), updatedProfile);
      showNotification('Profile updated successfully!', 'success');
    } catch (e) {
      // Fallback to setDoc with merge if update fails (e.g., if document doesn't exist yet)
      try {
        await setDoc(doc(db, 'users', userId), updatedProfile, { merge: true });
        showNotification('Profile updated successfully!', 'success');
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
      }
    }
  };

  const resetToDefaultData = async () => {
    setUsers([]);
    setMatches([]);
    setPayments([]);
    showNotification('Cleared dataset!', 'info');
  };

  const createCourt = async (courtData: Omit<Court, 'id' | 'createdAt'>) => {
    const courtId = `court_${Date.now()}`;
    const newCourt: Court = {
      ...courtData,
      id: courtId,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'courts', courtId), newCourt);
      showNotification('Pre-made court created successfully!', 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `courts/${courtId}`);
    }
  };

  const updateCourt = async (courtId: string, updatedFields: Partial<Court>) => {
    try {
      await updateDoc(doc(db, 'courts', courtId), updatedFields);
      showNotification('Court details updated!', 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `courts/${courtId}`);
    }
  };

  const deleteCourt = async (courtId: string) => {
    try {
      await deleteDoc(doc(db, 'courts', courtId));
      showNotification('Court deleted!', 'info');
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `courts/${courtId}`);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isAuthLoading,
        isUsersLoaded,
        users,
        matches,
        payments,
        courts,
        currentView,
        selectedMatchId,
        selectedProfileUserId,
        isAuthModalOpen,
        isPaymentModalOpen,
        activeMatchForPayment,
        notification,
        isLeaderboardDisabled,
        
        setCurrentView,
        openMatchDetails,
        openUserProfile,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        logout,
        toggleAdminDemoMode,
        toggleLeaderboardDisabled,
        
        startJoinMatchFlow,
        closePaymentModal,
        confirmJoinMatch,
        createMatch,
        updateMatch,
        cancelMatch,
        deleteMatch,
        activateMatch,
        deactivateMatch,
        confirmMatchResult,
        removeMatchResult,
        resetAllRankings,
        
        updatePlayerStats,
        updatePlayerProfile,
        
        createCourt,
        updateCourt,
        deleteCourt,
        
        addPlaceholderPlayer,
        fillMatchWithPlaceholders,
        adminAssignPlayerToMatch,
        removePlayerFromMatch,
        clearPlaceholdersFromMatch,
        
        showNotification,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
