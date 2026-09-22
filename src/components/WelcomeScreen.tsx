import React from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  ChevronLeft,
  Lock,
  Flame,
  Zap,
  Clock,
  Brain,
  Link2,
  BarChart3,
  Target,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onContinueAsGuest?: () => void;
}

const ZERO_BENEFITS = [
  {
    icon: Zap,
    color: 'from-amber-500/20 to-red-500/10 text-amber-400 border-amber-500/30',
    title: 'تدخل فوري',
    desc: 'ابدأ تدخل سريع لمدة 90 ثانية ملي تحس بالاندفاع.',
  },
  {
    icon: Brain,
    color: 'from-rose-500/20 to-purple-500/10 text-rose-400 border-rose-500/30',
    title: 'فهم المحفزات',
    desc: 'اكتشف شنو كيحفزك ومتى وفين كتكون أكثر عرضة.',
  },
  {
    icon: Link2,
    color: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30',
    title: 'تحليل السلسلة',
    desc: 'شوف كيفاش كتبدأ السلسلة من أول Trigger حتى للنقطة الحرجة.',
  },
  {
    icon: BarChart3,
    color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    title: 'تتبع تقدمك الحقيقي',
    desc: 'تبع الأيام، الزلات، الانتكاسات، XP والإنجازات ديالك.',
  },
  {
    icon: Target,
    color: 'from-red-500/20 to-amber-500/10 text-red-400 border-red-500/30',
    title: 'خطط وأفعال بديلة',
    desc: 'استعمل Daily Plan وBoredom Killer باش يكون عندك بديل واضح فالحظة المناسبة.',
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onSignIn,
  onContinueAsGuest,
}) => {
  return (
    <div
      className="relative min-h-screen w-full bg-[#07080e] text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-red-500/20 selection:text-red-200 font-sans"
      dir="rtl"
    >
      {/* Cinematic Ambient Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Ruby & Crimson Ambient Glow */}
        <div
          className="absolute top-[-8%] right-[15%] w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] rounded-full bg-gradient-to-br from-red-600/15 via-rose-950/10 to-transparent blur-3xl animate-pulse"
          style={{ animationDuration: '7s' }}
        />
        {/* Subtle Dark Indigo & Cyan Rim */}
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-gradient-to-tr from-amber-600/10 via-slate-900 to-transparent blur-3xl" />
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[380px] bg-gradient-to-b from-red-500/5 to-transparent blur-2xl" />
        {/* Subtle Precision Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-red-500/30 via-slate-800 to-slate-950 border border-red-500/40 p-[1px] shadow-lg shadow-red-950/40 flex items-center justify-center">
            <Shield className="w-5 h-5 sm:w-5 sm:h-5 text-red-400 fill-red-500/10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl tracking-wider text-white uppercase">
                ZERO
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-950/80 text-red-300 border border-red-800/60 tracking-wide">
                INTERCEPTOR
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              كاسر الإلحاح السلوكي
            </p>
          </div>
        </div>

        {/* Quick Sign In Action */}
        <button
          id="btn-welcome-top-signin"
          onClick={onSignIn}
          className="text-xs sm:text-sm font-bold text-slate-300 hover:text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <span>تسجيل الدخول</span>
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        </button>
      </header>

      {/* Main Hero Container */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1 flex flex-col items-center justify-center text-center">
        {/* Badge: Momentum & Control */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-500/10 via-amber-500/10 to-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
          <span>بروتوكول التدخل السلوكي الفوري</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.25] sm:leading-[1.15] max-w-2xl mb-4 sm:mb-5"
        >
          سيطر على{' '}
          <span className="bg-gradient-to-l from-red-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
            اللحظة التالية.
          </span>
        </motion.h1>

        {/* Supporting Hook */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="text-sm sm:text-base md:text-lg text-slate-300 max-w-xl leading-relaxed mb-4 sm:mb-6 font-normal"
        >
          ZERO يساعدك توقف السلسلة قبل ما توصل للنقطة الحرجة.
        </motion.p>

        {/* Secondary Mindset Statement */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs sm:text-sm font-medium mb-8 sm:mb-10 max-w-lg leading-relaxed shadow-lg shadow-black/40"
        >
          <span className="text-slate-400 block sm:inline">ما محتاجش تربح للأبد. </span>
          <span className="text-amber-400 font-bold block sm:inline">
            ربح غير الـ 90 ثانية الجاية.
          </span>
        </motion.div>

        {/* Visual Hero: Glowing ZERO with 90s Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="relative mb-10 sm:mb-12"
        >
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-slate-900 to-[#0c0d16] border border-red-500/30 flex flex-col items-center justify-center p-3 shadow-2xl shadow-red-950/50 backdrop-blur-md">
            {/* Animated outer progress pulse ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-slate-800 fill-none"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-red-500 fill-none transition-all duration-1000"
                strokeWidth="4"
                strokeDasharray="276"
                strokeDashoffset="70"
                strokeLinecap="round"
              />
            </svg>

            {/* Glowing Center Core */}
            <div className="flex flex-col items-center justify-center z-10">
              <span className="text-3xl sm:text-4xl font-black tracking-tighter text-white">
                90s
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-red-400 tracking-wider uppercase mt-0.5">
                INTERCEPT
              </span>
            </div>

            {/* Micro Tag below */}
            <div className="absolute -bottom-3 px-3 py-0.5 rounded-full bg-slate-950 border border-red-500/40 text-[10px] font-bold text-amber-400 shadow-md">
              لحظة السيطرة
            </div>
          </div>
        </motion.div>

        {/* NEW SECTION: شنو هو ZERO؟ & Core 5 Benefits */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="w-full max-w-3xl mb-10 sm:mb-12 text-center"
        >
          {/* Section Header */}
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-950/50 border border-red-800/40 text-red-300 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              <span>دليل التطبيق السريع</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2.5">
              شنو هو ZERO؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              ZERO ماشي غير تطبيق ديال تتبع العادات.
              <br className="hidden sm:inline" />
              هو مساعد شخصي كيساعدك تتعامل مع اللحظة اللي كيكون فيها الاندفاع قوي، وتقطع السلسلة قبل ما توصل للنقطة الحرجة.
            </p>
          </div>

          {/* 5 Benefits Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-right">
            {ZERO_BENEFITS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl bg-[#0d101b]/90 border border-slate-800/90 hover:border-slate-700 transition-all duration-200 flex flex-col justify-start text-right ${
                    idx === 4 ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br border flex items-center justify-center shrink-0 ${item.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-100">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed pr-0.5">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Transition Visual Micro-line */}
          <div className="mt-8 flex flex-col items-center justify-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs sm:text-sm font-semibold text-slate-200 shadow-md">
              <span className="text-red-400 font-bold">من الرغبة</span>
              <span className="text-slate-500">←</span>
              <span className="text-emerald-400 font-bold">للسيطرة.</span>
            </div>

            {/* Behavioral Rhythm Mantra */}
            <p className="text-xs sm:text-sm font-bold text-slate-400 tracking-wide">
              لاحظ. اقطع. بدّل. تعلّم. تقدّم.
            </p>
          </div>
        </motion.section>

        {/* Primary Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="w-full max-w-md flex flex-col items-center justify-center gap-3 sm:gap-3.5 mb-6"
        >
          <div className="w-full flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4">
            {/* Primary CTA */}
            <button
              id="btn-welcome-get-started"
              onClick={onGetStarted}
              className="flex-1 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-base sm:text-lg shadow-xl shadow-red-950/60 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>ابدأ مع ZERO</span>
              <ChevronLeft className="w-5 h-5 text-red-200" />
            </button>

            {/* Secondary CTA */}
            <button
              id="btn-welcome-has-account"
              onClick={onSignIn}
              className="py-3.5 sm:py-4 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm sm:text-base border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>تسجيل الدخول</span>
            </button>
          </div>

          {/* Guest Mode Direct Access */}
          {onContinueAsGuest && (
            <button
              id="btn-welcome-guest"
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-slate-900/60"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>المتابعة مباشرة كضيف محلياً (بدون حساب)</span>
            </button>
          )}
        </motion.div>

        {/* Core Principles Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 mt-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            <span>كسر الدوبامين الزائف</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>حماية السلسلة والثبات</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>بياناتك شخصية ومخصصة لحسابك</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-[11px] sm:text-xs text-slate-500 border-t border-slate-900/80">
        <p>© {new Date().getFullYear()} ZERO — Urge Interceptor. سيطر على اللحظة التالية.</p>
      </footer>
    </div>
  );
};
