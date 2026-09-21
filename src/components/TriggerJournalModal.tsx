import React, { useState } from 'react';
import { X, Check, Activity, MapPin, History, ShieldAlert } from 'lucide-react';
import {
  Language,
  TriggerType,
  TriggerLocation,
  BeforeEventActivity,
} from '../types';
import {
  TRANSLATIONS,
  TRIGGER_TRANSLATIONS,
  LOCATION_TRANSLATIONS,
  BEFORE_EVENT_TRANSLATIONS,
} from '../lib/translations';

interface TriggerJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialTrigger?: TriggerType;
  onSaveTrigger: (
    trigger: TriggerType,
    location: TriggerLocation,
    beforeEvent: BeforeEventActivity,
    intensity: number,
    note?: string
  ) => void;
}

export const TriggerJournalModal: React.FC<TriggerJournalModalProps> = ({
  isOpen,
  onClose,
  language,
  initialTrigger,
  onSaveTrigger,
}) => {
  const t = TRANSLATIONS[language];

  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType>(initialTrigger || 'boredom');
  const [selectedLocation, setSelectedLocation] = useState<TriggerLocation>('bedroom');
  const [selectedBefore, setSelectedBefore] = useState<BeforeEventActivity>('scrolling');
  const [intensity, setIntensity] = useState<number>(7);
  const [note, setNote] = useState<string>('');

  if (!isOpen) return null;

  const triggerOptions: TriggerType[] = [
    'boredom',
    'loneliness',
    'stress',
    'late_night',
    'social_media',
    'random_thought',
    'visual_trigger',
    'alone_with_phone',
    'other',
  ];

  const locationOptions: TriggerLocation[] = [
    'bedroom',
    'bathroom',
    'living_room',
    'outside',
    'work_study',
    'other',
  ];

  const beforeOptions: BeforeEventActivity[] = [
    'studying',
    'gaming',
    'scrolling',
    'lying_down',
    'doing_nothing',
    'working',
    'other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTrigger(selectedTrigger, selectedLocation, selectedBefore, intensity, note.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0e111a] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100">{t.journalTitle}</h3>
              <p className="text-[11px] text-slate-400">{t.journalDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Trigger Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.triggerTypeLabel}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {triggerOptions.map((trig) => {
                const isSelected = selectedTrigger === trig;
                const label = TRIGGER_TRANSLATIONS[trig][language];
                return (
                  <button
                    key={trig}
                    type="button"
                    onClick={() => setSelectedTrigger(trig)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all text-start flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-slate-900/80 border border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.locationLabel}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {locationOptions.map((loc) => {
                const isSelected = selectedLocation === loc;
                const label = LOCATION_TRANSLATIONS[loc][language];
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setSelectedLocation(loc)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all text-start flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-500/20 border border-blue-500 text-blue-200'
                        : 'bg-slate-900/80 border border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Before Event Activity */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-purple-400" />
              <span>{t.beforeEventLabel}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {beforeOptions.map((act) => {
                const isSelected = selectedBefore === act;
                const label = BEFORE_EVENT_TRANSLATIONS[act][language];
                return (
                  <button
                    key={act}
                    type="button"
                    onClick={() => setSelectedBefore(act)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all text-start flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-500/20 border border-purple-500 text-purple-200'
                        : 'bg-slate-900/80 border border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Intensity Slider (1-10) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">{t.intensityLabel}</span>
              <span
                className={`text-sm font-black px-2.5 py-0.5 rounded-md font-mono ${
                  intensity >= 8
                    ? 'bg-red-950 text-red-400 border border-red-800'
                    : intensity >= 5
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                {intensity} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>{language === 'ar' ? '1 (خاطرة خفيفة)' : '1 (Mild urge)'}</span>
              <span>{language === 'ar' ? '5 (متوسط)' : '5 (Moderate)'}</span>
              <span>{language === 'ar' ? '10 (عاصف جداً)' : '10 (Intense storm)'}</span>
            </div>
          </div>

          {/* 5. Optional Note */}
          <div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.notePlaceholder}
              rows={2}
              maxLength={200}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-500 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition resize-none"
            />
          </div>

          {/* Submit */}
          <button
            id="save-trigger-journal-btn"
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            {t.saveTriggerBtn}
          </button>
        </form>
      </div>
    </div>
  );
};
