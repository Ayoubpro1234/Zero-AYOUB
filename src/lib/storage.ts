import {
  UserProfile,
  TriggerLog,
  InterventionLog,
  SlipReflection,
  DailyMission,
  TriggerType,
  TriggerLocation,
  BeforeEventActivity,
  RiskLevel,
  DailyCheckIn,
  Milestone,
} from '../types';
import { getLevelForXp, MILESTONES } from './levels';
import {
  syncUserProfileToFirestore,
  saveTriggerToFirestore,
  saveInterventionToFirestore,
  saveSlipToFirestore,
  awardXpAtomicallyFirestore,
} from './firebase';

const STORAGE_KEYS = {
  PROFILE: 'profile',
  TRIGGERS: 'triggers',
  INTERVENTIONS: 'interventions',
  SLIPS: 'slips',
  MISSIONS: 'missions',
  AUDIO_ENABLED: 'audio_enabled',
};

let activeUserUid: string | null = null;

export function setActiveUserUid(uid: string | null): void {
  activeUserUid = uid;
}

export function getActiveUserUid(): string | null {
  return activeUserUid;
}

function getStorageKey(baseKey: string, uidOverride?: string): string {
  const uid = uidOverride || activeUserUid;
  if (!uid || uid === 'local_user_zero') {
    return `zero_urge_${baseKey}_v2`;
  }
  return `zero_urge_${baseKey}_${uid}`;
}

// ==========================================
// CLEAN PRODUCTION INITIAL STATE — ZERO STARTS FROM ZERO
// ==========================================
export const INITIAL_SEED_PROFILE: UserProfile = {
  uid: 'local_user_zero',
  email: null,
  displayName: null,
  nickname: null,
  photoURL: null,
  vulnerablePeriod: 'night',
  onboardingCompleted: false,
  hasReceivedWelcomeBonus: false,
  streakDays: 0,
  longestStreakDays: 0,
  urgesInterrupted: 0,
  interventionsCompleted: 0,
  successfulNights: 0,
  searchStoppedEvents: 0,
  preventiveMissionsCompleted: 0,
  slipsCount: 0,
  relapsesCount: 0,
  antiSearchInterventions: 0,
  preventionSuccesses: 0,
  xp: 0,
  level: 1,
  levelTitle: 'إعادة الضبط',
  language: 'ar',
  nightMode: true,
  emergencyReminderMinutes: 90,
  soundEnabled: true,
  riskAlertsEnabled: true,
  nightBoundaryAlerts: true,
  lastUrgeTimestamp: '',
  currentStreakStartedAt: new Date().toISOString(),
  lastResetAt: new Date().toISOString(),
  unlockedMilestones: [],
  unlockedAchievements: [],
  checkIns: [],
  rewardLedger: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function createInitialProfileForUser(
  uid: string,
  email?: string | null,
  displayName?: string | null,
  photoURL?: string | null
): UserProfile {
  const now = new Date().toISOString();
  return {
    ...INITIAL_SEED_PROFILE,
    uid,
    email: email || null,
    displayName: displayName || null,
    photoURL: photoURL || null,
    onboardingCompleted: false,
    hasReceivedWelcomeBonus: false,
    streakDays: 0,
    longestStreakDays: 0,
    urgesInterrupted: 0,
    interventionsCompleted: 0,
    successfulNights: 0,
    searchStoppedEvents: 0,
    preventiveMissionsCompleted: 0,
    slipsCount: 0,
    relapsesCount: 0,
    antiSearchInterventions: 0,
    preventionSuccesses: 0,
    xp: 0,
    level: 1,
    levelTitle: 'إعادة الضبط',
    unlockedMilestones: [],
    unlockedAchievements: [],
    checkIns: [],
    rewardLedger: [],
    createdAt: now,
    updatedAt: now,
    currentStreakStartedAt: now,
    lastResetAt: now,
  };
}

export const INITIAL_SEED_TRIGGERS: TriggerLog[] = [];
export const INITIAL_SEED_INTERVENTIONS: InterventionLog[] = [];

export const DEFAULT_DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'm_morning_1',
    userId: 'local_user_zero',
    period: 'morning',
    titleAr: 'شرب كأس ماء بارد فور الاستيقاظ دون شاشة',
    titleEn: 'Drink a glass of cold water screen-free upon waking',
    category: 'vitality',
    completed: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'm_morning_2',
    userId: 'local_user_zero',
    period: 'morning',
    titleAr: 'تلاوة أذكار الصباح أو صلاة الفجر بتركيز وهدوء',
    titleEn: 'Morning spiritual anchor / mindful presence',
    category: 'spiritual',
    completed: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'm_afternoon_1',
    userId: 'local_user_zero',
    period: 'afternoon',
    titleAr: 'جلسة تركيز دراسية أو عملية لمدة 45 دقيقة بدون فتح مواقع تواصل',
    titleEn: '45-minute deep focus block without social media',
    category: 'focus',
    completed: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'm_afternoon_2',
    userId: 'local_user_zero',
    period: 'afternoon',
    titleAr: 'ممارسة 20 دقيقة حركة جسدية أو مشي سريع في الهواء الطلق',
    titleEn: '20-minute physical movement or brisk walk outside',
    category: 'exercise',
    completed: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'm_evening_1',
    userId: 'local_user_zero',
    period: 'evening',
    titleAr: 'قضاء وقت عائلي أو تواصل مباشر مع صديق دون شاشات',
    titleEn: 'Family connection or direct social engagement without screen',
    category: 'connection',
    completed: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'm_evening_2',
    userId: 'local_user_zero',
    period: 'evening',
    titleAr: 'مراجعة مهام الغد وترتيب مساحة العمل أو الغرفة',
    titleEn: 'Review tomorrow’s goals and tidy workspace or room',
    category: 'organization',
    completed: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'm_night_1',
    userId: 'local_user_zero',
    period: 'night',
    titleAr: 'وضع الهاتف خارج غرفة النوم أو بعيداً عن السرير بـ 30 دقيقة قبل النوم',
    titleEn: 'Place phone outside bedroom 30 min before bed',
    category: 'boundary',
    completed: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'm_night_2',
    userId: 'local_user_zero',
    period: 'night',
    titleAr: 'قراءة كتاب ورقي وإطفاء الأضواء القوية لتصفية الذهن',
    titleEn: 'Read a physical book & dim ambient blue light',
    category: 'sleep_hygiene',
    completed: false,
    timestamp: new Date().toISOString(),
  },
];

