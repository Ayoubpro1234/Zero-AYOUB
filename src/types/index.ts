export type Language = 'ar' | 'en';

export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high' | 'critical';

export interface DailyCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  feeling: 'good' | 'average' | 'difficult';
  hadUrge: boolean;
  urgeIntensity?: number; // 1 to 10
  timestamp: string;
}

export interface Milestone {
  days: number;
  xpReward: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
}

export interface UserProfile {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  nickname?: string | null;
  photoURL?: string | null;
  vulnerablePeriod?: 'morning' | 'afternoon' | 'night' | 'urge_only';
  onboardingCompleted?: boolean;
  hasReceivedWelcomeBonus?: boolean;
  streakDays: number;
  longestStreakDays: number;
  urgesInterrupted: number;
  interventionsCompleted: number;
  successfulNights: number;
  searchStoppedEvents: number;
  preventiveMissionsCompleted: number;
  slipsCount: number;
  relapsesCount: number;
  antiSearchInterventions: number;
  preventionSuccesses: number;
  xp: number;
  level: number;
  levelTitle: string;
  language: Language;
  nightMode: boolean;
  emergencyReminderMinutes: number;
  soundEnabled: boolean;
  riskAlertsEnabled: boolean;
  nightBoundaryAlerts: boolean;
  lastUrgeTimestamp: string;
  currentStreakStartedAt: string;
  lastResetAt: string;
  unlockedMilestones: number[]; // Array of milestone day numbers, e.g. [3, 7]
  unlockedAchievements: string[];
  checkIns: DailyCheckIn[];
  rewardLedger?: string[];
  createdAt: string;
  updatedAt: string;
}

export type TriggerType =
  | 'boredom'
  | 'loneliness'
  | 'stress'
  | 'late_night'
  | 'social_media'
  | 'random_thought'
  | 'visual_trigger'
  | 'alone_with_phone'
  | 'other';

export type TriggerLocation =
  | 'bedroom'
  | 'bathroom'
  | 'living_room'
  | 'outside'
  | 'work_study'
  | 'other';

export type BeforeEventActivity =
  | 'studying'
  | 'gaming'
  | 'scrolling'
  | 'lying_down'
  | 'doing_nothing'
  | 'working'
  | 'other';

export interface TriggerLog {
  id: string;
  userId: string;
  trigger: TriggerType;
  location: TriggerLocation;
  beforeEvent: BeforeEventActivity;
  intensity: number; // 1 to 10
  note?: string;
  interrupted: boolean;
  timestamp: string;
}

export type InterventionCategory =
  | 'emergency_90s'
  | 'movement'
  | 'cold_reset'
  | 'breathing'
  | 'change_environment'
  | 'leave_phone'
  | 'talk_to_someone'
  | 'spiritual_reminder'
  | 'study_mission'
  | 'exercise'
  | 'cleaning'
  | 'water'
  | 'creative_task'
  | 'coding_task'
  | 'novelty_challenge';

export interface InterventionItem {
  id: string;
  category: InterventionCategory;
  titleAr: string;
  titleEn: string;
  instructionAr: string;
  instructionEn: string;
  durationSeconds: number;
  iconName: string;
  actionTextAr: string;
  actionTextEn: string;
}

export type InterventionOutcome =
  | 'succeeded'
  | 'still_feeling_urge'
  | 'needed_second_intervention'
  | 'failed';

export interface InterventionLog {
  id: string;
  userId: string;
  interventionId: string;
  category: InterventionCategory;
  actionTitle: string;
  outcome: InterventionOutcome;
  success: boolean;
  timestamp: string;
}

export interface SlipReflection {
  id: string;
  userId: string;
  trigger: TriggerType;
  location: TriggerLocation;
  escalationEvent: string;
  interruptPoint: string;
  nextTimePlan: string;
  timestamp: string;
}

export interface DailyMission {
  id: string;
  userId: string;
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  titleAr: string;
  titleEn: string;
  category: string;
  completed: boolean;
  googleTaskId?: string;
  timestamp: string;
}

export interface BoredomChallenge {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  durationMinutes: number;
  category: string;
  icon: string;
}

export interface LevelInfo {
  level: number;
  titleAr: string;
  titleEn: string;
  minXp: number;
  maxXp: number;
  descriptionAr: string;
  descriptionEn: string;
  badge: string;
}
