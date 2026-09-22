/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Language,
  TriggerType,
  TriggerLocation,
  BeforeEventActivity,
  DailyMission,
  InterventionLog,
  InterventionCategory,
  InterventionOutcome,
  Milestone,
} from './types';
import {
  loadUserProfile,
  saveUserProfile,
  loadDailyMissions,
  saveDailyMissions,
  toggleDailyMission,
  loadInterventions,
  addTriggerLog,
  addInterventionLog,
  clearAllLocalData,
  recordRelapse,
  recordSlip,
  recordDailyCheckIn,
  recordEmergencySessionSuccess,
  recordSearchStoppedSuccess,
  recordBoredomMissionCompletion,
  awardIdempotentXp,
  checkAndAwardMilestones,
  setActiveUserUid,
} from './lib/storage';
import {
  initAuth,
  googleSignIn,
  logout,
  syncUserProfileToFirestore,
  saveTriggerToFirestore,
  saveInterventionToFirestore,
  saveSlipToFirestore,
  fetchUserDataFromFirestore,
  testFirestoreConnection,
  isPopupBlockedError,
} from './lib/firebase';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { EmergencyModal } from './components/EmergencyModal';
import { AntiSearchModal } from './components/AntiSearchModal';
import { TriggerJournalModal } from './components/TriggerJournalModal';
import { SlipModal } from './components/SlipModal';
import { RelapseModal } from './components/RelapseModal';
import { MilestoneCelebrationModal } from './components/MilestoneCelebrationModal';
import { PopupBlockedModal } from './components/PopupBlockedModal';
import { TriggerMapView } from './components/TriggerMapView';
import { ChainAnalyzerView } from './components/ChainAnalyzerView';
import { DailyPlanView } from './components/DailyPlanView';
import { BoredomKillerView } from './components/BoredomKillerView';
import { ProgressView } from './components/ProgressView';
import { SettingsView } from './components/SettingsView';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { initCapacitorPlugins } from './lib/capacitor';
import { Shield, Loader2 } from 'lucide-react';