// ==========================================
// USER PROFILE PERSISTENCE (LOCAL + FIRESTORE)
// ==========================================

export function loadUserProfile(uidOverride?: string): UserProfile {
  try {
    const key = getStorageKey(STORAGE_KEYS.PROFILE, uidOverride);
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial =
        uidOverride && uidOverride !== 'local_user_zero'
          ? createInitialProfileForUser(uidOverride)
          : INITIAL_SEED_PROFILE;
      saveUserProfile(initial);
      return initial;
    }
    const profile = JSON.parse(raw) as UserProfile;

    // Merge defaults safely
    const merged: UserProfile = {
      ...INITIAL_SEED_PROFILE,
      ...profile,
      email: profile.email ?? null,
      displayName: profile.displayName ?? null,
      photoURL: profile.photoURL ?? null,
      nickname: profile.nickname ?? null,
      unlockedMilestones: profile.unlockedMilestones || [],
      unlockedAchievements: profile.unlockedAchievements || [],
      checkIns: profile.checkIns || [],
      rewardLedger: profile.rewardLedger || [],
      lastResetAt: profile.lastResetAt || profile.currentStreakStartedAt || new Date().toISOString(),
      currentStreakStartedAt: profile.currentStreakStartedAt || profile.lastResetAt || new Date().toISOString(),
      slipsCount: profile.slipsCount || 0,
      relapsesCount: profile.relapsesCount || 0,
      antiSearchInterventions: profile.antiSearchInterventions || 0,
      preventionSuccesses: profile.preventionSuccesses || 0,
      soundEnabled: profile.soundEnabled !== undefined ? profile.soundEnabled : true,
      riskAlertsEnabled: profile.riskAlertsEnabled !== undefined ? profile.riskAlertsEnabled : true,
      nightBoundaryAlerts: profile.nightBoundaryAlerts !== undefined ? profile.nightBoundaryAlerts : true,
    };

    // Calculate real dynamic streak days from lastResetAt timestamp
    const elapsed = getElapsedStreak(merged.lastResetAt);
    merged.streakDays = elapsed.days;
    merged.longestStreakDays = Math.max(merged.longestStreakDays || 0, merged.streakDays);

    const levelInfo = getLevelForXp(merged.xp);
    merged.level = levelInfo.level;
    merged.levelTitle = levelInfo.titleAr;
    return merged;
  } catch {
    return uidOverride && uidOverride !== 'local_user_zero'
      ? createInitialProfileForUser(uidOverride)
      : INITIAL_SEED_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    const elapsed = getElapsedStreak(profile.lastResetAt);
    profile.streakDays = elapsed.days;
    profile.longestStreakDays = Math.max(profile.longestStreakDays || 0, profile.streakDays);

    const levelInfo = getLevelForXp(profile.xp);
    profile.level = levelInfo.level;
    profile.levelTitle = levelInfo.titleAr;
    profile.updatedAt = new Date().toISOString();

    const key = getStorageKey(STORAGE_KEYS.PROFILE, profile.uid);
    localStorage.setItem(key, JSON.stringify(profile));

    // Cloud persistence sync
    if (profile.uid && profile.uid !== 'local_user_zero') {
      syncUserProfileToFirestore(profile).catch((err) => {
        console.warn('Background Firestore profile sync notice:', err?.message || err);
      });
    }
  } catch (err) {
    console.error('Failed to save profile locally:', err);
  }
}

// ==========================================
// IDEMPOTENT XP & EVENT REWARD SYSTEM
// ==========================================

