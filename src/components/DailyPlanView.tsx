import React, { useState } from 'react';
import {
  CalendarCheck,
  Sun,
  Sunset,
  Moon,
  CloudSun,
  CheckCircle2,
  Circle,
  Plus,
  Share2,
  Check,
  Shield,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Language, DailyMission } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import { createGoogleTask, getPrimaryTaskList } from '../lib/googleTasks';
import { computeAnalytics } from '../lib/storage';

interface DailyPlanViewProps {
  language: Language;
  missions: DailyMission[];
  onToggleMission: (missionId: string) => void;
  onAddMission: (titleAr: string, titleEn: string, period: 'morning' | 'afternoon' | 'evening' | 'night') => void;
  accessToken: string | null;
  onGoogleSignIn: () => void;
}

export const DailyPlanView: React.FC<DailyPlanViewProps> = ({
  language,
  missions,
  onToggleMission,
  onAddMission,
  accessToken,
  onGoogleSignIn,
}) => {
  const t = TRANSLATIONS[language];
  const analytics = computeAnalytics();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [newMissionText, setNewMissionText] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [isAdding, setIsAdding] = useState(false);

  const morningMissions = missions.filter((m) => m.period === 'morning');
  const afternoonMissions = missions.filter((m) => m.period === 'afternoon');
  const eveningMissions = missions.filter((m) => m.period === 'evening');
  const nightMissions = missions.filter((m) => m.period === 'night');

  const completedCount = missions.filter((m) => m.completed).length;
  const progressPercent = missions.length > 0 ? Math.round((completedCount / missions.length) * 100) : 0;

  // Personal risk condition for night highlight
  const hasLateNightVulnerability =
    analytics.hasEnoughData && (analytics.mostDangerousHour >= 21 || analytics.mostDangerousHour <= 4);

  const handleSyncToGoogleTasks = async () => {
    if (!accessToken) {
      onGoogleSignIn();
      return;
    }

    try {
      setIsSyncing(true);
      setSyncStatus(null);
      const listId = await getPrimaryTaskList(accessToken);

      // Create each incomplete mission in Google Tasks
      for (const m of missions.filter((item) => !item.completed)) {
        const title = language === 'ar' ? m.titleAr : m.titleEn;
        await createGoogleTask(accessToken, `[ZERO] ${title}`, 'ZERO Prevention Anchor', listId);
      }

      setSyncStatus(t.syncedSuccess);
      setTimeout(() => setSyncStatus(null), 4000);
    } catch (err) {
      console.error('Failed to sync to Google Tasks:', err);
      setSyncStatus(
        language === 'ar'
          ? 'حدث خطأ أثناء المزامنة، تأكد من تصاريح مهام Google.'
          : 'Failed to sync. Please ensure Google Tasks permission is granted.'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddCustomMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionText.trim()) return;
    onAddMission(newMissionText.trim(), newMissionText.trim(), selectedPeriod);
    setNewMissionText('');
    setIsAdding(false);
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    items: DailyMission[],
    isHighlighted: boolean = false,
    highlightLabel?: string
  ) => (
    <div
      className={`rounded-2xl p-4 sm:p-5 transition border ${
        isHighlighted
          ? 'bg-[#15111b] border-amber-500/70 shadow-lg shadow-amber-950/30'
          : 'bg-[#0f121d] border-slate-800/80'
      }`}
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">{title}</h3>
            {isHighlighted && highlightLabel && (
              <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>{highlightLabel}</span>
              </span>
            )}
          </div>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {items.filter((i) => i.completed).length} / {items.length}
        </span>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-xs text-slate-500 py-2 text-center">
            {language === 'ar' ? 'لا توجد مهام مسجلة لهذه الفترة بعد.' : 'No missions in this block yet.'}
          </p>
        ) : (
          items.map((m) => (
            <div
              key={m.id}
              onClick={() => onToggleMission(m.id)}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                m.completed
                  ? 'bg-slate-900/40 border-slate-800/50 text-slate-500 line-through'
                  : isHighlighted
                  ? 'bg-[#1b1524] border-amber-900/50 text-slate-200 hover:border-amber-500/60'
                  : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <button className="mt-0.5 text-slate-400 hover:text-emerald-400">
                {m.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500" />
                )}
              </button>
              <span className="text-xs sm:text-sm leading-relaxed flex-1">
                {language === 'ar' ? m.titleAr : m.titleEn}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Title & Sync Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                {t.dailyPlanTitle}
              </h2>
              <p className="text-xs text-slate-400">{t.dailyPlanSub}</p>
            </div>
          </div>
        </div>

        {/* Google Tasks Sync Button */}
        <button
          id="sync-google-tasks-btn"
          onClick={handleSyncToGoogleTasks}
          disabled={isSyncing}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-blue-950/40 flex items-center gap-2 disabled:opacity-50"
        >
          {isSyncing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          <span>{isSyncing ? t.syncing : t.syncGoogleTasks}</span>
        </button>
      </div>

      {syncStatus && (
        <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-800/60 text-blue-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-blue-400" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Progress Bar Card */}
      <div className="bg-[#10131e] border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">
            {language === 'ar' ? 'إنجاز التحصين اليومي:' : 'Daily Fortification Progress:'}
          </span>
          <span className="font-mono font-bold text-amber-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Routines Sections: 4 context periods */}
      <div className="space-y-4">
        {/* Morning */}
        {renderSection(
          t.morningRoutine,
          <Sun className="w-4 h-4 text-amber-400" />,
          morningMissions
        )}

        {/* Afternoon */}
        {renderSection(
          t.afternoonRoutine,
          <CloudSun className="w-4 h-4 text-orange-400" />,
          afternoonMissions
        )}

        {/* Evening */}
        {renderSection(
          language === 'ar' ? 'روتين المساء (المعبر الآمن)' : 'Evening Routine (Safe Transition)',
          <Sunset className="w-4 h-4 text-rose-400" />,
          eveningMissions,
          hasLateNightVulnerability,
          language === 'ar' ? 'تمهيد حاسم قبل نافذة الحذر' : 'Critical boundary before vulnerable window'
        )}

        {/* Night */}
        {renderSection(
          t.nightRoutine,
          <Moon className="w-4 h-4 text-blue-400" />,
          nightMissions,
          hasLateNightVulnerability,
          language === 'ar'
            ? 'أولوية وقائية مخصصة (بناءً على تاريخ رغباتك الليلي)'
            : 'Personal Priority Boundary (Based on your night urge history)'
        )}
      </div>

      {/* Add Custom Mission Form */}
      {isAdding ? (
        <form onSubmit={handleAddCustomMission} className="p-4 rounded-2xl bg-[#0f121d] border border-slate-700 space-y-3">
          <input
            type="text"
            required
            value={newMissionText}
            onChange={(e) => setNewMissionText(e.target.value)}
            placeholder={language === 'ar' ? 'اكتب عادة أو مهمة وقائية جديدة...' : 'Enter a new healthy habit anchor...'}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-500 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              {(['morning', 'afternoon', 'evening', 'night'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPeriod(p)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium ${
                    selectedPeriod === p
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {p === 'morning'
                    ? language === 'ar' ? 'صباح' : 'Morning'
                    : p === 'afternoon'
                    ? language === 'ar' ? 'ظهيرة' : 'Afternoon'
                    : p === 'evening'
                    ? language === 'ar' ? 'مساء' : 'Evening'
                    : language === 'ar' ? 'ليل' : 'Night'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition"
              >
                {language === 'ar' ? 'إضافة' : 'Add'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة مهمة وقائية مخصصة' : 'Add Custom Prevention Anchor'}</span>
        </button>
      )}
    </div>
  );
};
