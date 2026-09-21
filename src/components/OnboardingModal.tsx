import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  ChevronLeft,
  Sun,
  Moon,
  Clock,
  Zap,
  Sparkles,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  userName?: string | null;
  onComplete: (data: {
    nickname: string;
    vulnerablePeriod: 'morning' | 'afternoon' | 'night' | 'urge_only';
  }) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  userName,
  onComplete,
}) => {
  const [nickname, setNickname] = useState(userName || '');
  const [vulnerablePeriod, setVulnerablePeriod] = useState<
    'morning' | 'afternoon' | 'night' | 'urge_only'
  >('night');

  if (!isOpen) return null;

  const handleFinish = () => {
    onComplete({
      nickname: nickname.trim() || userName || 'بطل ZERO',
      vulnerablePeriod,
    });
  };

  const periodOptions: Array<{
    id: 'morning' | 'afternoon' | 'night' | 'urge_only';
    title: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'night',
      title: 'الليل (بعد 11:00 م)',
      description: 'أوقات السهر أو التواجد بمفردك مع الهاتف قبل النوم',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
    },
    {
      id: 'afternoon',
      title: 'بعد الظهر والمساء',
      description: 'أوقات الفراغ أو الإرهاق بعد العمل والدراسة',
      icon: <Clock className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'morning',
      title: 'الصباح وبداية اليوم',
      description: 'لحظات الاستيقاظ أو التصفح العشوائي على السرير',
      icon: <Sun className="w-5 h-5 text-yellow-400" />,
    },
    {
      id: 'urge_only',
      title: 'غير وقت الإلحاح المفاجئ',
      description: 'لا يوجد وقت محدد، الحماية عند حدوث الرغبة المفاجئة',
      icon: <Zap className="w-5 h-5 text-red-400" />,
    },
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg bg-[#0c0e18] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-right overflow-hidden"
        >
          {/* Subtle Ambient Red Glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-24 bg-red-600/10 blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400 shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  تهيئة درع ZERO
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  +100 XP ترحيبي
                </span>
              </div>
              <p className="text-xs text-slate-400">
                خطوة سريعة لتخصيص الحماية والاستجابة الفورية
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Step 1: Nickname */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>كيف بغيتي تنادي راسك؟ (اختياري)</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={userName || 'مثال: كريم، أسامة، البطل...'}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition"
              />
            </div>

            {/* Step 2: Vulnerable Time */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-red-400" />
                <span>شنو أكثر وقت كتحتاج فيه ZERO؟</span>
              </label>
              <div className="space-y-2">
                {periodOptions.map((opt) => {
                  const isSelected = vulnerablePeriod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setVulnerablePeriod(opt.id)}
                      className={`w-full p-3 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-red-950/40 border-red-500/80 text-white shadow-md shadow-red-950/40'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl ${
                            isSelected ? 'bg-red-500/20' : 'bg-slate-800'
                          }`}
                        >
                          {opt.icon}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                            {opt.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Finish CTA */}
            <button
              id="btn-onboarding-finish"
              onClick={handleFinish}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm sm:text-base shadow-xl shadow-red-950/60 transition-all flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
            >
              <span>دخول ZERO وبدء السيطرة</span>
              <ChevronLeft className="w-5 h-5 text-red-200" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
