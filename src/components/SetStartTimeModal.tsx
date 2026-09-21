import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Check, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { getElapsedStreak, ElapsedStreak } from '../lib/storage';

interface SetStartTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentResetIso?: string;
  onSaveStartTime: (isoString: string) => void;
}

export const SetStartTimeModal: React.FC<SetStartTimeModalProps> = ({
  isOpen,
  onClose,
  language,
  currentResetIso,
  onSaveStartTime,
}) => {
  // Format Date to YYYY-MM-DDTHH:mm for datetime-local input
  const formatForInput = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [selectedDatetime, setSelectedDatetime] = useState<string>(() => {
    const initDate = currentResetIso ? new Date(currentResetIso) : new Date();
    return formatForInput(isNaN(initDate.getTime()) ? new Date() : initDate);
  });

  const [previewElapsed, setPreviewElapsed] = useState<ElapsedStreak>(() =>
    getElapsedStreak(currentResetIso)
  );

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      const initDate = currentResetIso ? new Date(currentResetIso) : new Date();
      setSelectedDatetime(formatForInput(isNaN(initDate.getTime()) ? new Date() : initDate));
    }
  }, [isOpen, currentResetIso]);

  // Recalculate preview whenever selectedDatetime changes
  useEffect(() => {
    if (!selectedDatetime) return;
    const targetDate = new Date(selectedDatetime);
    if (!isNaN(targetDate.getTime())) {
      setPreviewElapsed(getElapsedStreak(targetDate.toISOString()));
    }
  }, [selectedDatetime]);

  if (!isOpen) return null;

  const now = new Date();
  const maxDatetime = formatForInput(now);

  // Quick Preset Handlers
  const handleSetPreset = (preset: 'now' | '1h' | '6h' | 'midnight' | 'yesterday' | '3d' | '7d' | '30d') => {
    const target = new Date();
    switch (preset) {
      case 'now':
        break;
      case '1h':
        target.setHours(target.getHours() - 1);
        break;
      case '6h':
        target.setHours(target.getHours() - 6);
        break;
      case 'midnight':
        target.setHours(0, 0, 0, 0);
        break;
      case 'yesterday':
        target.setDate(target.getDate() - 1);
        break;
      case '3d':
        target.setDate(target.getDate() - 3);
        break;
      case '7d':
        target.setDate(target.getDate() - 7);
        break;
      case '30d':
        target.setDate(target.getDate() - 30);
        break;
    }
    setSelectedDatetime(formatForInput(target));
  };

  const handleSave = () => {
    if (!selectedDatetime) return;
    const targetDate = new Date(selectedDatetime);
    if (!isNaN(targetDate.getTime())) {
      onSaveStartTime(targetDate.toISOString());
      onClose();
    }
  };

  const formatDateLocale = (isoStr?: string) => {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString(language === 'ar' ? 'ar-MA' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e1017] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/80">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-100">
              {language === 'ar' ? 'تحديد وقت وتاريخ البداية' : 'Set Streak Start Time'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'ar'
                ? 'حدد بدقة متى بدأت سلسلتك أو متى وقعت آخر انتكاسة'
                : 'Accurately choose when your clean streak started'}
            </p>
          </div>
        </div>

        {/* Current Registered Start Time */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between mb-4">
          <span className="text-slate-400">
            {language === 'ar' ? 'الوقت المسجل حالياً:' : 'Current registered time:'}
          </span>
          <span className="font-mono font-bold text-amber-300">
            {formatDateLocale(currentResetIso)}
          </span>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-bold text-slate-300 block">
            {language === 'ar' ? 'اختيارات سريعة:' : 'Quick Presets:'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleSetPreset('now')}
              className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-[11px] font-bold text-slate-200 border border-slate-700/60 transition"
            >
              {language === 'ar' ? '⚡ الآن (0 دقيقة)' : '⚡ Right Now'}
            </button>
            <button
              type="button"
              onClick={() => handleSetPreset('1h')}
              className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-[11px] font-bold text-slate-200 border border-slate-700/60 transition"
            >
              {language === 'ar' ? 'قبل ساعة' : '1 Hour Ago'}
            </button>
            <button
              type="button"
              onClick={() => handleSetPreset('midnight')}
              className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-[11px] font-bold text-slate-200 border border-slate-700/60 transition"
            >
              {language === 'ar' ? 'منتصف الليل (00:00)' : 'Midnight (00:00)'}
            </button>
            <button
              type="button"
              onClick={() => handleSetPreset('yesterday')}
              className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-[11px] font-bold text-slate-200 border border-slate-700/60 transition"
            >
              {language === 'ar' ? 'البارحة' : 'Yesterday'}
            </button>
            <button
              type="button"
              onClick={() => handleSetPreset('3d')}
              className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-[11px] font-bold text-slate-200 border border-slate-700/60 transition"
            >
              {language === 'ar' ? 'قبل 3 أيام' : '3 Days Ago'}
            </button>
            <button
              type="button"
              onClick={() => handleSetPreset('7d')}
              className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-[11px] font-bold text-slate-200 border border-slate-700/60 transition"
            >
              {language === 'ar' ? 'قبل أسبوع (7d)' : '7 Days Ago'}
            </button>
            <button
              type="button"
              onClick={() => handleSetPreset('30d')}
              className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-[11px] font-bold text-slate-200 border border-slate-700/60 transition col-span-2 sm:col-span-2"
            >
              {language === 'ar' ? 'قبل شهر (30 يوماً)' : '30 Days Ago'}
            </button>
          </div>
        </div>

        {/* Custom Datetime Input */}
        <div className="space-y-2 mb-5">
          <label className="text-xs font-bold text-slate-300 block flex items-center justify-between">
            <span>{language === 'ar' ? 'أو اختر التاريخ والوقت المخصص:' : 'Or custom date & time:'}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              {language === 'ar' ? '(لا يمكن اختيار وقت مستقبلي)' : '(Cannot exceed current time)'}
            </span>
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              value={selectedDatetime}
              max={maxDatetime}
              onChange={(e) => setSelectedDatetime(e.target.value)}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-100 text-sm font-mono outline-none transition"
            />
          </div>
        </div>

        {/* Live Calculation Preview Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#151928] to-[#0c0e18] border border-amber-500/30 mb-5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'المدة المحتسبة بدقة بعد هذا التعديل:' : 'Calculated streak with this selection:'}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
            {/* Days */}
            <div className="p-2 rounded-xl bg-black/60 border border-slate-800">
              <span className="block text-xl sm:text-2xl font-black font-mono text-white">
                {previewElapsed.days}
              </span>
              <span className="text-[10px] text-amber-400 font-bold">
                {language === 'ar' ? 'أيام' : 'Days'}
              </span>
            </div>
            {/* Hours */}
            <div className="p-2 rounded-xl bg-black/60 border border-slate-800">
              <span className="block text-xl sm:text-2xl font-black font-mono text-white">
                {previewElapsed.hours}
              </span>
              <span className="text-[10px] text-slate-300 font-medium">
                {language === 'ar' ? 'ساعات' : 'Hours'}
              </span>
            </div>
            {/* Minutes */}
            <div className="p-2 rounded-xl bg-black/60 border border-slate-800">
              <span className="block text-xl sm:text-2xl font-black font-mono text-white">
                {previewElapsed.minutes}
              </span>
              <span className="text-[10px] text-slate-300 font-medium">
                {language === 'ar' ? 'دقائق' : 'Mins'}
              </span>
            </div>
            {/* Seconds */}
            <div className="p-2 rounded-xl bg-black/60 border border-slate-800">
              <span className="block text-xl sm:text-2xl font-black font-mono text-amber-300">
                {previewElapsed.seconds}
              </span>
              <span className="text-[10px] text-slate-300 font-medium">
                {language === 'ar' ? 'ثوانٍ' : 'Secs'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-black text-sm shadow-xl shadow-amber-950/50 transition flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{language === 'ar' ? 'حفظ وتحديث العداد' : 'Save & Update Counter'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-300 font-semibold text-sm transition"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
