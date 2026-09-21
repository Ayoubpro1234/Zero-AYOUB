import React from 'react';
import { User } from 'firebase/auth';
import { Shield, Flame, Globe, UserCheck, LogIn, Award, AlertOctagon } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface HeaderProps {
  profile: UserProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenEmergency: () => void;
  currentUser: User | null;
  onGoogleSignIn: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  language,
  onLanguageChange,
  onOpenEmergency,
  currentUser,
  onGoogleSignIn,
  onOpenSettings,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07080e]/95 backdrop-blur-md px-2.5 sm:px-4 py-2">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* 1. ZERO Brand Identity */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 p-[1px] shadow-sm shadow-red-950/40 flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-[7px] sm:rounded-[11px] bg-[#0c0e18] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 fill-red-500/10" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-black tracking-wider text-sm sm:text-base text-white">
              ZERO
            </span>
            <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded bg-red-950/80 border border-red-800/60 text-red-300 font-bold leading-none">
              {language === 'ar' ? 'كاسر الإلحاح' : 'INTERCEPT'}
            </span>
          </div>
        </div>

        {/* 2. Visual Priority Controls: Streak -> XP -> 90s Emergency -> Secondary */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* A. Streak Indicator (Primary Visual) */}
          <div
            className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-lg sm:rounded-xl bg-emerald-950/30 border border-emerald-600/30 text-emerald-400 shadow-sm"
            title={language === 'ar' ? 'السلسلة الحالية' : 'Current Streak'}
          >
            <Flame className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20 animate-pulse" />
            <span className="text-xs sm:text-sm font-black font-mono">{profile.streakDays}</span>
            <span className="text-[10px] text-emerald-400/80 font-medium">{t.daysUnit}</span>
          </div>

          {/* B. XP (Secondary Visual) */}
          <div
            className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg sm:rounded-xl bg-slate-900 border border-slate-800 text-amber-400/90 text-xs font-semibold"
            title={language === 'ar' ? 'مجموع نقاط الخبرة' : 'Total XP'}
          >
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            <span className="font-mono font-bold text-slate-200 text-[11px] sm:text-xs">{profile.xp}</span>
            <span className="text-[9px] sm:text-[10px] text-amber-500/70 font-normal">XP</span>
          </div>

          {/* C. 90s Emergency Action */}
          <button
            id="header-sos-btn"
            onClick={onOpenEmergency}
            className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-[11px] sm:text-xs flex items-center gap-1 shadow-md shadow-red-950/60 active:scale-95 transition border border-red-500/30"
            title={language === 'ar' ? 'طوارئ 90 ثانية' : 'Emergency 90s'}
          >
            <AlertOctagon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white animate-pulse" />
            <span className="font-mono font-bold tracking-tight">90s</span>
          </button>

          {/* D. Language Toggle (Secondary) */}
          <button
            id="header-lang-btn"
            onClick={() => onLanguageChange(language === 'ar' ? 'en' : 'ar')}
            className="h-7 sm:h-8 px-1.5 sm:px-2 rounded-lg sm:rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-0.5 sm:gap-1 transition"
            title={language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold">{language === 'ar' ? 'EN' : 'ع'}</span>
          </button>

          {/* E. Profile Avatar or Sign In (Secondary) */}
          {currentUser ? (
            <button
              id="header-user-profile-btn"
              onClick={onOpenSettings}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl border border-red-500/40 bg-red-950/40 overflow-hidden flex items-center justify-center text-red-300 hover:border-red-400 transition shrink-0"
              title={currentUser.displayName || currentUser.email || 'الحساب والإعدادات'}
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          ) : (
            <button
              id="header-login-btn"
              onClick={onGoogleSignIn}
              className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] sm:text-xs font-bold flex items-center gap-1 transition border border-slate-700"
              title={t.signInWithGoogle}
            >
              <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300" />
              <span className="hidden sm:inline">{language === 'ar' ? 'دخول' : 'Sign in'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

