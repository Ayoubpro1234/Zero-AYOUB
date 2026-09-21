import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Dice5,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Share2,
  Check,
  Dumbbell,
  BookOpen,
  Brain,
  Code,
  Coffee,
  Footprints,
  Heart,
  ShowerHead,
  Calculator,
} from 'lucide-react';
import { Language, BoredomChallenge } from '../types';
import { BOREDOM_CHALLENGES } from '../lib/interventions';
import { TRANSLATIONS } from '../lib/translations';
import { createGoogleTask, getPrimaryTaskList } from '../lib/googleTasks';

interface BoredomKillerViewProps {
  language: Language;
  onMissionCompleted: (xpGain: number, challengeId?: string) => void;
  accessToken: string | null;
  onGoogleSignIn: () => void;
}

export const BoredomKillerView: React.FC<BoredomKillerViewProps> = ({
  language,
  onMissionCompleted,
  accessToken,
  onGoogleSignIn,
}) => {
  const t = TRANSLATIONS[language];
  const [currentChallenge, setCurrentChallenge] = useState<BoredomChallenge>(BOREDOM_CHALLENGES[0]);
  const [secondsLeft, setSecondsLeft] = useState<number>(BOREDOM_CHALLENGES[0].durationMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [syncedMessage, setSyncedMessage] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'movement', labelAr: 'حركي وجسدي', labelEn: 'Physical Reset' },
    { id: 'study', labelAr: 'ذهني وتعلّم', labelEn: 'Mental' },
    { id: 'cleaning', labelAr: 'تنظيمي وبيئي', labelEn: 'Environment' },
    { id: 'faith', labelAr: 'سكينة وتأمل', labelEn: 'Faith & Soul' },
  ];

  const filteredChallenges =
    selectedCategory === 'all'
      ? BOREDOM_CHALLENGES
      : BOREDOM_CHALLENGES.filter((c) => {
          if (selectedCategory === 'cleaning') {
            return c.category === 'cleaning' || c.category === 'organization';
          }
          if (selectedCategory === 'study') {
            return c.category === 'study' || c.category === 'coding' || c.category === 'novelty';
          }
          return c.category === selectedCategory;
        });

  // Roll new challenge
  const handleRollChallenge = () => {
    setIsTimerRunning(false);
    setIsCompleted(false);
    const pool = filteredChallenges.length > 1 ? filteredChallenges.filter((c) => c.id !== currentChallenge.id) : BOREDOM_CHALLENGES;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setCurrentChallenge(next);
    setSecondsLeft(next.durationMinutes * 60);
  };

  // Timer tick
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          setIsCompleted(true);
          try {
            confetti({ particleCount: 50, spread: 60 });
          } catch {
            // Confetti fallback
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleFinishMission = () => {
    setIsTimerRunning(false);
    setIsCompleted(true);
    onMissionCompleted(35, currentChallenge.id);
    try {
      confetti({ particleCount: 70, spread: 70 });
    } catch {
      // Confetti fallback
    }
  };

  const handleAddChallengeToGoogleTasks = async () => {
    if (!accessToken) {
      onGoogleSignIn();
      return;
    }
    try {
      const listId = await getPrimaryTaskList(accessToken);
      const title = language === 'ar' ? currentChallenge.titleAr : currentChallenge.titleEn;
      await createGoogleTask(accessToken, `[ZERO Mission] ${title}`, 'Boredom Killer healthy activity', listId);
      setSyncedMessage(language === 'ar' ? 'تمت إضافة المهمة لمهام Google!' : 'Added challenge to Google Tasks!');
      setTimeout(() => setSyncedMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setSyncedMessage(language === 'ar' ? 'فشلت المزامنة.' : 'Sync failed.');
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'Activity':
        return <Dumbbell className="w-8 h-8 text-amber-400" />;
      case 'BookOpen':
        return <BookOpen className="w-8 h-8 text-blue-400" />;
      case 'Brain':
        return <Brain className="w-8 h-8 text-purple-400" />;
      case 'Code':
        return <Code className="w-8 h-8 text-cyan-400" />;
      case 'Coffee':
        return <Coffee className="w-8 h-8 text-orange-400" />;
      case 'Footprints':
        return <Footprints className="w-8 h-8 text-emerald-400" />;
      case 'Heart':
        return <Heart className="w-8 h-8 text-rose-400" />;
      case 'ShowerHead':
        return <ShowerHead className="w-8 h-8 text-sky-400" />;
      case 'Calculator':
        return <Calculator className="w-8 h-8 text-indigo-400" />;
      default:
        return <Sparkles className="w-8 h-8 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              {t.boredomTitle}
            </h2>
            <p className="text-xs text-slate-400">{t.boredomSub}</p>
          </div>
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="bg-[#10131e] border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xl shadow-amber-950/20">
        {/* Category & Icon */}
        <div className="mb-3 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/40 shadow-inner">
          {renderIcon(currentChallenge.icon)}
        </div>

        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1">
          {currentChallenge.category} • {currentChallenge.durationMinutes} MIN
        </span>

        <h3 className="text-xl sm:text-2xl font-black text-slate-100 mb-2">
          {language === 'ar' ? currentChallenge.titleAr : currentChallenge.titleEn}
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed mb-6">
          {language === 'ar' ? currentChallenge.descAr : currentChallenge.descEn}
        </p>

        {/* Digital Timer */}
        <div className="w-full max-w-xs bg-slate-900/90 border border-slate-800 rounded-2xl py-4 px-6 mb-6 flex flex-col items-center">
          <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-wider">
            {formattedTime}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">
            {isTimerRunning ? t.challengeActive : t.startChallengeTimer}
          </span>
        </div>

        {/* Action Controls */}
        <div className="w-full max-w-xs flex flex-col gap-2.5">
          {!isCompleted ? (
            <div className="flex items-center gap-2">
              <button
                id="boredom-timer-toggle-btn"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إيقاف مؤقت' : 'Pause'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{t.startChallengeTimer}</span>
                  </>
                )}
              </button>

              <button
                id="boredom-timer-reset-btn"
                onClick={() => {
                  setIsTimerRunning(false);
                  setSecondsLeft(currentChallenge.durationMinutes * 60);
                }}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          ) : null}

          {/* Mark as Finished */}
          <button
            id="boredom-complete-btn"
            onClick={handleFinishMission}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
              isCompleted
                ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 active:scale-95'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? t.challengeFinished : (language === 'ar' ? 'أتممت المهمة الآن (+35 XP)' : 'Completed Mission (+35 XP)')}</span>
          </button>

          {/* Roll Another Challenge */}
          <button
            id="boredom-roll-btn"
            onClick={handleRollChallenge}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Dice5 className="w-4 h-4 text-amber-400" />
            <span>{t.generateNewChallenge}</span>
          </button>

          {/* Add to Google Tasks */}
          <button
            id="boredom-add-tasks-btn"
            onClick={handleAddChallengeToGoogleTasks}
            className="w-full py-2 px-3 rounded-xl bg-blue-950/30 hover:bg-blue-900/40 border border-blue-800/40 text-blue-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'إضافة إلى مهام Google' : 'Add to Google Tasks'}</span>
          </button>
        </div>

        {syncedMessage && (
          <p className="text-xs text-blue-400 mt-3 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>{syncedMessage}</span>
          </p>
        )}
      </div>

      {/* Grid of quick boredom killers with category tabs */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {language === 'ar' ? 'تصنيفات ومهمات قتل الفراغ:' : 'Boredom Killer Categories & Missions:'}
          </h4>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'ar' ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredChallenges.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setCurrentChallenge(c);
                setSecondsLeft(c.durationMinutes * 60);
                setIsTimerRunning(false);
                setIsCompleted(false);
              }}
              className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                currentChallenge.id === c.id
                  ? 'bg-amber-950/30 border-amber-500 text-amber-200 shadow-md'
                  : 'bg-[#0f121d] border-slate-800 hover:border-amber-500/50 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  {renderIcon(c.icon)}
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold">
                    {language === 'ar' ? c.titleAr : c.titleEn}
                  </h5>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {c.durationMinutes} {language === 'ar' ? 'دقائق' : 'min'} • {c.category}
                  </span>
                </div>
              </div>
              <Play className={`w-4 h-4 ${currentChallenge.id === c.id ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