// In-memory set to prevent concurrent in-flight duplication within the current runtime
const inFlightRewards = new Set<string>();

export function awardIdempotentXp(
  rewardKey: string,
  amount: number,
  updates: Partial<UserProfile> = {},
  uidOverride?: string
): { profile: UserProfile; awarded: boolean } {
  const profile = loadUserProfile(uidOverride);
  const ledger = new Set(profile.rewardLedger || []);

  // Check 1: In-flight execution lock or local ledger already contains key
  if (inFlightRewards.has(rewardKey) || ledger.has(rewardKey)) {
    // Already rewarded this event — apply state updates without duplicate XP
    const updated: UserProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveUserProfile(updated);
    return { profile: updated, awarded: false };
  }

  // Lock this reward key in memory
  inFlightRewards.add(rewardKey);
  ledger.add(rewardKey);

  // Optimistic local state update
  const updated: UserProfile = {
    ...profile,
    ...updates,
    xp: Math.max(0, profile.xp + amount),
    rewardLedger: Array.from(ledger),
    updatedAt: new Date().toISOString(),
  };

  saveUserProfile(updated);

  // Cloud atomic transaction for authenticated users
  if (profile.uid && profile.uid !== 'local_user_zero') {
    awardXpAtomicallyFirestore(profile.uid, rewardKey, amount, updates)
      .then((res) => {
        // If Firestore transaction found it was already granted concurrently elsewhere,
        // reconcile local state with Firestore's authoritative XP & ledger
        if (res.alreadyAwarded) {
          const fresh = loadUserProfile(profile.uid);
          fresh.xp = res.newXp;
          fresh.level = res.newLevel;
          fresh.levelTitle = res.newLevelTitle;
          fresh.rewardLedger = res.updatedLedger;
          saveUserProfile(fresh);
        }
      })
      .catch((err) => {
        console.warn('Background Firestore atomic award transaction notice:', err?.message || err);
      })
      .finally(() => {
        inFlightRewards.delete(rewardKey);
      });
  } else {
    inFlightRewards.delete(rewardKey);
  }

  return { profile: updated, awarded: true };
}

// ==========================================
// REAL LIVE STREAK & ELAPSED TIME CALCULATION
// ==========================================

export interface ElapsedStreak {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  totalHours: number;
  formattedTime: string; // e.g. "02:14:35" or "00:00:12"
  formattedDetailedAr: string; // e.g. "3 أيام • 14 ساعة • 27 دقيقة"
  formattedDetailedEn: string; // e.g. "3 days • 14 hrs • 27 mins"
  dayPhraseAr: string; // e.g. "اليوم", "يوم واحد", "3 أيام", "30 يوم"
  dayPhraseEn: string;
}

export function getElapsedStreak(lastResetAtStr?: string): ElapsedStreak {
  const startMs = lastResetAtStr ? new Date(lastResetAtStr).getTime() : Date.now();
  const now = Date.now();
  const diffMs = Math.max(0, now - startMs);

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const totalHours = Math.floor(totalSeconds / 3600);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  // Adaptive Day Phrase in Arabic
  let dayPhraseAr = 'اليوم';
  if (days === 0) {
    dayPhraseAr = 'اليوم';
  } else if (days === 1) {
    dayPhraseAr = 'يوم واحد';
  } else if (days === 2) {
    dayPhraseAr = 'يومان';
  } else if (days >= 3 && days <= 10) {
    dayPhraseAr = `${days} أيام`;
  } else {
    dayPhraseAr = `${days} يوم`;
  }

  const dayPhraseEn = days === 0 ? 'Today' : days === 1 ? '1 Day' : `${days} Days`;

  // Detailed string
  const detailedPartsAr: string[] = [];
  const detailedPartsEn: string[] = [];

  if (days > 0) {
    detailedPartsAr.push(days === 1 ? 'يوم واحد' : days === 2 ? 'يومان' : days <= 10 ? `${days} أيام` : `${days} يوم`);
    detailedPartsEn.push(`${days}d`);
  }
  detailedPartsAr.push(`${hours} ساعة`);
  detailedPartsEn.push(`${hours}h`);
  detailedPartsAr.push(`${minutes} دقيقة`);
  detailedPartsEn.push(`${minutes}m`);
  detailedPartsAr.push(`${seconds} ثانية`);
  detailedPartsEn.push(`${seconds}s`);

  const formattedDetailedAr = detailedPartsAr.join(' • ');
  const formattedDetailedEn = detailedPartsEn.join(' • ');

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    totalHours,
    formattedTime,
    formattedDetailedAr,
    formattedDetailedEn,
    dayPhraseAr,
    dayPhraseEn,
  };
}

// ==========================================
// REAL MILESTONE PROGRESSION & COUNTDOWN
// ==========================================