export default function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('zero_guest_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());
  const [language, setLanguage] = useState<Language>(() => profile.language || 'ar');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [missions, setMissions] = useState<DailyMission[]>(() => loadDailyMissions());
  const [interventionLogs, setInterventionLogs] = useState<InterventionLog[]>(() => loadInterventions());

  // Welcome, Auth & Onboarding state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  // Functional Modals state
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isAntiSearchOpen, setIsAntiSearchOpen] = useState(false);
  const [isTriggerJournalOpen, setIsTriggerJournalOpen] = useState(false);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
  const [isRelapseModalOpen, setIsRelapseModalOpen] = useState(false);
  const [isPopupBlockedModalOpen, setIsPopupBlockedModalOpen] = useState(false);
  const [celebrationMilestone, setCelebrationMilestone] = useState<Milestone | null>(null);
  const [selectedJournalTrigger, setSelectedJournalTrigger] = useState<TriggerType | undefined>();

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync RTL / LTR document attributes when language changes
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Periodic Milestone Checker
  const checkMilestones = useCallback(() => {
    const newlyAwarded = checkAndAwardMilestones();
    if (newlyAwarded.length > 0) {
      setProfile(loadUserProfile(currentUser?.uid));
      setCelebrationMilestone(newlyAwarded[0]);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        // Confetti fallback
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    checkMilestones();
    const interval = setInterval(checkMilestones, 30000);
    return () => clearInterval(interval);
  }, [checkMilestones, currentUser]);

  // Helper to reset states back to local guest state upon logout
  const resetToLocalGuestState = useCallback(() => {
    setActiveUserUid(null);
    const guestProfile = loadUserProfile('local_user_zero');
    setProfile(guestProfile);
    setMissions(loadDailyMissions('local_user_zero'));
    setInterventionLogs(loadInterventions('local_user_zero'));
    setCelebrationMilestone(null);
  }, []);

  // Firebase auth & firestore initialization
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = initAuth(
      async (user, token) => {
        setCurrentUser(user);
        if (token) setAccessToken(token);
        setActiveUserUid(user.uid);

        // Load local user profile first for instantaneous UI render
        const localProf = loadUserProfile(user.uid);
        if (user.email && !localProf.email) localProf.email = user.email;
        if (user.displayName && !localProf.displayName) localProf.displayName = user.displayName;
        if (user.photoURL && !localProf.photoURL) localProf.photoURL = user.photoURL;
        setProfile(localProf);
        setMissions(loadDailyMissions(user.uid));
        setInterventionLogs(loadInterventions(user.uid));

        // If user hasn't completed onboarding yet, open onboarding modal
        if (!localProf.onboardingCompleted) {
          setIsOnboardingModalOpen(true);
        }

        setIsAuthReady(true);

        // Fetch cloud data asynchronously if available
        try {
          const cloudData = await fetchUserDataFromFirestore(user.uid);
          if (cloudData?.profile) {
            setProfile(cloudData.profile);
            saveUserProfile(cloudData.profile);
            if (!cloudData.profile.onboardingCompleted) {
              setIsOnboardingModalOpen(true);
            } else {
              setIsOnboardingModalOpen(false);
            }
          } else {
            // Push current profile to cloud
            const initialSync: UserProfile = {
              ...localProf,
              uid: user.uid,
              email: user.email ?? localProf.email ?? null,
              displayName: user.displayName ?? localProf.displayName ?? null,
              photoURL: user.photoURL ?? localProf.photoURL ?? null,
            };
            setProfile(initialSync);
            saveUserProfile(initialSync);
            syncUserProfileToFirestore(initialSync);
          }
        } catch (err) {
          console.error('Error synchronizing with Firestore:', err);
        }
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
        resetToLocalGuestState();
        setIsAuthReady(true);
      }
    );

    return () => unsubscribe();
  }, [resetToLocalGuestState]);

  // Android Native Back Navigation & Status Bar Handling
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    initCapacitorPlugins({
      hasOpenModal: () => Boolean(
        isEmergencyOpen ||
        isAntiSearchOpen ||
        isTriggerJournalOpen ||
        isSlipModalOpen ||
        isRelapseModalOpen ||
        isAuthModalOpen ||
        isOnboardingModalOpen ||
        isPopupBlockedModalOpen ||
        celebrationMilestone !== null
      ),
      closeTopModal: () => {
        if (celebrationMilestone !== null) setCelebrationMilestone(null);
        else if (isPopupBlockedModalOpen) setIsPopupBlockedModalOpen(false);
        else if (isAuthModalOpen) setIsAuthModalOpen(false);
        else if (isOnboardingModalOpen) setIsOnboardingModalOpen(false);
        else if (isEmergencyOpen) setIsEmergencyOpen(false);
        else if (isAntiSearchOpen) setIsAntiSearchOpen(false);
        else if (isTriggerJournalOpen) setIsTriggerJournalOpen(false);
        else if (isSlipModalOpen) setIsSlipModalOpen(false);
        else if (isRelapseModalOpen) setIsRelapseModalOpen(false);
      },
      canNavigateBack: () => activeTab !== 'home',
      navigateBack: () => setActiveTab('home'),
    }).then((unsub) => {
      cleanup = unsub;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [
    isEmergencyOpen,
    isAntiSearchOpen,
    isTriggerJournalOpen,
    isSlipModalOpen,
    isRelapseModalOpen,
    isAuthModalOpen,
    isOnboardingModalOpen,
    isPopupBlockedModalOpen,
    celebrationMilestone,
    activeTab,
  ]);

  // Update profile helper
  const updateProfile = (updater: (prev: UserProfile) => UserProfile) => {
    setProfile((prev) => {
      const next = updater(prev);
      saveUserProfile(next);
      if (currentUser) {
        syncUserProfileToFirestore(next);
      }
      return next;
    });
  };

  const handleRefreshProfile = () => {
    setProfile(loadUserProfile(currentUser?.uid));
  };

  // Sign In handler directly from modal or buttons
  const handleAuthSuccess = async (user: User, token: string | null) => {
    try {
      localStorage.removeItem('zero_guest_mode');
    } catch {
      // Storage fallback
    }
    setIsGuestMode(false);
    setCurrentUser(user);
    if (token) setAccessToken(token);
    setActiveUserUid(user.uid);

    const loaded = loadUserProfile(user.uid);
    if (user.email && !loaded.email) loaded.email = user.email;
    if (user.displayName && !loaded.displayName) loaded.displayName = user.displayName;
    if (user.photoURL && !loaded.photoURL) loaded.photoURL = user.photoURL;
    setProfile(loaded);
    setMissions(loadDailyMissions(user.uid));
    setInterventionLogs(loadInterventions(user.uid));

    // Check cloud for existing onboarding data
    try {
      const cloudData = await fetchUserDataFromFirestore(user.uid);
      if (cloudData?.profile) {
        setProfile(cloudData.profile);
        saveUserProfile(cloudData.profile);
        if (!cloudData.profile.onboardingCompleted) {
          setIsOnboardingModalOpen(true);
        } else {
          setIsOnboardingModalOpen(false);
          showToast(`مرحباً بك في ZERO ${user.displayName || ''} 🛡️`);
        }
        return;
      }
    } catch {
      // Offline fallback
    }

    if (!loaded.onboardingCompleted) {
      setIsOnboardingModalOpen(true);
    } else {
      showToast(`مرحباً بك في ZERO ${user.displayName || ''} 🛡️`);
    }
  };

  const handleContinueAsGuest = () => {
    try {
      localStorage.setItem('zero_guest_mode', 'true');
    } catch {
      // Storage fallback
    }
    setIsGuestMode(true);
    setActiveUserUid('local_user_zero');
    const localProf = loadUserProfile('local_user_zero');
    setProfile(localProf);
    setMissions(loadDailyMissions('local_user_zero'));
    setInterventionLogs(loadInterventions('local_user_zero'));
    if (!localProf.onboardingCompleted) {
      setIsOnboardingModalOpen(true);
    } else {
      showToast('مرحباً بك في ZERO كضيف محلي 🛡️');
    }
  };

  const handleGoogleSignInClick = () => {
    setIsAuthModalOpen(true);
  };

  // Onboarding Completion Handler
  const handleOnboardingComplete = (data: {
    nickname: string;
    vulnerablePeriod: 'morning' | 'afternoon' | 'night' | 'urge_only';
  }) => {
    const { profile: updated } = awardIdempotentXp(
      'welcome_onboarding',
      100,
      {
        nickname: data.nickname,
        vulnerablePeriod: data.vulnerablePeriod,
        onboardingCompleted: true,
        hasReceivedWelcomeBonus: true,
      },
      currentUser?.uid || 'local_user_zero'
    );
    setProfile(updated);

    setIsOnboardingModalOpen(false);

    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch {
      // Confetti fallback
    }

    showToast('مرحباً بك في ZERO! تم تفعيل درع الحماية وحصلت على +100 XP بنجاح 🛡️');
  };

  // Sign Out handler
  const handleSignOut = async () => {
    await logout();
    try {
      localStorage.removeItem('zero_guest_mode');
    } catch {
      // Storage fallback
    }
    setIsGuestMode(false);
    setCurrentUser(null);
    setAccessToken(null);
    resetToLocalGuestState();
    setIsAuthModalOpen(false);
    setIsOnboardingModalOpen(false);
    showToast(language === 'ar' ? 'تم تسجيل الخروج بنجاح.' : 'Signed out successfully.');
  };

  // Change language
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    updateProfile((prev) => ({ ...prev, language: lang }));
  };

  // Action 1: Success in 90-second rescue
  const handleSuccessUrgeInterrupted = (sessionId?: string) => {
    const updated = recordEmergencySessionSuccess(sessionId, currentUser?.uid);
    setProfile(updated);
    setInterventionLogs(loadInterventions(currentUser?.uid));

    showToast(
      language === 'ar'
        ? '🏆 انتصار حاسم! قطعت ذروة الإلحاح بنجاح (+50 XP)'
        : '🏆 Critical victory! Urge successfully interrupted (+50 XP)'
    );

    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {
      // Confetti fallback
    }
  };

  // Action 2: Record intervention log
  const handleRecordIntervention = (
    cat: InterventionCategory,
    title: string,
    success: boolean,
    outcome: InterventionOutcome
  ) => {
    const newLog = addInterventionLog({
      userId: currentUser?.uid || 'local_user_zero',
      interventionId: `int_${Date.now()}`,
      category: cat,
      actionTitle: title,
      outcome,
      success,
    });

    setInterventionLogs(loadInterventions(currentUser?.uid));

    if (currentUser) {
      saveInterventionToFirestore(currentUser.uid, newLog);
    }
  };

  // Action 3: Anti-search stopped
  const handleStopSearchSuccess = (sessionId?: string) => {
    const updated = recordSearchStoppedSuccess(sessionId, currentUser?.uid);
    setProfile(updated);
    setInterventionLogs(loadInterventions(currentUser?.uid));

    showToast(
      language === 'ar'
        ? '🛑 قرار شجاع! أنقذت نفسك في أخطر مرحلة (+45 XP)'
        : '🛑 Decisive intervention! Halted critical search loop (+45 XP)'
    );
  };

  // Action 4: Save Trigger Journal
  const handleSaveTrigger = (
    trigger: TriggerType,
    location: TriggerLocation,
    beforeEvent: BeforeEventActivity,
    intensity: number,
    note?: string
  ) => {
    const newTrigger = addTriggerLog({
      userId: currentUser?.uid || 'local_user_zero',
      trigger,
      location,
      beforeEvent,
      intensity,
      note,
      interrupted: true,
    });

    const { profile: updated } = awardIdempotentXp(
      `trigger_${newTrigger.id}`,
      25,
      {
        lastUrgeTimestamp: new Date().toISOString(),
      },
      currentUser?.uid
    );

    setProfile(updated);

    if (currentUser) {
      saveTriggerToFirestore(currentUser.uid, newTrigger);
    }

    showToast(
      language === 'ar'
        ? '📝 تم تسجيل المحفز بوعي تام وحماية دفاعاتك (+25 XP)'
        : '📝 Trigger consciously mapped and neutralized (+25 XP)'
    );
  };

  // Action 5: Save Slip (زلة - does NOT reset streak timer)
  const handleSaveSlip = (details: {
    trigger: TriggerType | string;
    location?: string;
    escalationEvent?: string;
    interruptPoint?: string;
    nextTimePlan?: string;
  }) => {
    const updated = recordSlip({
      ...details,
      uidOverride: currentUser?.uid,
    });
    setProfile(updated);

    showToast(
      language === 'ar'
        ? '🌱 تسجلات الزلة بوعي. السلسلة ديالك مستمرة وثباتك هو الأهم.'
        : '🌱 Slip recorded with awareness. Your streak continues forward.'
    );
  };

  // Action 6: Record Relapse (انتكاسة - resets streak timer, preserves XP & longest streak)
  const handleConfirmRelapse = (customTimeIso?: string) => {
    const { profile: updated } = recordRelapse({
      customTimeIso,
      uidOverride: currentUser?.uid,
    });
    setProfile(updated);

    showToast(
      language === 'ar'
        ? '🔄 تم إعادة ضبط العداد. المحاولة الجديدة بدأت دابا بكل ثبات.'
        : '🔄 Counter reset. Your fresh attempt starts right now.'
    );
  };

  // Action 7: Log Resilience check-in
  const handleLogResilienceCheckin = () => {
    const { profile: updated, isFirstToday } = recordDailyCheckIn('good', false, undefined, currentUser?.uid);
    setProfile(updated);

    if (isFirstToday) {
      showToast(
        language === 'ar'
          ? '✅ تم تسجيل الصمود واليقظة الذهنية (+15 XP)'
          : '✅ Resilience & conscious presence logged (+15 XP)'
      );
    } else {
      showToast(
        language === 'ar'
          ? '✅ الفحص اليومي مسجل بالفعل لهذا اليوم.'
          : '✅ Daily check-in already recorded for today.'
      );
    }

    try {
      confetti({ particleCount: 30, spread: 50 });
    } catch {
      // Confetti fallback
    }
  };

  // Action 8: Boredom Mission Completed
  const handleBoredomMissionCompleted = (xpGain: number, challengeId?: string) => {
    const cId = challengeId || 'general_challenge';
    const updated = recordBoredomMissionCompletion(cId, xpGain, currentUser?.uid);
    setProfile(updated);

    showToast(
      language === 'ar'
        ? `🎯 أنجزت المهمة وقتلت الفراغ بنجاح (+${xpGain} XP)`
        : `🎯 Mission completed! Void transformed into focus (+${xpGain} XP)`
    );
  };

  // Toggle mission
  const handleToggleMission = (id: string) => {
    const updated = toggleDailyMission(id, currentUser?.uid);
    setMissions(updated);
    setProfile(loadUserProfile(currentUser?.uid));
  };

  // Add custom mission
  const handleAddMission = (
    titleAr: string,
    titleEn: string,
    period: 'morning' | 'afternoon' | 'evening' | 'night'
  ) => {
    const newMission: DailyMission = {
      id: `custom_${Date.now()}`,
      userId: currentUser?.uid || 'local_user_zero',
      period,
      titleAr,
      titleEn,
      category: 'custom',
      completed: false,
      timestamp: new Date().toISOString(),
    };
    const updated = [...missions, newMission];
    setMissions(updated);
    saveDailyMissions(updated, currentUser?.uid);
    showToast(language === 'ar' ? 'تمت إضافة المهمة الوقائية.' : 'Added prevention mission.');
  };

  // Reset all local data
  const handleResetData = () => {
    clearAllLocalData(currentUser?.uid);
    const fresh = loadUserProfile(currentUser?.uid);
    setProfile(fresh);
    setMissions(loadDailyMissions(currentUser?.uid));
    setInterventionLogs(loadInterventions(currentUser?.uid));
    showToast(language === 'ar' ? 'تمت استعادة نقطة الصفر النظيفة.' : 'Reset all data to clean Zero state.');
  };

  // 1. Initial Loading Splash
  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#07080e] text-white flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 p-[1px] shadow-2xl shadow-red-950/60 mb-4 animate-pulse">
          <div className="w-full h-full rounded-[15px] bg-[#0c0e18] flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-400 fill-red-500/10" />
          </div>
        </div>
        <h1 className="text-xl font-black text-white tracking-wider uppercase">ZERO</h1>
        <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
          <span>جارِ تهيئة درع الحماية...</span>
        </p>
      </div>
    );
  }

  // 2. Unauthenticated First Screen: ZERO Welcome Screen
  if (!currentUser && !isGuestMode) {
    return (
      <>
        <WelcomeScreen
          onGetStarted={() => setIsAuthModalOpen(true)}
          onSignIn={() => setIsAuthModalOpen(true)}
          onContinueAsGuest={handleContinueAsGuest}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          onContinueAsGuest={handleContinueAsGuest}
        />
      </>
    );
  }

  // 3. Authenticated User: Full ZERO App Dashboard
  return (
    <div className="min-h-screen bg-[#07080e] text-slate-100 font-sans selection:bg-red-500/20 selection:text-red-200 flex flex-col antialiased">
      {/* Top App Header */}
      <Header
        profile={profile}
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        currentUser={currentUser}
        onGoogleSignIn={handleGoogleSignInClick}
        onOpenSettings={() => setActiveTab('settings')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 pt-3 sm:pt-6">
        {/* Toast alert banner */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-red-500/80 text-red-300 text-xs sm:text-sm font-bold shadow-2xl shadow-black/80 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
            {toastMessage}
          </div>
        )}

        {/* Tab Routing */}
        {activeTab === 'home' && (
          <HomeDashboard
            profile={profile}
            language={language}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onOpenAntiSearch={() => setIsAntiSearchOpen(true)}
            onOpenTriggerJournal={(trig) => {
              setSelectedJournalTrigger(trig);
              setIsTriggerJournalOpen(true);
            }}
            onOpenSlipModal={() => setIsSlipModalOpen(true)}
            onOpenRelapseModal={() => setIsRelapseModalOpen(true)}
            onOpenBoredomKiller={() => setActiveTab('boredom')}
            onLogResilienceCheckin={handleLogResilienceCheckin}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onProfileUpdate={handleRefreshProfile}
          />
        )}

        {activeTab === 'emergency' && (
          <div className="py-8 text-center flex flex-col items-center justify-center min-h-[60vh]">
            <div className="p-4 rounded-3xl bg-red-600/20 border border-red-500/40 text-red-400 mb-4 animate-pulse">
              <span className="text-4xl">🚨</span>
            </div>
            <h2 className="text-2xl font-black text-slate-100 mb-2">
              {language === 'ar' ? 'بروتوكول التدخل السريع (90s)' : 'Immediate 90s Protocol'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              {language === 'ar'
                ? 'الـ 90 ثانية المنقذة تكسر ذروة الدوبامين الزائف وتمنح قشرة فصك الجبهي فرصة للعودة للسيطرة.'
                : 'The 90-second interceptor suppresses the false dopamine spike and restores executive control.'}
            </p>
            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="py-4 px-8 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-base shadow-xl shadow-red-950/60 active:scale-95 transition"
            >
              {language === 'ar' ? 'إطلاق الـ 90 ثانية الآن' : 'Launch 90 Seconds Now'}
            </button>
          </div>
        )}

        {activeTab === 'map' && <TriggerMapView language={language} />}

        {activeTab === 'chain' && (
          <ChainAnalyzerView
            language={language}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onOpenAntiSearch={() => setIsAntiSearchOpen(true)}
          />
        )}

        {activeTab === 'plan' && (
          <DailyPlanView
            language={language}
            missions={missions}
            onToggleMission={handleToggleMission}
            onAddMission={handleAddMission}
            accessToken={accessToken}
            onGoogleSignIn={handleGoogleSignInClick}
          />
        )}

        {activeTab === 'boredom' && (
          <BoredomKillerView
            language={language}
            onMissionCompleted={handleBoredomMissionCompleted}
            accessToken={accessToken}
            onGoogleSignIn={handleGoogleSignInClick}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView profile={profile} language={language} />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            language={language}
            onLanguageChange={handleLanguageChange}
            currentUser={currentUser}
            onGoogleSignIn={handleGoogleSignInClick}
            onSignOut={handleSignOut}
            profile={profile}
            onResetData={handleResetData}
            onUpdateProfile={updateProfile}
            onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
          />
        )}
      </main>

      {/* Floating / Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          if (tab === 'emergency') {
            setIsEmergencyOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        language={language}
      />

      {/* ZERO Setup Onboarding Modal for New Users */}
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        userName={currentUser?.displayName || currentUser?.email?.split('@')[0]}
        onComplete={handleOnboardingComplete}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 90-Second Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        language={language}
        onSuccessUrgeInterrupted={handleSuccessUrgeInterrupted}
        interventionLogs={interventionLogs}
        onRecordIntervention={handleRecordIntervention}
        onOpenBoredomKiller={() => setActiveTab('boredom')}
        initialSoundEnabled={profile.soundEnabled}
      />

      {/* Anti-Search Modal */}
      <AntiSearchModal
        isOpen={isAntiSearchOpen}
        onClose={() => setIsAntiSearchOpen(false)}
        language={language}
        onStartEmergency90s={() => setIsEmergencyOpen(true)}
        onOpenBoredomKiller={() => setActiveTab('boredom')}
        onStopSearchSuccess={handleStopSearchSuccess}
      />

      {/* Trigger Journal Modal */}
      <TriggerJournalModal
        isOpen={isTriggerJournalOpen}
        onClose={() => setIsTriggerJournalOpen(false)}
        language={language}
        initialTrigger={selectedJournalTrigger}
        onSaveTrigger={handleSaveTrigger}
      />

      {/* Slip Modal (زلة - Does NOT reset streak) */}
      <SlipModal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        language={language}
        onSaveSlip={handleSaveSlip}
      />

      {/* Relapse Modal (انتكاسة - Resets timer & launches post-reset reflection) */}
      <RelapseModal
        isOpen={isRelapseModalOpen}
        onClose={() => setIsRelapseModalOpen(false)}
        language={language}
        onConfirmRelapse={handleConfirmRelapse}
        onLaunchChainAnalyzer={() => setActiveTab('chain')}
      />

      {/* Milestone Unlock Celebration Modal */}
      <MilestoneCelebrationModal
        milestone={celebrationMilestone}
        language={language}
        onClose={() => setCelebrationMilestone(null)}
      />

      {/* Browser Popup Blocked Guidance Modal */}
      <PopupBlockedModal
        isOpen={isPopupBlockedModalOpen}
        onClose={() => setIsPopupBlockedModalOpen(false)}
        onRetry={handleGoogleSignInClick}
        language={language}
      />
    </div>
  );
}
