import React from 'react';
import {
  Award,
  Shield,
  Flame,
  CheckCircle,
  Moon,
  Search,
  Zap,
  TrendingUp,
  Star,
  Target,
  Sparkles,
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { LEVELS, MILESTONES, getLevelForXp } from '../lib/levels';
import { TRANSLATIONS } from '../lib/translations';
import { getElapsedStreak } from '../lib/storage';

interface ProgressViewProps {
  profile: UserProfile;
  language: Language;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ profile, language }) => {
  const t = TRANSLATIONS[language];
  const levelInfo = getLevelForXp(profile.xp);
  const elapsed = getElapsedStreak(profile.lastResetAt);

  const unlockedMilestonesSet = new Set(profile.unlockedMilestones || []);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              {t.navProgress}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'ar'
                ? 'التقدم يُقاس بصلابة استجابتك في اللحظات الحرجة، وليس فقط بعداد الأيام.'
                : 'Mastery is measured by your active choices at critical crossroads.'}
            </p>
          </div>
        </div>
      </div>

      {/* Hero Level & XP Banner */}
      <div className="bg-gradient-to-br from-[#131626] via-[#0f121e] to-[#0a0c14] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Shield className="w-9 h-9" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400">
                LEVEL {levelInfo.level} / 6
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                {language === 'ar' ? levelInfo.titleAr : levelInfo.titleEn}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ar' ? levelInfo.descAr : levelInfo.descEn}
              </p>
            </div>
          </div>

          <div className="sm:text-end">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">
              {profile.xp}
            </span>
            <span className="text-xs text-amber-400 block font-semibold">TOTAL XP</span>
          </div>
        </div>

        {/* Level XP Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>
              {language === 'ar' ? 'التقدم نحو المستوى التالي:' : 'Progress to next tier:'}
            </span>
            <span>
              {profile.xp} / {levelInfo.nextLevelXp} XP ({levelInfo.progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-1000"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hero Primary Metric: Urges Interrupted */}
      <div className="bg-[#10131e] border-2 border-red-500/30 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-start">
          <div className="p-3 rounded-2xl bg-red-950/60 border border-red-800/60 text-red-400">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-100">{t.urgesInterrupted}</h4>
            <p className="text-xs text-slate-400">{t.primaryMetric}</p>
          </div>
        </div>
        <div className="text-3xl sm:text-4xl font-black text-red-400 font-mono">
          {profile.urgesInterrupted}
        </div>
      </div>

      {/* Grid of Key Real Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Clean Streak */}
        <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-semibold">{t.currentStreak}</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-100 font-mono">
              {elapsed.days}
            </span>
            <span className="text-xs text-slate-500">{t.daysUnit}</span>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-semibold">
              {language === 'ar' ? 'أطول صمود' : 'Best Streak'}
            </span>
            <Star className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-100 font-mono">
              {profile.longestStreakDays}
            </span>
            <span className="text-xs text-slate-500">{t.daysUnit}</span>
          </div>
        </div>

        {/* Slips */}
        <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-semibold">
              {language === 'ar' ? 'زلات مسجلة' : 'Recorded Slips'}
            </span>
            <Moon className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-slate-100 font-mono">
            {profile.slipsCount || 0}
          </span>
        </div>

        {/* Relapses */}
        <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-semibold">
              {language === 'ar' ? 'انتكاسات مسجلة' : 'Relapses'}
            </span>
            <Search className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl font-black text-slate-100 font-mono">
            {profile.relapsesCount || 0}
          </span>
        </div>
      </div>

      {/* Milestones Road Map */}
      <div className="bg-[#0f121d] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-amber-400" />
          <h4 className="text-sm sm:text-base font-bold text-slate-100">
            {language === 'ar' ? 'محطات الصمود والإنجاز (Milestones):' : 'Streak Milestones & Badges:'}
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MILESTONES.map((m) => {
            const isReached = elapsed.days >= m.days;
            const isClaimed = unlockedMilestonesSet.has(m.days);

            return (
              <div
                key={m.days}
                className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  isReached
                    ? 'bg-amber-950/30 border-amber-500/60 text-amber-100 shadow-md'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-200">
                      {language === 'ar' ? m.titleAr : m.titleEn}
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'ar' ? m.descriptionAr : m.descriptionEn}
                    </p>
                  </div>
                </div>

                <div className="text-end flex-shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">
                    +{m.xpReward} XP
                  </span>
                  {isReached ? (
                    <span className="text-[10px] text-amber-400 font-semibold">
                      {language === 'ar' ? '✓ تم تحقيقه' : '✓ Unlocked'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-600 font-mono">
                      {m.days} {language === 'ar' ? 'يوم' : 'days'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Levels Road map */}
      <div className="bg-[#0f121d] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <h4 className="text-sm sm:text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <span>{language === 'ar' ? 'مسار الرتب والمستويات:' : 'Mastery Tiers Roadmap:'}</span>
        </h4>

        <div className="space-y-3">
          {LEVELS.map((lvl) => {
            const isCurrent = lvl.level === levelInfo.level;
            const isUnlocked = profile.xp >= lvl.minXp;
            return (
              <div
                key={lvl.level}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition ${
                  isCurrent
                    ? 'bg-amber-950/40 border-amber-500 text-amber-200 shadow-md'
                    : isUnlocked
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                    : 'bg-slate-900/20 border-slate-900 text-slate-600 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs font-mono ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : isUnlocked
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-900 text-slate-600'
                    }`}
                  >
                    {lvl.level}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold">
                      {language === 'ar' ? lvl.titleAr : lvl.titleEn}
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      {language === 'ar' ? lvl.descriptionAr : lvl.descriptionEn}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-semibold">
                  {lvl.minXp} XP
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* XP Earn Table */}
      <div className="bg-[#0f121d] border border-slate-800 rounded-3xl p-5 sm:p-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          {language === 'ar' ? 'كيف تكتسب نقاط الخبرة (XP) الحقيقية؟' : 'How do you earn real XP?'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-300">{language === 'ar' ? 'إتمام بروتوكول الـ 90 ثانية' : '90s Rescue Protocol'}</span>
            <span className="font-mono font-bold text-emerald-400">+50 XP</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-300">{language === 'ar' ? 'إيقاف البحث في اللحظة الحرجة' : 'Halt Search Bar Early'}</span>
            <span className="font-mono font-bold text-emerald-400">+45 XP</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-300">{language === 'ar' ? 'إنجاز مهمة قاتل الملل' : 'Boredom Mission completed'}</span>
            <span className="font-mono font-bold text-emerald-400">+35 XP</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-300">{language === 'ar' ? 'تسجيل محفز اللحظة بوعي' : 'Trigger consciously logged'}</span>
            <span className="font-mono font-bold text-emerald-400">+25 XP</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-300">{language === 'ar' ? 'فحص يومي سريع (Daily Check-in)' : 'Daily Check-in'}</span>
            <span className="font-mono font-bold text-emerald-400">+15 XP</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-300">{language === 'ar' ? 'إنجاز محطات الصمود (3, 7, 14, 30...)' : 'Milestone rewards (3, 7, 14...)'}</span>
            <span className="font-mono font-bold text-emerald-400">+50 to +1000 XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
