import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  Settings,
  Globe,
  Lock,
  Download,
  Trash2,
  LogIn,
  LogOut,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Shield,
  Volume2,
  VolumeX,
  Bell,
  Moon,
  Clock,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import { clearAllLocalData, loadTriggers, loadInterventions, loadSlips } from '../lib/storage';

interface SettingsViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: User | null;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
  profile: UserProfile;
  onResetData: () => void;
  onUpdateProfile?: (updater: (prev: UserProfile) => UserProfile) => void;
  onOpenOnboarding?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  language,
  onLanguageChange,
  currentUser,
  onGoogleSignIn,
  onSignOut,
  profile,
  onResetData,
  onUpdateProfile,
  onOpenOnboarding,
}) => {
  const t = TRANSLATIONS[language];
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleToggleSound = () => {
    if (onUpdateProfile) {
      onUpdateProfile((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
    }
  };

  const handleToggleRiskAlerts = () => {
    if (onUpdateProfile) {
      onUpdateProfile((prev) => ({ ...prev, riskAlertsEnabled: !prev.riskAlertsEnabled }));
    }
  };

  const handleToggleNightBoundaries = () => {
    if (onUpdateProfile) {
      onUpdateProfile((prev) => ({ ...prev, nightBoundaryAlerts: !prev.nightBoundaryAlerts }));
    }
  };

  const handleExportJson = () => {
    const backup = {
      profile,
      triggers: loadTriggers(profile.uid),
      interventions: loadInterventions(profile.uid),
      slips: loadSlips(profile.uid),
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `zero_interceptor_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleConfirmClear = () => {
    clearAllLocalData(profile.uid);
    setShowClearConfirm(false);
    onResetData();
    setMessage(t.dataCleared);
    setTimeout(() => setMessage(null), 3500);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300" dir="rtl">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-red-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              {t.settingsTitle}
            </h2>
            <p className="text-xs text-slate-400">
              إدارة التفضيلات، درع الحماية، والنسخ الاحتياطي
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* User Profile Card */}
      <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-400" />
            <span>الملف الشخصي ودرع الحماية</span>
          </div>
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="text-xs font-semibold text-red-400 hover:text-red-300 transition"
            >
              تعديل وقت الحماية
            </button>
          )}
        </h3>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white">
                  {profile.nickname || currentUser?.displayName || 'بطل ZERO'}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {profile.levelTitle}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                سلسلة الثبات: {profile.streakDays} يوم • {profile.xp} XP • {profile.urgesInterrupted} تدخل ناجح
              </p>
            </div>
          </div>

          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="py-1.5 px-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-xs font-semibold transition"
            >
              تعديل
            </button>
          )}
        </div>
      </div>

      {/* Cloud & Authentication (Firebase) */}
      <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-400" />
          <span>{t.authSection}</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          يتم حفظ بياناتك وتقدمك بشكل مستقل لكل حساب Google، مع إمكانية التبديل بين الحسابات في أي وقت.
        </p>

        {currentUser ? (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border border-red-500/60"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-950 border border-red-800 flex items-center justify-center text-red-300 font-bold">
                  {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <span className="text-[11px] text-slate-400">{t.signedInAs}</span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-100 truncate max-w-[200px] sm:max-w-xs">
                  {currentUser.displayName || currentUser.email}
                </h4>
                <span className="text-[11px] text-slate-400 block truncate">
                  {currentUser.email}
                </span>
              </div>
            </div>

            <button
              id="settings-signout-btn"
              onClick={onSignOut}
              className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.signOut}</span>
            </button>
          </div>
        ) : (
          <button
            id="settings-signin-btn"
            onClick={onGoogleSignIn}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-red-950/40"
          >
            <LogIn className="w-4 h-4" />
            <span>{t.signInWithGoogle}</span>
          </button>
        )}
      </div>

      {/* Behavioral Safeguards & Alerts Preferences */}
      <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <span>درع الحماية والتنبيهات الذاتية</span>
        </h3>

        <div className="space-y-3">
          {/* Subtle Audio Ticks */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800 text-amber-400">
                {profile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  صوت التكتكة الهادئ في طوارئ 90s
                </span>
                <span className="text-[11px] text-slate-400">
                  إيقاع صوتي مهدئ يساعد على التركيز في العد التنازلي
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                profile.soundEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  profile.soundEnabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Predictive Risk Window Alerts */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800 text-blue-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  تنبيه الاقتراب من نافذة الخطر
                </span>
                <span className="text-[11px] text-slate-400">
                  تنبيهك قبل ساعتك الأكثر حساسية لاتخاذ تدبير وقائي
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleRiskAlerts}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                profile.riskAlertsEnabled ? 'bg-blue-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  profile.riskAlertsEnabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Late Night Bedroom Protection */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800 text-purple-400">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  حاجز حماية الليل (بعد 11:30 م)
                </span>
                <span className="text-[11px] text-slate-400">
                  تذكير بإخراج الهاتف من غرفة النوم وشحنه بعيداً
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleNightBoundaries}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                profile.nightBoundaryAlerts ? 'bg-purple-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  profile.nightBoundaryAlerts ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>{t.language}</span>
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            id="settings-lang-ar-btn"
            onClick={() => onLanguageChange('ar')}
            className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
              language === 'ar'
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{t.arabic}</span>
            {language === 'ar' && <CheckCircle2 className="w-4 h-4 text-red-400" />}
          </button>

          <button
            id="settings-lang-en-btn"
            onClick={() => onLanguageChange('en')}
            className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
              language === 'en'
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{t.english}</span>
            {language === 'en' && <CheckCircle2 className="w-4 h-4 text-red-400" />}
          </button>
        </div>
      </div>

      {/* Data Export & Erase */}
      <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" />
          <span>{language === 'ar' ? 'النسخ الاحتياطي والبيانات' : 'Data Management'}</span>
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="settings-export-json-btn"
            onClick={handleExportJson}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ar' ? 'تصدير نسخة احتياطية (JSON)' : 'Export Backup (JSON)'}</span>
          </button>

          <button
            id="settings-clear-data-btn"
            onClick={() => setShowClearConfirm(true)}
            className="py-3 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>{t.clearData}</span>
          </button>
        </div>
      </div>

      {/* Privacy Pledge */}
      <div className="bg-[#0f121d] border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>{t.privacySection}</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {t.privacyNotice}
        </p>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#120f18] border border-red-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-950 text-red-400 border border-red-800 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-100">
              {language === 'ar' ? 'تأكيد مسح البيانات' : 'Confirm Data Erase'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.clearDataConfirm}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-slate-400 text-xs font-medium"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmClear}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition"
              >
                {language === 'ar' ? 'مسح نهائي' : 'Erase All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