export interface NextMilestoneInfo {
  currentMilestone: Milestone | null;
  nextMilestone: Milestone;
  progressDays: number;
  targetDays: number;
  prevTargetDays: number;
  percent: number;
  remainingDays: number;
  remainingHours: number;
  remainingMinutes: number;
  remainingSeconds: number;
  countdownFormattedAr: string; // e.g. "2 أيام 14 ساعة 32 دقيقة"
  countdownFormattedEn: string;
}

export function getNextMilestone(lastResetAtStr?: string): NextMilestoneInfo {
  const elapsed = getElapsedStreak(lastResetAtStr);
  const elapsedDays = elapsed.days;

  let currentMilestone: Milestone | null = null;
  let nextMilestone: Milestone = MILESTONES[0];
  let prevTargetDays = 0;

  for (let i = 0; i < MILESTONES.length; i++) {
    if (elapsedDays >= MILESTONES[i].days) {
      currentMilestone = MILESTONES[i];
      prevTargetDays = MILESTONES[i].days;
      if (i + 1 < MILESTONES.length) {
        nextMilestone = MILESTONES[i + 1];
      } else {
        nextMilestone = MILESTONES[i]; // reached max
      }
    } else {
      nextMilestone = MILESTONES[i];
      break;
    }
  }

  const startMs = lastResetAtStr ? new Date(lastResetAtStr).getTime() : Date.now();
  const nextTargetMs = startMs + nextMilestone.days * 86400 * 1000;
  const remainingMs = Math.max(0, nextTargetMs - Date.now());

  const remTotalSec = Math.floor(remainingMs / 1000);
  const remainingDays = Math.floor(remTotalSec / 86400);
  const remainingHours = Math.floor((remTotalSec % 86400) / 3600);
  const remainingMinutes = Math.floor((remTotalSec % 3600) / 60);
  const remainingSeconds = remTotalSec % 60;

  // Calculate percentage within segment
  const segmentRange = Math.max(1, nextMilestone.days - prevTargetDays);
  const progressInSegment = Math.max(0, elapsedDays - prevTargetDays);
  const percent =
    currentMilestone?.days === MILESTONES[MILESTONES.length - 1].days && elapsedDays >= nextMilestone.days
      ? 100
      : Math.min(100, Math.max(0, Math.round((progressInSegment / segmentRange) * 100)));

  const countPartsAr: string[] = [];
  const countPartsEn: string[] = [];
  if (remainingDays > 0) {
    countPartsAr.push(remainingDays === 1 ? 'يوم واحد' : remainingDays === 2 ? 'يومان' : remainingDays <= 10 ? `${remainingDays} أيام` : `${remainingDays} يوم`);
    countPartsEn.push(`${remainingDays}d`);
  }
  countPartsAr.push(`${remainingHours} ساعة`);
  countPartsEn.push(`${remainingHours}h`);
  countPartsAr.push(`${remainingMinutes} دقيقة`);
  countPartsEn.push(`${remainingMinutes}m`);

  const countdownFormattedAr = countPartsAr.join(' ');
  const countdownFormattedEn = countPartsEn.join(' ');

  return {
    currentMilestone,
    nextMilestone,
    progressDays: elapsedDays,
    targetDays: nextMilestone.days,
    prevTargetDays,
    percent,
    remainingDays,
    remainingHours,
    remainingMinutes,
    remainingSeconds,
    countdownFormattedAr,
    countdownFormattedEn,
  };
}

/**
 * Checks if user reached new milestones and awards XP idempotently.
 * Returns newly unlocked milestones so the UI can celebrate them.
 */
export function checkAndAwardMilestones(uidOverride?: string): Milestone[] {
  const profile = loadUserProfile(uidOverride);
  const elapsed = getElapsedStreak(profile.lastResetAt);
  const newlyAwarded: Milestone[] = [];

  const unlocked = new Set(profile.unlockedMilestones || []);

  MILESTONES.forEach((m) => {
    if (elapsed.days >= m.days && !unlocked.has(m.days)) {
      unlocked.add(m.days);
      newlyAwarded.push(m);
      awardIdempotentXp(
        `milestone_${m.days}`,
        m.xpReward,
        {
          unlockedMilestones: Array.from(unlocked),
        },
        uidOverride
      );
    }
  });

  return newlyAwarded;
}

// ==========================================
// RELAPSE (انتكست) & SLIP (زلة) HANDLERS
// ==========================================

