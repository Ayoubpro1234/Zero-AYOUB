import React, { useState } from 'react';
import { X, RotateCcw, ShieldCheck, Clock, Sparkles, Compass } from 'lucide-react';
import { Language } from '../types';

interface RelapseModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onConfirmRelapse: (customTimeIso?: string) => void;
  onLaunchChainAnalyzer: () => void;
}

export const RelapseModal: React.FC<RelapseModalProps> = ({
  isOpen,
  onClose,
  language,
  onConfirmRelapse,
  onLaunchChainAnalyzer,
}) => {
  const [step, setStep] = useState<'confirm' | 'post_reset'>('confirm');
  const [useCustomTime, setUseCustomTime] = useState<boolean>(false);

  const formatForInput = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [customDatetime, setCustomDatetime] = useState<string>(() => formatForInput(new Date()));

  if (!isOpen) return null;

  const now = new Date();
  const maxDatetime = formatForInput(now);

  const handleConfirm = () => {
    if (useCustomTime && customDatetime) {
      const target = new Date(customDatetime);
      if (!isNaN(target.getTime())) {
        onConfirmRelapse(target.toISOString());
      } else {
        onConfirmRelapse();
      }
    } else {
      onConfirmRelapse();
    }
    setStep('post_reset');
  };

  const handleCloseAll = () => {
    setStep('confirm');
    setUseCustomTime(false);
    onClose();
  };

  const handleOpenChain = () => {
    setStep('confirm');
    setUseCustomTime(false);
    onClose();
    onLaunchChainAnalyzer();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e1017] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={handleCloseAll}
          className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'confirm' ? (
          <div className="space-y-5">
            {/* Warning Icon */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
              <RotateCcw className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                {language === 'ar' ? 'تسجيل انتكاسة وإعادة ضبط العداد' : 'Record Relapse & Reset Streak'}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                {language === 'ar'
                  ? 'العداد غادي يرجع للصفر، ولكن الخبرة والإنجازات وXP ديالك غيبقاو محفوظين.'
                  : 'The streak counter will reset to 0, but your total XP, lessons, and achievements remain safe.'}
              </p>
            </div>

            {/* Reassuring Philosophy Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-start space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ar' ? 'فلسفة ZERO:' : 'ZERO Principle:'}</span>
              </div>
              <p className="text-xs text-slate-300 italic">
                "{language === 'ar'
                  ? 'العداد رجع للصفر، ولكن التجربة ما رجعاتش للصفر.'
                  : 'The counter resets to zero, but your experience never resets to zero.'}"
              </p>
            </div>

            {/* Timing Choice Option */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-start space-y-2.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'ar' ? 'وقت حدوث الانتكاسة:' : 'When did it happen?'}</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setUseCustomTime(false)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    !useCustomTime
                      ? 'bg-rose-600/30 border-rose-500 text-rose-200'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {language === 'ar' ? '⚡ الآن (اللحظة الحالية)' : '⚡ Just Now'}
                </button>

                <button
                  type="button"
                  onClick={() => setUseCustomTime(true)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    useCustomTime
                      ? 'bg-amber-500/30 border-amber-500 text-amber-200'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {language === 'ar' ? '🕒 تحديد وقت سابق' : '🕒 Past Time'}
                </button>
              </div>

              {useCustomTime && (
                <div className="pt-1.5 space-y-1 animate-in fade-in duration-150">
                  <input
                    type="datetime-local"
                    value={customDatetime}
                    max={maxDatetime}
                    onChange={(e) => setCustomDatetime(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 text-slate-100 text-xs font-mono outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    {language === 'ar'
                      ? 'سيبدأ العداد في حساب الثواني والدقائق انطلاقاً من هذا الوقت'
                      : 'The counter will start calculating seconds and minutes from this timestamp'}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-98 text-white font-bold text-sm shadow-lg shadow-rose-950/50 transition flex items-center justify-center gap-2"
              >
                <span>{language === 'ar' ? 'تأكيد وإعادة الضبط' : 'Confirm & Reset'}</span>
              </button>
              <button
                type="button"
                onClick={handleCloseAll}
                className="py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-300 font-semibold text-sm transition"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        ) : (
          /* POST-RESET EXPERIENCE */
          <div className="space-y-6 py-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                {language === 'ar' ? 'محاولة جديدة بدأت دابا' : 'Fresh Clean Attempt Started'}
              </span>
              <h2 className="text-2xl font-black text-slate-100">
                {language === 'ar' ? 'رجعنا العداد للصفر.' : 'Counter Reset to Zero.'}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {language === 'ar'
                  ? 'ولكن XP والتجارب والإنجازات ديالك باقين. المحاولة الجديدة بدات دابا.'
                  : 'Your XP, hard-learned lessons, and milestones remain intact. The new streak begins right now.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              {language === 'ar'
                ? 'ما تحاولش تربح العام كامل دابا. ربح غير الـ 90 ثانية الجاية.'
                : "Don't try to win the entire year today. Just master the next 90 seconds."}
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleCloseAll}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 text-white font-black text-sm shadow-xl shadow-emerald-950/60 transition flex items-center justify-center gap-2"
              >
                <span>🚀 {language === 'ar' ? 'ابدأ من جديد' : 'Start Fresh Now'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenChain}
                className="w-full py-3.5 px-6 rounded-2xl bg-purple-950/50 hover:bg-purple-900/50 border border-purple-800/60 text-purple-200 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-purple-400" />
                <span>🔎 {language === 'ar' ? 'حلل شنو وقع (Chain Analyzer)' : 'Analyze What Happened'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
