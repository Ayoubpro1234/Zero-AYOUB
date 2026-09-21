import React from 'react';
import { Award, Sparkles, X, Flame } from 'lucide-react';
import { Milestone, Language } from '../types';

interface MilestoneCelebrationModalProps {
  milestone: Milestone | null;
  language: Language;
  onClose: () => void;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  milestone,
  language,
  onClose,
}) => {
  if (!milestone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#181c2e] via-[#0f121d] to-[#090b12] border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Milestone Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-4xl shadow-lg shadow-amber-950/60 animate-bounce">
          {milestone.icon}
        </div>

        <div className="space-y-2 mt-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'إنجاز محطة جديدة' : 'Milestone Unlocked'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
            {language === 'ar' ? `🔥 ${milestone.days} أيام!` : `🔥 ${milestone.days} Days!`}
          </h2>

          <p className="text-sm font-semibold text-amber-300">
            {language === 'ar' ? milestone.descriptionAr : milestone.descriptionEn}
          </p>

          <p className="text-xs text-slate-400 pt-1">
            {language === 'ar' ? milestone.titleAr : milestone.titleEn}
          </p>
        </div>

        {/* XP Reward Badge */}
        <div className="my-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-center gap-3">
          <Award className="w-6 h-6 text-amber-400" />
          <div className="text-start">
            <span className="text-xl font-black text-white font-mono block">
              +{milestone.xpReward} XP
            </span>
            <span className="text-[10px] text-amber-300/80 font-semibold uppercase">
              {language === 'ar' ? 'مكافأة الصمود' : 'Resilience Reward'}
            </span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-bold text-sm shadow-xl shadow-amber-950/50 transition"
        >
          {language === 'ar' ? 'واصل الصمود 💪' : 'Keep Standing Strong 💪'}
        </button>
      </div>
    </div>
  );
};
