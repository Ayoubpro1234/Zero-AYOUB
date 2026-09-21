import React, { useState, useEffect } from 'react';
import {
  Flame,
  AlertOctagon,
  Clock,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Target,
  Calendar,
  Smartphone,
  Moon,
  User,
  CheckCircle2,
  MapPin,
  ListTodo,
  Award,
} from 'lucide-react';
import { Language, UserProfile, TriggerType } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import {
  getElapsedStreak,
  getNextMilestone,
  recordDailyCheckIn,
  setCustomResetTime,
  ElapsedStreak,
  NextMilestoneInfo,
} from '../lib/storage';
import { SetStartTimeModal } from './SetStartTimeModal';

interface HomeDashboardProps {
  profile: UserProfile;
  language: Language;
  onOpenEmergency: () => void;
  onOpenAntiSearch: () => void;
  onOpenTriggerJournal: (trig?: TriggerType) => void;
  onOpenSlipModal: () => void;
  onOpenRelapseModal: () => void;
  onOpenBoredomKiller: () => void;
  onLogResilienceCheckin: () => void;
  onNavigateTab: (tab: 'map' | 'chain' | 'plan' | 'progress') => void;
  onProfileUpdate: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  language,
  onOpenEmergency,
  onOpenAntiSearch,
  onOpenTriggerJournal,
  onOpenSlipModal,
  onOpenRelapseModal,
  onOpenBoredomKiller,
  onNavigateTab,
  onProfileUpdate,
}) => {
  const t = TRANSLATIONS[language];

  // Live timer state updating every second
  const [elapsed, setElapsed] = useState<ElapsedStreak>(() => getElapsedStreak(profile.lastResetAt));
  const [milestoneInfo, setMilestoneInfo] = useState<NextMilestoneInfo>(() =>
    getNextMilestone(profile.lastResetAt)
  );
  const [isSetStartTimeOpen, setIsSetStartTimeOpen] = useState<boolean>(false);
  const [showAllQuickActions, setShowAllQuickActions] = useState<boolean>(false);

  const handleSaveStartTime = (isoString: string) => {
    setCustomResetTime(isoString);
    onProfileUpdate();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(getElapsedStreak(profile.lastResetAt));
      setMilestoneInfo(getNextMilestone(profile.lastResetAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [profile.lastResetAt]);

  // Daily Check-In State
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckIn = profile.checkIns?.find((c) => c.date === todayStr);

  const [checkInFeeling, setCheckInFeeling] = useState<'good' | 'average' | 'difficult' | null>(
    todayCheckIn?.feeling || null
  );
  const [hadUrgeToday, setHadUrgeToday] = useState<boolean>(todayCheckIn?.hadUrge || false);
  const [checkInUrgeIntensity, setCheckInUrgeIntensity] = useState<number>(
    todayCheckIn?.urgeIntensity || 5
  );
  const [showUrgeQuestions, setShowUrgeQuestions] = useState<boolean>(todayCheckIn?.hadUrge || false);
  const [checkInSubmitted, setCheckInSubmitted] = useState<boolean>(!!todayCheckIn);

  const handleFeelingSelect = (feeling: 'good' | 'average' | 'difficult') => {
    setCheckInFeeling(feeling);
    if (feeling === 'good') {
      setShowUrgeQuestions(false);
      setHadUrgeToday(false);
      recordDailyCheckIn(feeling, false);
      setCheckInSubmitted(true);
      onProfileUpdate();
    } else {
      setShowUrgeQuestions(true);
    }
  };

  const handleCompleteCheckIn = (urge: boolean) => {
    if (!checkInFeeling) return;
    setHadUrgeToday(urge);
    recordDailyCheckIn(checkInFeeling, urge, urge ? checkInUrgeIntensity : undefined);
    setCheckInSubmitted(true);
    onProfileUpdate();
  };

  const isBrandNewUser =
    profile.xp === 0 &&
    profile.urgesInterrupted === 0 &&
    elapsed.days === 0 &&
    profile.slipsCount === 0 &&
    profile.relapsesCount === 0;

  return (
    <div className="w-full max-w-full space-y-3 pb-24 animate-in fade-in duration-200">
      {/* 0. BRAND NEW USER WELCOME CHIP (Minimalist & Non-Intrusive) */}
      {isBrandNewUser && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-slate-950 border border-amber-500/30 flex items-center justify-between gap-2.5">
          <div className="min-w-0">
            <span className="text-amber-400 font-bold text-xs block truncate">
              {language === 'ar' ? '👋 مرحباً بك في ZERO' : '👋 Welcome to ZERO'}
            </span>
            <p className="text-[11px] text-slate-300 truncate">
              {language === 'ar'
                ? 'ما محتاجش تربح العام كامل اليوم؛ ربح غير 90 ثانية.'
                : 'Conquer the next 90 seconds, not the entire year.'}
            </p>
          </div>
          <button
            onClick={onOpenEmergency}
            className="shrink-0 px-2.5 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-[11px] transition shadow"
          >
            {language === 'ar' ? 'ابدأ الآن' : 'Start'}
          </button>
        </div>
      )}

      {/* 1. PRIMARY EMERGENCY ACTION (Hero Focal Point - Most Prominent Element) */}
      <section
        id="home-primary-emergency-hero"
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1c080d] via-[#140609] to-[#0d0305] border-2 border-red-500/70 p-3.5 sm:p-4 shadow-xl shadow-red-950/50"
      >
        {/* Subtle Ambient Radial Backlight */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-2.5">
          {/* Top urgency header row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-red-300">
                {language === 'ar' ? 'إحساس بالإلحاح؟' : 'Feeling an urge?'}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-red-950/80 border border-red-800/60 text-red-200 font-mono font-bold text-[10px] sm:text-[11px]">
              90s PROTOCOL
            </span>
          </div>

          {/* Core message */}
          <div className="flex items-baseline justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                {language === 'ar' ? '90 ثانية لكسر الاندفاع' : '90 Seconds to Reset'}
              </h2>
              <p className="text-[11px] text-slate-300 truncate">
                {language === 'ar'
                  ? 'اكسر ذروة الدوبامين واستعد سيطرتك'
                  : 'Suppress the dopamine spike instantly'}
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-400 shrink-0">
              +50 XP
            </span>
          </div>

          {/* Primary CTA Button */}
          <button
            id="home-primary-emergency-cta"
            onClick={onOpenEmergency}
            className="w-full min-h-[48px] py-3 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 active:scale-[0.98] text-white shadow-lg shadow-red-950/80 border border-red-400/40 transition flex items-center justify-center gap-2 text-center"
          >
            <AlertOctagon className="w-5 h-5 text-white animate-pulse shrink-0" />
            <span className="text-sm sm:text-base font-black tracking-wide">
              {language === 'ar' ? 'ابدأ الآن 🚨' : 'Start Now 🚨'}
            </span>
          </button>
        </div>
      </section>

      {/* 2. COMPACT STREAK / PROGRESS HUD */}
      <section
        id="home-streak-progress-card"
        className="rounded-2xl bg-[#0d101a] border border-amber-500/30 p-3 sm:p-3.5 shadow-md space-y-2.5"
      >
        {/* Streak Header: Active label + Custom Time Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20 shrink-0 animate-pulse" />
            <span className="text-xs font-bold text-slate-200 truncate">
              {language === 'ar' ? 'السلسلة النظيفة:' : 'Clean Streak:'}{' '}
              <strong className="text-amber-400 font-mono">
                {elapsed.days} {language === 'ar' ? (elapsed.days === 1 ? 'يوم' : 'أيام') : 'Days'}
              </strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsSetStartTimeOpen(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-[10px] sm:text-[11px] font-semibold text-slate-300 hover:text-amber-300 transition shrink-0 active:scale-95"
            title={language === 'ar' ? 'تعديل أو اختيار وقت البداية' : 'Set custom start time'}
          >
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{language === 'ar' ? 'تحديد الوقت' : 'Set Time'}</span>
          </button>
        </div>

        {/* Compact 4-Box Digital Clock HUD */}
        <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
          {/* Days */}
          <div className="h-12 rounded-xl bg-slate-900/90 border border-amber-500/40 flex flex-col items-center justify-center min-w-0">
            <span className="text-lg sm:text-xl font-black font-mono text-white leading-none">
              {elapsed.days}
            </span>
            <span className="text-[9px] text-amber-400 font-semibold uppercase mt-0.5">
              {language === 'ar' ? 'يوم' : 'Days'}
            </span>
          </div>

          {/* Hours */}
          <div className="h-12 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center min-w-0">
            <span className="text-lg sm:text-xl font-black font-mono text-slate-200 leading-none">
              {String(elapsed.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] text-slate-400 font-medium uppercase mt-0.5">
              {language === 'ar' ? 'ساعة' : 'Hrs'}
            </span>
          </div>

          {/* Minutes */}
          <div className="h-12 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center min-w-0">
            <span className="text-lg sm:text-xl font-black font-mono text-slate-200 leading-none">
              {String(elapsed.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] text-slate-400 font-medium uppercase mt-0.5">
              {language === 'ar' ? 'دقيقة' : 'Mins'}
            </span>
          </div>

          {/* Seconds (Live Pulse) */}
          <div className="h-12 rounded-xl bg-[#171310] border border-amber-500/60 flex flex-col items-center justify-center min-w-0 relative">
            <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-amber-400 animate-ping" />
            <span className="text-lg sm:text-xl font-black font-mono text-amber-300 leading-none">
              {String(elapsed.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] text-amber-400/90 font-bold uppercase mt-0.5">
              {language === 'ar' ? 'ثانية' : 'Secs'}
            </span>
          </div>
        </div>

        {/* Compact Level / XP Pill */}
        <button
          onClick={() => onNavigateTab('progress')}
          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between text-[11px] transition text-start"
        >
          <div className="flex items-center gap-1.5 truncate">
            <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold text-slate-200 truncate">
              LVL {profile.level}: {profile.levelTitle}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-mono font-semibold shrink-0">
              {profile.xp} XP
            </span>
          </div>
          <span className="text-[10px] text-slate-400 hover:text-amber-300 shrink-0 font-medium">
            {language === 'ar' ? 'الرتبة ←' : 'Rank ←'}
          </span>
        </button>

        {/* Compact Behavioral Action Pair: 🟠 زلة vs 🔴 انتكست */}
        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          <button
            id="home-slip-zella-btn"
            onClick={onOpenSlipModal}
            className="min-h-[44px] py-1.5 px-2.5 rounded-xl bg-[#171310] hover:bg-[#211a14] border border-amber-500/40 text-amber-300 active:scale-95 text-xs font-bold transition flex items-center justify-center gap-1 text-center"
          >
            <span>🟠 {language === 'ar' ? 'زلة' : 'Slip'}</span>
            <span className="text-[9px] text-amber-400/70 font-normal">
              ({language === 'ar' ? 'لا تعيد' : 'No reset'})
            </span>
          </button>

          <button
            id="home-relapse-btn"
            onClick={onOpenRelapseModal}
            className="min-h-[44px] py-1.5 px-2.5 rounded-xl bg-[#1a0e12] hover:bg-[#251219] border border-rose-600/40 text-rose-300 active:scale-95 text-xs font-bold transition flex items-center justify-center gap-1 text-center"
          >
            <span>🔴 {language === 'ar' ? 'انتكست' : 'Relapse'}</span>
            <span className="text-[9px] text-rose-400/70 font-normal">
              ({language === 'ar' ? 'إعادة' : 'Reset'})
            </span>
          </button>
        </div>
      </section>

      {/* 3. DAILY CHECK-IN ("كيف دايز اليوم؟") */}
      <section
        id="home-daily-checkin-section"
        className="rounded-2xl bg-[#0b0e17] border border-slate-800/90 p-3 sm:p-3.5 shadow-md space-y-2"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <h3 className="text-xs font-bold text-slate-100">
              {language === 'ar' ? 'كيف دايز اليوم؟' : "How's your day going?"}
            </h3>
          </div>

          {checkInSubmitted && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{language === 'ar' ? 'مسجل (+15 XP)' : 'Logged (+15 XP)'}</span>
            </span>
          )}
        </div>

        {/* 3 Simple Emotion Buttons in ONE Single Row */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleFeelingSelect('difficult')}
            className={`min-h-[44px] p-1.5 rounded-xl border text-center transition flex items-center justify-center gap-1.5 active:scale-95 ${
              checkInFeeling === 'difficult'
                ? 'bg-rose-950/50 border-rose-500 text-rose-200 font-bold'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-rose-500/40'
            }`}
          >
            <span className="text-base leading-none">🔴</span>
            <span className="text-xs font-bold">{language === 'ar' ? 'صعيب' : 'Difficult'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleFeelingSelect('average')}
            className={`min-h-[44px] p-1.5 rounded-xl border text-center transition flex items-center justify-center gap-1.5 active:scale-95 ${
              checkInFeeling === 'average'
                ? 'bg-amber-950/50 border-amber-500 text-amber-200 font-bold'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-amber-500/40'
            }`}
          >
            <span className="text-base leading-none">🟡</span>
            <span className="text-xs font-bold">{language === 'ar' ? 'متوسط' : 'Average'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleFeelingSelect('good')}
            className={`min-h-[44px] p-1.5 rounded-xl border text-center transition flex items-center justify-center gap-1.5 active:scale-95 ${
              checkInFeeling === 'good'
                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-bold'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-emerald-500/40'
            }`}
          >
            <span className="text-base leading-none">🟢</span>
            <span className="text-xs font-bold">{language === 'ar' ? 'مزيان' : 'Good'}</span>
          </button>
        </div>

        {/* Optional Urge Follow-Up Slider (Expands smoothly only when needed) */}
        {showUrgeQuestions && !checkInSubmitted && (
          <div className="pt-1.5 space-y-2 border-t border-slate-800/80 animate-in fade-in">
            <span className="text-[11px] font-bold text-slate-300 block">
              {language === 'ar' ? 'واش كان شي إلحاح اليوم؟' : 'Was there any urge today?'}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setHadUrgeToday(true)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                  hadUrgeToday
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {language === 'ar' ? 'نعم (Yes)' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => handleCompleteCheckIn(false)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                  !hadUrgeToday
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {language === 'ar' ? 'لا (No)' : 'No'}
              </button>
            </div>

            {hadUrgeToday && (
              <div className="pt-1 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{language === 'ar' ? 'شدة الإلحاح:' : 'Urge intensity:'}</span>
                  <strong className="text-amber-400 font-mono">{checkInUrgeIntensity} / 10</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={checkInUrgeIntensity}
                  onChange={(e) => setCheckInUrgeIntensity(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleCompleteCheckIn(true)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition"
                >
                  {language === 'ar' ? 'حفظ الفحص (+15 XP)' : 'Save Check-In (+15 XP)'}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. QUICK ACTIONS (Top 4 Triggers in 2x2 Grid + Expandable Secondary Tools) */}
      <section id="home-quick-actions-section" className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {language === 'ar' ? 'اعتراف سريع باللحظة' : 'Quick Intercept'}
          </h3>
          <span className="text-[10px] text-amber-400/90 font-mono">
            {language === 'ar' ? 'كسر مبكر للحلقة' : 'Break early'}
          </span>
        </div>

        {/* The 4 Core Moment Triggers in a compact 2x2 Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {/* 1. Scrolling blindly */}
          <button
            id="home-im-scrolling-btn"
            onClick={() => onOpenTriggerJournal('social_media')}
            className="p-2.5 rounded-xl bg-[#0f121d] hover:bg-[#141826] active:scale-95 border border-slate-800 hover:border-purple-500/50 text-start flex items-center gap-2 transition min-h-[50px]"
          >
            <Smartphone className="w-4 h-4 text-purple-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-100 block truncate">
                {language === 'ar' ? 'تصفح بلا وعي' : 'Mindless scroll'}
              </span>
              <span className="text-[10px] text-purple-400 font-medium block truncate">
                {language === 'ar' ? 'سجل المحفز ←' : 'Drop phone ←'}
              </span>
            </div>
          </button>

          {/* 2. I'm Bored */}
          <button
            id="home-im-bored-btn"
            onClick={onOpenBoredomKiller}
            className="p-2.5 rounded-xl bg-[#0f121d] hover:bg-[#141826] active:scale-95 border border-slate-800 hover:border-amber-500/50 text-start flex items-center gap-2 transition min-h-[50px]"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-100 block truncate">
                {language === 'ar' ? 'أشعر بالملل' : "I'm bored"}
              </span>
              <span className="text-[10px] text-amber-400 font-medium block truncate">
                {language === 'ar' ? 'قاتل الفراغ ←' : 'Active mission ←'}
              </span>
            </div>
          </button>

          {/* 3. Alone with phone */}
          <button
            id="home-im-alone-btn"
            onClick={() => onOpenTriggerJournal('alone_with_phone')}
            className="p-2.5 rounded-xl bg-[#0f121d] hover:bg-[#141826] active:scale-95 border border-slate-800 hover:border-orange-500/50 text-start flex items-center gap-2 transition min-h-[50px]"
          >
            <User className="w-4 h-4 text-orange-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-100 block truncate">
                {language === 'ar' ? 'بمفردي مع الهاتف' : 'Alone with phone'}
              </span>
              <span className="text-[10px] text-orange-400 font-medium block truncate">
                {language === 'ar' ? 'غادر الغرفة ←' : 'Exit room ←'}
              </span>
            </div>
          </button>

          {/* 4. It's Late Night */}
          <button
            id="home-its-late-btn"
            onClick={() => onOpenTriggerJournal('late_night')}
            className="p-2.5 rounded-xl bg-[#0f121d] hover:bg-[#141826] active:scale-95 border border-slate-800 hover:border-blue-500/50 text-start flex items-center gap-2 transition min-h-[50px]"
          >
            <Moon className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-100 block truncate">
                {language === 'ar' ? 'الوقت متأخر' : "It's late"}
              </span>
              <span className="text-[10px] text-blue-400 font-medium block truncate">
                {language === 'ar' ? 'حماية النوم ←' : 'Protect sleep ←'}
              </span>
            </div>
          </button>
        </div>

        {/* "عرض الكل / إخفاء" Toggle Button */}
        <button
          onClick={() => setShowAllQuickActions((prev) => !prev)}
          className="w-full py-1.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 text-[11px] text-slate-300 font-medium flex items-center justify-center gap-1.5 transition active:scale-98"
        >
          <span>
            {showAllQuickActions
              ? language === 'ar'
                ? 'إخفاء الأدوات الإضافية'
                : 'Hide additional tools'
              : language === 'ar'
              ? 'عرض المزيد من الأدوات'
              : 'Show more tools'}
          </span>
          {showAllQuickActions ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {/* Secondary Tools: Anti-Search, Chain Analyzer, Map, Plan */}
        {showAllQuickActions && (
          <div className="grid grid-cols-2 gap-1.5 animate-in fade-in duration-200">
            {/* Anti-Search Shortcut */}
            <button
              id="home-anti-search-btn"
              onClick={onOpenAntiSearch}
              className="p-2.5 rounded-xl bg-[#140b10] hover:bg-[#1c0f16] border border-red-900/60 hover:border-red-600/70 text-start flex items-center gap-2 transition min-h-[48px]"
            >
              <Search className="w-4 h-4 text-red-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-red-300 block truncate">
                  {language === 'ar' ? 'بدأت البحث' : 'Started search'}
                </span>
                <span className="text-[9px] text-slate-400 block truncate">
                  {language === 'ar' ? 'إيقاف فوري' : 'Abort loop'}
                </span>
              </div>
            </button>

            {/* Chain Analyzer Shortcut */}
            <button
              onClick={() => onNavigateTab('chain')}
              className="p-2.5 rounded-xl bg-[#0f111c] hover:bg-[#151928] border border-slate-800 hover:border-slate-700 text-start flex items-center gap-2 transition min-h-[48px]"
            >
              <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-200 block truncate">
                  {language === 'ar' ? 'محلل السلسلة' : 'Chain analyzer'}
                </span>
                <span className="text-[9px] text-slate-400 block truncate">
                  {language === 'ar' ? 'نقطة الخروج' : 'Exit point'}
                </span>
              </div>
            </button>

            {/* Trigger Map Shortcut */}
            <button
              onClick={() => onNavigateTab('map')}
              className="p-2.5 rounded-xl bg-[#0f111c] hover:bg-[#151928] border border-slate-800 hover:border-slate-700 text-start flex items-center gap-2 transition min-h-[48px]"
            >
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-200 block truncate">
                  {language === 'ar' ? 'خريطة الخطر' : 'Trigger map'}
                </span>
                <span className="text-[9px] text-slate-400 block truncate">
                  {language === 'ar' ? 'تحليل الأوقات' : 'Peak hours'}
                </span>
              </div>
            </button>

            {/* Daily Plan Shortcut */}
            <button
              onClick={() => onNavigateTab('plan')}
              className="p-2.5 rounded-xl bg-[#0f111c] hover:bg-[#151928] border border-slate-800 hover:border-slate-700 text-start flex items-center gap-2 transition min-h-[48px]"
            >
              <ListTodo className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-200 block truncate">
                  {language === 'ar' ? 'الخطة اليومية' : 'Daily plan'}
                </span>
                <span className="text-[9px] text-slate-400 block truncate">
                  {language === 'ar' ? 'مهام الصمود' : 'Prevention'}
                </span>
              </div>
            </button>
          </div>
        )}
      </section>

      {/* 5. COMPACT NEXT MILESTONE / DAILY GOAL */}
      <section
        id="home-next-milestone-card"
        className="rounded-2xl bg-[#0a0d16] border border-slate-800/80 p-3 sm:p-3.5 space-y-1.5"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <h4 className="text-xs font-bold text-slate-200 truncate">
              {language === 'ar' ? 'المحطة القادمة:' : 'Next Milestone:'}{' '}
              <span className="text-amber-400">
                {milestoneInfo.nextMilestone.icon} {milestoneInfo.nextMilestone.days}{' '}
                {language === 'ar' ? 'يوم' : 'Days'}
              </span>
            </h4>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono">
            <span className="text-slate-400">
              {milestoneInfo.progressDays}/{milestoneInfo.targetDays} {language === 'ar' ? 'ي' : 'd'}
            </span>
            <span className="text-emerald-400 font-bold">
              +{milestoneInfo.nextMilestone.xpReward} XP
            </span>
          </div>
        </div>

        {/* Slim Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${milestoneInfo.percent}%` }}
          />
        </div>

        {/* Live Countdown & Longest Streak Footer */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 pt-0.5">
          <div className="flex items-center gap-1 text-amber-300/90 font-mono truncate">
            <Clock className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">
              {language === 'ar' ? 'باقي:' : 'Left:'}{' '}
              <strong className="text-white font-semibold">
                {language === 'ar'
                  ? milestoneInfo.countdownFormattedAr || 'قريباً'
                  : milestoneInfo.countdownFormattedEn || 'Soon'}
              </strong>
            </span>
          </div>

          <div className="shrink-0 text-slate-400">
            {language === 'ar' ? 'أطول سلسلة:' : 'Longest:'}{' '}
            <strong className="text-slate-200 font-mono">{profile.longestStreakDays}d</strong>
          </div>
        </div>
      </section>

      {/* Set Start Time Modal */}
      <SetStartTimeModal
        isOpen={isSetStartTimeOpen}
        onClose={() => setIsSetStartTimeOpen(false)}
        language={language}
        currentResetIso={profile.lastResetAt}
        onSaveStartTime={handleSaveStartTime}
      />
    </div>
  );
};