export function recordRelapse(details?: {
  trigger?: TriggerType | string;
  location?: TriggerLocation | string;
  beforeEvent?: BeforeEventActivity | string;
  note?: string;
  interruptPoint?: string;
  customTimeIso?: string;
  uidOverride?: string;
}): { profile: UserProfile; previousStreak: number } {
  const profile = loadUserProfile(details?.uidOverride);
  const elapsed = getElapsedStreak(profile.lastResetAt);
  const previousStreak = elapsed.days;

  // 1. Preserve longest streak
  profile.longestStreakDays = Math.max(profile.longestStreakDays || 0, previousStreak);

  // 2. Increment relapse count
  profile.relapsesCount = (profile.relapsesCount || 0) + 1;

  // 3. Reset streak timer to custom time or NOW
  const targetIso = details?.customTimeIso || new Date().toISOString();
  profile.lastResetAt = targetIso;
  profile.currentStreakStartedAt = targetIso;
  profile.streakDays = getElapsedStreak(targetIso).days;
  // Reset milestone claims for the new streak
  profile.unlockedMilestones = [];
  profile.updatedAt = new Date().toISOString();

  // Save log if details provided
  if (details?.trigger) {
    addSlipReflection({
      userId: profile.uid,
      trigger: (details.trigger as TriggerType) || 'other',
      location: (details.location as TriggerLocation) || 'other',
      escalationEvent: details.note || 'Relapse recorded and analyzed',
      interruptPoint: details.interruptPoint || 'phone_pickup',
      nextTimePlan: 'Restart with higher awareness and immediate physical shift',
    });
  }

  saveUserProfile(profile);
  checkAndAwardMilestones(details?.uidOverride);
  return { profile, previousStreak };
}

export function setCustomResetTime(dateTimeIso: string, uidOverride?: string): UserProfile {
  const profile = loadUserProfile(uidOverride);
  const parsedDate = new Date(dateTimeIso);
  const validMs = isNaN(parsedDate.getTime()) ? Date.now() : Math.min(parsedDate.getTime(), Date.now());
  const isoStr = new Date(validMs).toISOString();

  profile.lastResetAt = isoStr;
  profile.currentStreakStartedAt = isoStr;
  const elapsed = getElapsedStreak(isoStr);
  profile.streakDays = elapsed.days;
  profile.longestStreakDays = Math.max(profile.longestStreakDays || 0, elapsed.days);
  profile.updatedAt = new Date().toISOString();

  saveUserProfile(profile);
  checkAndAwardMilestones(uidOverride);
  return profile;
}

export function recordSlip(details: {
  trigger: TriggerType | string;
  location?: TriggerLocation | string;
  escalationEvent?: string;
  interruptPoint?: string;
  nextTimePlan?: string;
  uidOverride?: string;
}): UserProfile {
  const profile = loadUserProfile(details.uidOverride);
  profile.slipsCount = (profile.slipsCount || 0) + 1;
  profile.updatedAt = new Date().toISOString();

  addSlipReflection({
    userId: profile.uid,
    trigger: (details.trigger as TriggerType) || 'other',
    location: (details.location as TriggerLocation) || 'other',
    escalationEvent: details.escalationEvent || 'Slip recorded without full relapse',
    interruptPoint: details.interruptPoint || 'first_scroll',
    nextTimePlan: details.nextTimePlan || 'Maintain awareness and leave trigger environment',
  });

  saveUserProfile(profile);
  return profile;
}

// ==========================================
// DAILY CHECK-IN HANDLER
// ==========================================

export function recordDailyCheckIn(
  feeling: 'good' | 'average' | 'difficult',
  hadUrge: boolean,
  urgeIntensity?: number,
  uidOverride?: string
): { profile: UserProfile; isFirstToday: boolean } {
  const profile = loadUserProfile(uidOverride);
  const todayStr = new Date().toISOString().split('T')[0];

  const existingIndex = profile.checkIns.findIndex((c) => c.date === todayStr);
  const isFirstToday = existingIndex === -1;

  const newCheckIn: DailyCheckIn = {
    id: `checkin_${Date.now()}`,
    date: todayStr,
    feeling,
    hadUrge,
    urgeIntensity: hadUrge ? urgeIntensity || 5 : undefined,
    timestamp: new Date().toISOString(),
  };

  if (isFirstToday) {
    profile.checkIns.unshift(newCheckIn);
    // Award +15 XP once per day idempotently
    awardIdempotentXp(`checkin_${todayStr}`, 15, {
      successfulNights: feeling === 'good' ? (profile.successfulNights || 0) + 1 : profile.successfulNights || 0,
      checkIns: profile.checkIns,
    }, uidOverride);
  } else {
    profile.checkIns[existingIndex] = newCheckIn;
    saveUserProfile(profile);
  }

  // If urge logged in check-in, record as trigger
  if (hadUrge && urgeIntensity) {
    addTriggerLog({
      userId: profile.uid,
      trigger: 'other',
      location: 'bedroom',
      beforeEvent: 'scrolling',
      intensity: urgeIntensity,
      note: `Daily check-in feeling: ${feeling}`,
      interrupted: true,
    });
  }

  return { profile: loadUserProfile(uidOverride), isFirstToday };
}

// ==========================================
// REAL EMERGENCY PROTOCOL & INTERCEPTION REWARDS
// ==========================================

