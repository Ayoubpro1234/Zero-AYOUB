import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  X,
  XCircle,
  Smartphone,
  Timer,
  PhoneCall,
  Sparkles,
  Droplets,
  Activity,
  CheckCircle2,
  Play,
  RotateCcw,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface AntiSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onStartEmergency90s: () => void;
  onOpenBoredomKiller: () => void;
  onStopSearchSuccess: (sessionId?: string) => void;
}

export const AntiSearchModal: React.FC<AntiSearchModalProps> = ({
  isOpen,
  onClose,
  language,
  onStartEmergency90s,
  onOpenBoredomKiller,
  onStopSearchSuccess,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'steps' | 'timer'>('steps');
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSessionId(`antisearch_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);
    } else {
      setActiveTab('steps');
      setTimerSeconds(60);
      setIsTimerRunning(false);
      setTimerFinished(false);
      setStep1Done(false);
      setStep2Done(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          setTimerFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!isOpen) return null;

  const handleStartTimer = () => {
    setActiveTab('timer');
    setTimerSeconds(60);
    setIsTimerRunning(true);
    setTimerFinished(false);
  };

  const handleCompleteSuccess = () => {
    onStopSearchSuccess(sessionId);
    onClose();
  };

  const handleTransitionToEmergency = () => {
    onStopSearchSuccess(sessionId);
    onClose();
    onStartEmergency90s();
  };

  const handleTransitionToBoredom = () => {
    onStopSearchSuccess(sessionId);
    onClose();
    onOpenBoredomKiller();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#110d15] border-2 border-red-600/90 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-red-950/80 text-start flex flex-col my-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Critical Intercept Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/60 flex items-center justify-center text-red-500 animate-pulse shrink-0">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
                {language === 'ar' ? 'اعتراض فوري لحلقة البحث' : 'CRITICAL SEARCH INTERCEPT'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-red-300 uppercase tracking-tight">
              {t.antiSearchTitle}
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
          {language === 'ar'
            ? 'البحث هو أسرع منزلق نحو السلوك. كسر هذا المنعطف الآن هو أعظم انتصار للإرادة.'
            : 'Searching is the steepest slippery slope. Breaking this exact moment is your highest leverage victory.'}
        </p>

        {/* View Switcher: Steps or 60s Recovery Timer */}
        {activeTab === 'steps' ? (
          <div className="space-y-4">
            {/* Immediate 3-Step Action Protocol */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-red-400" />
                <span>{language === 'ar' ? 'بروتوكول الخطوات الـ 3 الفوري:' : 'Immediate 3-Step Action:'}</span>
              </h3>

              {/* Step 1 */}
              <div
                onClick={() => setStep1Done(!step1Done)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                  step1Done
                    ? 'bg-red-950/30 border-red-800/50 text-slate-400 line-through'
                    : 'bg-[#18111e] border-red-900/60 text-slate-100 hover:border-red-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold block">
                      {language === 'ar' ? 'أغلق المتصفح وتبويبة البحث فوراً' : 'Close browser immediately'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {language === 'ar' ? 'اقطع الفضول وأوقف تحميل أي صفحة' : 'Kill the tab, stop the curiosity loop'}
                    </span>
                  </div>
                </div>
                <button className="text-slate-400">
                  {step1Done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </button>
              </div>

              {/* Step 2 */}
              <div
                onClick={() => setStep2Done(!step2Done)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                  step2Done
                    ? 'bg-red-950/30 border-red-800/50 text-slate-400 line-through'
                    : 'bg-[#18111e] border-red-900/60 text-slate-100 hover:border-red-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold block">
                      {language === 'ar' ? 'ضع الهاتف مقلوباً في الطرف الآخر من الغرفة' : 'Place phone face down across the room'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {language === 'ar' ? 'ضع مسافة جسدية لا تقل عن 3 أمتار بينك وبينه' : 'Create at least 3 meters of physical space'}
                    </span>
                  </div>
                </div>
                <button className="text-slate-400">
                  {step2Done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Smartphone className="w-5 h-5 text-amber-400" />
                  )}
                </button>
              </div>

              {/* Step 3: Trigger 60s Recovery Timer */}
              <button
                id="anti-search-start-60s-btn"
                onClick={handleStartTimer}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 active:scale-98 text-white font-black text-sm shadow-xl shadow-red-950/60 flex items-center justify-center gap-2 transition"
              >
                <Timer className="w-5 h-5 animate-spin" />
                <span>
                  {language === 'ar'
                    ? '3. بدء مؤقت التعافي (60 ثانية) الآن'
                    : '3. Start 60-Second Recovery Timer'}
                </span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>

            {/* 3 Fast Replacement Tasks */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                {language === 'ar' ? '3 بدائل فورية لتفريغ الشحنة:' : '3 Fast Replacement Tasks:'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={handleCompleteSuccess}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500 text-start flex items-center gap-2.5 transition active:scale-95"
                >
                  <PhoneCall className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      {language === 'ar' ? 'اتصل بأحد' : 'Call someone'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {language === 'ar' ? 'تواصل صوتي سريع' : 'Quick voice chat'}
                    </span>
                  </div>
                </button>

                <button
                  onClick={handleCompleteSuccess}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500 text-start flex items-center gap-2.5 transition active:scale-95"
                >
                  <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      {language === 'ar' ? 'ماء بارد للوجه' : 'Cold water splash'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {language === 'ar' ? 'إنعاش فوري' : 'Shock the senses'}
                    </span>
                  </div>
                </button>

                <button
                  onClick={handleCompleteSuccess}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500 text-start flex items-center gap-2.5 transition active:scale-95"
                >
                  <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      {language === 'ar' ? '10 تمارين قفز/ضغط' : '10 jumping jacks'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {language === 'ar' ? 'تفريغ طاقة جسدية' : 'Physical energy vent'}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* 60s Recovery Timer View */
          <div className="flex flex-col items-center text-center py-2 animate-in fade-in space-y-5">
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-red-500 transition-all duration-1000 ease-linear"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 68}
                  strokeDashoffset={2 * Math.PI * 68 * (1 - timerSeconds / 60)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl sm:text-5xl font-mono font-black text-white">
                  {timerSeconds}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {language === 'ar' ? 'ثانية للتهدئة' : 'Seconds reset'}
                </span>
              </div>
            </div>

            <div className="max-w-xs space-y-1">
              <h4 className="text-sm font-bold text-slate-100">
                {language === 'ar'
                  ? 'تنفس بعمق وابقَ بعيداً عن الشاشة'
                  : 'Breathe slowly. Stay detached from the screen.'}
              </h4>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'الهرمونات والموجة الفسيولوجية تستقر تلقائياً بمجرد الامتناع.'
                  : 'The acute physiological urge wave naturally subsides with every passing second.'}
              </p>
            </div>

            {/* Timer Actions */}
            <div className="w-full flex flex-col gap-2">
              <button
                id="anti-search-safe-now-btn"
                onClick={handleCompleteSuccess}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {language === 'ar'
                    ? 'أغلقت البحث وأنا بأمان الآن (+45 XP)'
                    : 'I closed search and I am safe now (+45 XP)'}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleTransitionToEmergency}
                  className="py-2.5 px-3 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>{language === 'ar' ? 'ما زلت بحاجة لإنقاذ 90 ث' : 'Need 90s Protocol'}</span>
                </button>

                <button
                  onClick={handleTransitionToBoredom}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'مهمة بديلة نافعة' : 'Safe Mission'}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setActiveTab('steps');
                }}
                className="text-xs text-slate-500 hover:text-slate-300 py-1"
              >
                {language === 'ar' ? '← العودة للخطوات' : '← Back to steps'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
