import React from 'react';
import {
  AlertCircle,
  ExternalLink,
  RotateCcw,
  X,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';

interface PopupBlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  language: Language;
}

export const PopupBlockedModal: React.FC<PopupBlockedModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  language,
}) => {
  if (!isOpen) return null;

  const isAr = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#111422] border border-amber-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-amber-950/40 text-start flex flex-col my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Heading */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
              {isAr ? 'تنبيه أمان المتصفح' : 'BROWSER POPUP BLOCKED'}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
              {isAr
                ? 'تم حظر نافذة تسجيل الدخول'
                : 'Sign-In Window Blocked'}
            </h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
          {isAr
            ? 'قام متصفحك بحظر نافذة Google المنبثقة تلقائياً بسبب قيود الأمان في بيئة المعاينة أو إعدادات حظر النوافذ. يمكنك المتابعة بأحد الخيارات التالية:'
            : 'Your browser blocked the Google sign-in window due to sandbox restrictions in the preview frame or browser popup-blocking settings. Choose an option below to proceed:'}
        </p>

        {/* Action Options */}
        <div className="space-y-3 mb-5">
          {/* Option 1: Open in a new tab (Best for iframe environments) */}
          <a
            id="open-in-new-tab-btn"
            href={typeof window !== 'undefined' ? window.location.href : '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-xs sm:text-sm transition flex items-center justify-between shadow-lg shadow-blue-950/50 group"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-blue-200 group-hover:rotate-12 transition-transform" />
              <span>
                {isAr
                  ? 'فتح التطبيق في تبويبة جديدة (موصى به)'
                  : 'Open App in New Tab (Recommended)'}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-700/80 font-mono text-blue-200">
              {isAr ? 'كامل الصلاحيات' : 'Full Access'}
            </span>
          </a>

          {/* Option 2: Allow popups and retry */}
          <button
            id="retry-google-signin-btn"
            onClick={() => {
              onClose();
              onRetry();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-xs transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>
                {isAr
                  ? 'سمحتُ بالنوافذ المنبثقة، أعد المحاولة'
                  : 'I allowed popups, try again'}
              </span>
            </div>
          </button>
        </div>

        {/* Offline notice */}
        <div className="pt-3 border-t border-slate-800/80 flex items-start gap-2.5 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="text-slate-300 font-medium block">
              {isAr ? 'تطبيق ZERO يعمل بدون إنترنت وبأمان تام:' : 'ZERO works 100% offline & securely:'}
            </span>
            <span>
              {isAr
                ? 'جميع أدوات كسر الرغبة (طوارئ 90 ث، واعتراض البحث، وسجل المحفزات) تعمل محلياً بكفاءة تامة حتى دون تسجيل الدخول.'
                : 'All urge-interception tools (90s emergency, search kill, trigger journal) function with full local persistence even without sign-in.'}
            </span>
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition"
        >
          {isAr ? 'المتابعة كضيف (حفظ محلي)' : 'Continue as Guest (Local Storage)'}
        </button>
      </div>
    </div>
  );
};