export function recordEmergencySessionSuccess(
  sessionId?: string,
  uidOverride?: string
): UserProfile {
  const sId = sessionId || `session_${Date.now()}`;
  const profile = loadUserProfile(uidOverride);

  // Add real intervention log
  addInterventionLog({
    userId: profile.uid,
    interventionId: `int_90s_${sId}`,
    category: 'emergency_90s',
    actionTitle: '90-Second Emergency Protocol',
    outcome: 'succeeded',
    success: true,
  });

  const { profile: updated } = awardIdempotentXp(
    `emergency_${sId}`,
    50,
    {
      urgesInterrupted: (profile.urgesInterrupted || 0) + 1,
      interventionsCompleted: (profile.interventionsCompleted || 0) + 1,
      lastUrgeTimestamp: new Date().toISOString(),
    },
    uidOverride
  );

  return updated;
}

export function recordSearchStoppedSuccess(
  sessionId?: string,
  uidOverride?: string
): UserProfile {
  const sId = sessionId || `session_${Date.now()}`;
  const profile = loadUserProfile(uidOverride);

  addInterventionLog({
    userId: profile.uid,
    interventionId: `int_search_${sId}`,
    category: 'cold_reset',
    actionTitle: 'Anti-Search Loop Interception',
    outcome: 'succeeded',
    success: true,
  });

  const { profile: updated } = awardIdempotentXp(
    `antisearch_${sId}`,
    45,
    {
      searchStoppedEvents: (profile.searchStoppedEvents || 0) + 1,
      urgesInterrupted: (profile.urgesInterrupted || 0) + 1,
      antiSearchInterventions: (profile.antiSearchInterventions || 0) + 1,
      lastUrgeTimestamp: new Date().toISOString(),
    },
    uidOverride
  );

  return updated;
}

export function recordBoredomMissionCompletion(
  challengeId: string,
  xpGain: number = 35,
  uidOverride?: string
): UserProfile {
  const todayStr = new Date().toISOString().split('T')[0];
  const profile = loadUserProfile(uidOverride);

  const { profile: updated } = awardIdempotentXp(
    `boredom_${challengeId}_${todayStr}`,
    xpGain,
    {
      preventiveMissionsCompleted: (profile.preventiveMissionsCompleted || 0) + 1,
      preventionSuccesses: (profile.preventionSuccesses || 0) + 1,
      interventionsCompleted: (profile.interventionsCompleted || 0) + 1,
    },
    uidOverride
  );

  return updated;
}

// ==========================================
// TRIGGERS STORAGE (LOCAL + FIRESTORE)
// ==========================================

