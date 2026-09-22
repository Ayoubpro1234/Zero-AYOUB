import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  X,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { googleSignIn, isPopupBlockedError, formatAuthError } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, token: string | null) => void;
  onContinueAsGuest?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  onContinueAsGuest,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await googleSignIn();
      if (result?.user) {
        onAuthSuccess(result.user, result.accessToken || null);
        onClose();
      } else {
        setErrorMessage('تم إلغاء تسجيل الدخول.');
      }
    } catch (err: unknown) {
      console.error('Google Sign In Error:', err);
      if (isPopupBlockedError(err)) {
        setErrorMessage('تم حظر النافذة المنبثقة بواسطة المتصفح. يرجى السماح بالنوافذ المنبثقة ثم المحاولة ثانية.');
      } else {
        setErrorMessage(formatAuthError(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestClick = () => {
    if (onContinueAsGuest) {
      onContinueAsGuest();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        dir="rtl"
      >
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-[#0c0e18] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-center overflow-hidden"
        >
          {/* Subtle Ambient Red Glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-24 bg-red-600/10 blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            id="btn-auth-close"
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 left-4 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition disabled:opacity-50"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ZERO Emblem */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 via-slate-800 to-slate-900 border border-red-500/30 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-950/40">
            <Shield className="w-7 h-7 text-red-400 fill-red-500/10" />
          </div>

          {/* Titles */}
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            مرحبا بك في ZERO
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto mb-6 leading-relaxed">
            دخل لحسابك باش تبقى بياناتك وتقدمك محفوظين.
          </p>

          {/* Error Banner with Instant Guest Bypass */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 mb-5 rounded-2xl bg-red-950/60 border border-red-800/60 text-red-200 text-xs font-medium flex flex-col gap-2.5 text-right"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed flex-1">{errorMessage}</div>
              </div>
              {onContinueAsGuest && (
                <button
                  type="button"
                  onClick={handleGuestClick}
                  className="w-full py-2 px-3 rounded-xl bg-red-900/60 hover:bg-red-800/80 border border-red-700/60 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تخطي المشكلة والدخول كضيف محلياً الآن</span>
                </button>
              )}
            </motion.div>
          )}

          {/* Google Sign-In Button */}
          <button
            id="btn-auth-google-submit"
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full py-3.5 sm:py-4 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group mb-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                <span className="font-semibold text-slate-800">جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                {/* Official Google 4-Color SVG Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>المتابعة باستخدام Google</span>
              </>
            )}
          </button>

          {/* Guest / Offline Mode Option */}
          {onContinueAsGuest && (
            <button
              id="btn-auth-guest-mode"
              type="button"
              onClick={handleGuestClick}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm border border-slate-800 transition mb-4 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>المتابعة كضيف محلياً (بدون حساب)</span>
            </button>
          )}

          {/* Privacy & Reassurance */}
          <div className="pt-2 border-t border-slate-900/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>بياناتك شخصية ومخصصة لجهازك وحسابك.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
