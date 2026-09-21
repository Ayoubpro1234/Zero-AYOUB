import React, { useState } from 'react';
import { X, CheckCircle, ShieldAlert, Sparkles, Compass } from 'lucide-react';
import { Language, TriggerType } from '../types';

interface SlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSaveSlip: (details: {
    trigger: TriggerType | string;
    location?: string;
    escalationEvent?: string;
    interruptPoint?: string;
    nextTimePlan?: string;
  }) => void;
}

export const SlipModal: React.FC<SlipModalProps> = ({
  isOpen,
  onClose,
  language,
  onSaveSlip,
}) => {
  const [selectedTrigger, setSelectedTrigger] = useState<string>('boredom');
  const [note, setNote] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const triggerOptions = [
    { id: 'boredom', labelAr: 'الملل', labelEn: 'Boredom' },
    { id: 'loneliness', labelAr: 'الوحدة', labelEn: 'Loneliness' },
    { id: 'phone', labelAr: 'الهاتف', labelEn: 'Phone in hand' },
    { id: 'aimless_browsing', labelAr: 'تصفح بلا هدف', labelEn: 'Aimless browsing' },
    { id: 'social_media', labelAr: 'السوشيال ميديا', labelEn: 'Social media' },
    { id: 'specific_time', labelAr: 'وقت معين (ليل / فراغ)', labelEn: 'Specific time' },
    { id: 'specific_place', labelAr: 'مكان معين (غرفة النوم / عزلة)', labelEn: 'Specific place' },
    { id: 'other', labelAr: 'آخر', labelEn: 'Other' },
    { id: 'unknown', labelAr: 'لا أعرف', labelEn: "Don't know" },
  ];

  const handleSave = () => {
    onSaveSlip({
      trigger: selectedTrigger,
      escalationEvent: note.trim() || 'Recorded slip event without full streak reset',
      interruptPoint: 'conscious_reflection',
      nextTimePlan: 'Regain focus, shift physical environment, continue clean streak',
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setNote('');
      onClose();
    }, 1200);
  };

  const handleCloseModal = () => {
    setSaved(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e1017] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-start">
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {saved ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-slate-100">
              {language === 'ar' ? 'تسجلات الزلة بنجاح' : 'Slip Recorded'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'ar'
                ? 'حافظ على هدوئك. السلسلة ديالك مستمرة.'
                : 'Stay calm. Your active streak continues.'}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-400 block">
                  {language === 'ar' ? 'تسجيل زلة عابرة (Slip)' : 'Record Slip'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-100">
                  {language === 'ar' ? 'تسجلات الزلة.' : 'Record Slip Event.'}
                </h2>
              </div>
            </div>

            {/* Reassuring Message */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              <div className="font-bold mb-1 flex items-center gap-1.5 text-amber-300">
                <Sparkles className="w-4 h-4" />
                <span>
                  {language === 'ar'
                    ? 'ماشي ضروري هاد اللحظة تمسح كل التقدم ديالك.'
                    : 'This moment does NOT mean erasing all your progress.'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {language === 'ar'
                  ? 'الهدف هو رصد المحفز بسرعة، والوقوف مجدداً دون تحويل الزلة إلى انتكاسة كاملة.'
                  : 'The goal is to spot the initial trigger early, stand back up, and avoid turning a slip into a full relapse.'}
              </p>
            </div>

            {/* Question: What was the first trigger? */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200">
                {language === 'ar' ? 'شنو كان أول محفز؟' : 'What was the initial trigger?'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {triggerOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedTrigger(opt.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-start transition truncate ${
                      selectedTrigger === opt.id
                        ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-200 shadow-md font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {language === 'ar' ? opt.labelAr : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional note */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {language === 'ar' ? 'ملاحظة سريعة (اختياري)' : 'Quick note (optional)'}
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'شنو كان السياق؟ مثلاً: تصفح متأخر، عزلة...'
                    : 'What was the context? e.g., late scrolling, isolation...'
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/40 transition"
              >
                {language === 'ar' ? 'حفظ ومواصلة التقدم' : 'Save & Continue Forward'}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-semibold transition"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