export function loadTriggers(uidOverride?: string): TriggerLog[] {
  try {
    const key = getStorageKey(STORAGE_KEYS.TRIGGERS, uidOverride);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const loadTriggerLogs = loadTriggers;

export function saveTriggers(triggers: TriggerLog[], uidOverride?: string): void {
  try {
    const key = getStorageKey(STORAGE_KEYS.TRIGGERS, uidOverride);
    localStorage.setItem(key, JSON.stringify(triggers));
  } catch (err) {
    console.error('Failed to save triggers locally:', err);
  }
}

export function addTriggerLog(log: Omit<TriggerLog, 'id' | 'timestamp'>): TriggerLog {
  const triggers = loadTriggers(log.userId);
  const newLog: TriggerLog = {
    ...log,
    id: `trig_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  triggers.unshift(newLog);
  saveTriggers(triggers, log.userId);

  // Firestore sync
  if (log.userId && log.userId !== 'local_user_zero') {
    saveTriggerToFirestore(log.userId, newLog).catch((err) => {
      console.warn('Background Firestore trigger sync notice:', err?.message || err);
    });
  }

  return newLog;
}

// ==========================================
// INTERVENTIONS STORAGE (LOCAL + FIRESTORE)
// ==========================================

export function loadInterventions(uidOverride?: string): InterventionLog[] {
  try {
    const key = getStorageKey(STORAGE_KEYS.INTERVENTIONS, uidOverride);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveInterventions(items: InterventionLog[], uidOverride?: string): void {
  try {
    const key = getStorageKey(STORAGE_KEYS.INTERVENTIONS, uidOverride);
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save interventions locally:', err);
  }
}

export function addInterventionLog(log: Omit<InterventionLog, 'id' | 'timestamp'>): InterventionLog {
  const items = loadInterventions(log.userId);
  const newLog: InterventionLog = {
    ...log,
    id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  items.unshift(newLog);
  saveInterventions(items, log.userId);

  // Firestore sync
  if (log.userId && log.userId !== 'local_user_zero') {
    saveInterventionToFirestore(log.userId, newLog).catch((err) => {
      console.warn('Background Firestore intervention sync notice:', err?.message || err);
    });
  }

  return newLog;
}

// ==========================================
// SLIPS STORAGE (LOCAL + FIRESTORE)
// ==========================================

export function loadSlips(uidOverride?: string): SlipReflection[] {
  try {
    const key = getStorageKey(STORAGE_KEYS.SLIPS, uidOverride);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSlips(slips: SlipReflection[], uidOverride?: string): void {
  try {
    const key = getStorageKey(STORAGE_KEYS.SLIPS, uidOverride);
    localStorage.setItem(key, JSON.stringify(slips));
  } catch (err) {
    console.error('Failed to save slips locally:', err);
  }
}

export function addSlipReflection(slip: Omit<SlipReflection, 'id' | 'timestamp'>): SlipReflection {
  const slips = loadSlips(slip.userId);
  const newSlip: SlipReflection = {
    ...slip,
    id: `slip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  slips.unshift(newSlip);
  saveSlips(slips, slip.userId);

  // Firestore sync
  if (slip.userId && slip.userId !== 'local_user_zero') {
    saveSlipToFirestore(slip.userId, newSlip).catch((err) => {
      console.warn('Background Firestore slip sync notice:', err?.message || err);
    });
  }

  return newSlip;
}

// ==========================================
// DAILY MISSIONS STORAGE
// ==========================================

export function loadDailyMissions(uidOverride?: string): DailyMission[] {
  try {
    const key = getStorageKey(STORAGE_KEYS.MISSIONS, uidOverride);
    const raw = localStorage.getItem(key);
    if (!raw) {
      saveDailyMissions(DEFAULT_DAILY_MISSIONS, uidOverride);
      return DEFAULT_DAILY_MISSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DAILY_MISSIONS;
  }
}

export function saveDailyMissions(missions: DailyMission[], uidOverride?: string): void {
  try {
    const key = getStorageKey(STORAGE_KEYS.MISSIONS, uidOverride);
    localStorage.setItem(key, JSON.stringify(missions));
  } catch (err) {
    console.error('Failed to save missions locally:', err);
  }
}

export function toggleDailyMission(missionId: string, uidOverride?: string): DailyMission[] {
  const missions = loadDailyMissions(uidOverride);
  const updated = missions.map((m) => (m.id === missionId ? { ...m, completed: !m.completed } : m));
  saveDailyMissions(updated, uidOverride);

  const justCompleted = updated.find((m) => m.id === missionId && m.completed);
  if (justCompleted) {
    const todayStr = new Date().toISOString().split('T')[0];
    const profile = loadUserProfile(uidOverride);
    awardIdempotentXp(
      `mission_${missionId}_${todayStr}`,
      25,
      {
        preventiveMissionsCompleted: (profile.preventiveMissionsCompleted || 0) + 1,
      },
      uidOverride
    );
  }

  return updated;
}

// ==========================================
// RESET / CLEAR LOCAL DATA
// ==========================================

export function clearAllLocalData(uidOverride?: string): void {
  localStorage.removeItem(getStorageKey(STORAGE_KEYS.PROFILE, uidOverride));
  localStorage.removeItem(getStorageKey(STORAGE_KEYS.TRIGGERS, uidOverride));
  localStorage.removeItem(getStorageKey(STORAGE_KEYS.INTERVENTIONS, uidOverride));
  localStorage.removeItem(getStorageKey(STORAGE_KEYS.SLIPS, uidOverride));
  localStorage.removeItem(getStorageKey(STORAGE_KEYS.MISSIONS, uidOverride));
}

// ==========================================
// CALCULATE TRIGGER ANALYTICS (REAL DATA ONLY — NO MOCK PERCENTAGES)
// ==========================================

export interface TriggerAnalytics {
  mostCommonTrigger: TriggerType | 'none';
  triggerCounts: Record<string, number>;
  mostDangerousHour: number; // 0..23
  hourlyDistribution: number[]; // 24 numbers
  mostCommonLocation: TriggerLocation | 'none';
  locationCounts: Record<string, number>;
  mostCommonBeforeEvent: BeforeEventActivity | 'none';
  beforeEventCounts: Record<string, number>;
  averageIntensity: number;
  totalLogged: number;
  totalInterrupted: number;
  interventionSuccessRate: number; // percentage
  hasEnoughData: boolean;
  isUpcomingRiskWindow: boolean;
  upcomingRiskHour: number;
  mostEffectiveInterventionCategory: string;
  categoryEffectiveness: Record<string, { total: number; success: number; rate: number }>;
  currentRiskScore: number; // 0..100
  riskLevel: RiskLevel;
}

export function computeAnalytics(uidOverride?: string): TriggerAnalytics {
  const triggers = loadTriggers(uidOverride);
  const interventions = loadInterventions(uidOverride);

  const triggerCounts: Record<string, number> = {};
  const locationCounts: Record<string, number> = {};
  const beforeCounts: Record<string, number> = {};
  const hourly = new Array(24).fill(0);
  let intensitySum = 0;
  let interruptedCount = 0;
  let recentTriggerCount = 0;
  const now = Date.now();

  triggers.forEach((t) => {
    triggerCounts[t.trigger] = (triggerCounts[t.trigger] || 0) + 1;
    locationCounts[t.location] = (locationCounts[t.location] || 0) + 1;
    beforeCounts[t.beforeEvent] = (beforeCounts[t.beforeEvent] || 0) + 1;
    intensitySum += t.intensity;
    if (t.interrupted) interruptedCount++;

    const date = new Date(t.timestamp);
    const hour = date.getHours();
    hourly[hour] = (hourly[hour] || 0) + 1;

    // Check if within last 3 hours
    if (now - date.getTime() < 3 * 60 * 60 * 1000) {
      recentTriggerCount++;
    }
  });

  const hasEnoughData = triggers.length >= 2;

  // Most common trigger
  let maxTrigCount = 0;
  let mostCommonTrigger: TriggerType | 'none' = 'none';
  Object.entries(triggerCounts).forEach(([trig, count]) => {
    if (count > maxTrigCount) {
      maxTrigCount = count;
      mostCommonTrigger = trig as TriggerType;
    }
  });

  // Most dangerous hour
  let maxHourCount = 0;
  let mostDangerousHour = 23; // fallback
  hourly.forEach((count, h) => {
    if (count > maxHourCount) {
      maxHourCount = count;
      mostDangerousHour = h;
    }
  });

  // Most common location
  let maxLocCount = 0;
  let mostCommonLocation: TriggerLocation | 'none' = 'none';
  Object.entries(locationCounts).forEach(([loc, count]) => {
    if (count > maxLocCount) {
      maxLocCount = count;
      mostCommonLocation = loc as TriggerLocation;
    }
  });

  // Most common before
  let maxBeforeCount = 0;
  let mostCommonBefore: BeforeEventActivity | 'none' = 'none';
  Object.entries(beforeCounts).forEach(([act, count]) => {
    if (count > maxBeforeCount) {
      maxBeforeCount = count;
      mostCommonBefore = act as BeforeEventActivity;
    }
  });

  // Interventions analytics
  const catStats: Record<string, { total: number; success: number; rate: number }> = {};
  let totalSuccesses = 0;
  interventions.forEach((item) => {
    if (!catStats[item.category]) {
      catStats[item.category] = { total: 0, success: 0, rate: 0 };
    }
    catStats[item.category].total += 1;
    if (item.success) {
      catStats[item.category].success += 1;
      totalSuccesses += 1;
    }
  });

  let bestCat = 'none';
  let bestRate = 0;
  Object.entries(catStats).forEach(([cat, stat]) => {
    stat.rate = stat.total > 0 ? Math.round((stat.success / stat.total) * 100) : 0;
    if (stat.rate >= bestRate && stat.total >= 1) {
      bestRate = stat.rate;
      bestCat = cat;
    }
  });

  const interventionSuccessRate =
    interventions.length > 0 ? Math.round((totalSuccesses / interventions.length) * 100) : 0;

  // Compute current risk score using personal metrics
  const currentHour = new Date().getHours();
  let baseRisk = 10;

  // Time of day risk factors
  if (currentHour >= 23 || currentHour <= 4) {
    baseRisk += 35;
  } else if (currentHour >= 21 || currentHour <= 6) {
    baseRisk += 20;
  } else if (currentHour >= 14 && currentHour <= 17) {
    baseRisk += 10;
  }

  // Personal historical vulnerable hour alignment
  const isAtDangerousHour = hasEnoughData && Math.abs(currentHour - mostDangerousHour) <= 1;
  const isUpcomingRiskWindow =
    hasEnoughData && (currentHour === mostDangerousHour || (currentHour + 1) % 24 === mostDangerousHour);

  if (hasEnoughData && isAtDangerousHour) {
    baseRisk += 25;
  }

  if (recentTriggerCount > 0) {
    baseRisk += Math.min(25, recentTriggerCount * 15);
  }

  const currentRiskScore = Math.min(95, Math.max(10, baseRisk));
  let riskLevel: RiskLevel = 'low';
  if (currentRiskScore >= 80) {
    riskLevel = 'critical';
  } else if (currentRiskScore >= 65) {
    riskLevel = 'high';
  } else if (currentRiskScore >= 50) {
    riskLevel = 'elevated';
  } else if (currentRiskScore >= 35) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'low';
  }

  return {
    mostCommonTrigger,
    triggerCounts,
    mostDangerousHour,
    hourlyDistribution: hourly,
    mostCommonLocation,
    locationCounts,
    mostCommonBeforeEvent: mostCommonBefore,
    beforeEventCounts: beforeCounts,
    averageIntensity: triggers.length > 0 ? Number((intensitySum / triggers.length).toFixed(1)) : 0,
    totalLogged: triggers.length,
    totalInterrupted: interruptedCount,
    interventionSuccessRate,
    hasEnoughData,
    isUpcomingRiskWindow,
    upcomingRiskHour: mostDangerousHour,
    mostEffectiveInterventionCategory: bestCat,
    categoryEffectiveness: catStats,
    currentRiskScore,
    riskLevel,
  };
}

export function awardXpAndStats(
  xpGained: number,
  updates: Partial<UserProfile> = {},
  uidOverride?: string
): UserProfile {
  const profile = loadUserProfile(uidOverride);
  const newXp = Math.max(0, profile.xp + xpGained);
  const updated: UserProfile = {
    ...profile,
    ...updates,
    xp: newXp,
    updatedAt: new Date().toISOString(),
  };
  saveUserProfile(updated);
  return updated;
}
