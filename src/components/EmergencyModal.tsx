import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Volume2,
  VolumeX,
  ShieldCheck,
  RotateCcw,
  Zap,
  Smartphone,
  DoorOpen,
  Users,
  Wind,
  Droplets,
  Activity,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { Language, InterventionLog, InterventionItem, InterventionCategory, InterventionOutcome } from '../types';
import { EMERGENCY_90S_STEPS, getAdaptiveIntervention } from '../lib/interventions';
import { TRANSLATIONS } from '../lib/translations';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSuccessUrgeInterrupted: (sessionId?: string) => void;
  interventionLogs: InterventionLog[];
  onRecordIntervention: (
    cat: InterventionCategory,
    title: string,
    success: boolean,
    outcome: InterventionOutcome
  ) => void;
  onOpenBoredomKiller?: () => void;
  initialSoundEnabled?: boolean;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  language,
  onSuccessUrgeInterrupted,
  interventionLogs,
  onRecordIntervention,
  onOpenBoredomKiller,
  initialSoundEnabled,
}) => {
  const t = TRANSLATIONS[language];
  const [secondsLeft, setSecondsLeft] = useState<number>(90);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(initialSoundEnabled ?? false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [secondIntervention, setSecondIntervention] = useState<InterventionItem | null>(null);
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [sessionId, setSessionId] = useState<string>('');

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSubtleTick = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio optional
    }
  };

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setSessionId(`emergency_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);
      setSecondsLeft(90);
      setIsActive(true);
      setCurrentStepIndex(0);
      setIsFinished(false);
      setSecondIntervention(null);
    }
  }, [isOpen]);

  // Main countdown
  useEffect(() => {
    if (!isOpen || !isActive || isFinished) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          playVictoryChime();
          return 0;
        }
        playSubtleTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isActive, isFinished, soundEnabled]);

  // Breathing pacer cycle (4s in, 4s hold, 6s out)
  useEffect(() => {
    if (!isOpen || isFinished) return;
    const currentStep = EMERGENCY_90S_STEPS[currentStepIndex];
    if (!currentStep?.isBreathing) return;

    let timeout: NodeJS.Timeout;
    const cycle = () => {
      setBreathPhase('in');
      timeout = setTimeout(() => {
        setBreathPhase('hold');
        timeout = setTimeout(() => {
          setBreathPhase('out');
          timeout = setTimeout(cycle, 6000);
        }, 4000);
      }, 4000);
    };

    cycle();
    return () => clearTimeout(timeout);
  }, [isOpen, isFinished, currentStepIndex]);

  const playVictoryChime = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#38bdf8'],
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleAdvanceStep = () => {
    if (currentStepIndex < EMERGENCY_90S_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // All steps completed
      setIsFinished(true);
      playVictoryChime();
    }
  };

  const handleDidntAct = () => {
    onSuccessUrgeInterrupted(sessionId);
    onRecordIntervention('emergency_90s', '90-Second Reset Protocol', true, 'succeeded');
    onClose();
  };

  const handleStillFeelUrge = () => {
    const nextInt = getAdaptiveIntervention(interventionLogs);
    setSecondIntervention(nextInt);
    setSecondsLeft(nextInt.durationSeconds);
    setIsFinished(false);
    setIsActive(true);
  };

  const handleCompleteSecondIntervention = () => {
    if (secondIntervention) {
      onRecordIntervention(
        secondIntervention.category,
        secondIntervention.titleEn,
        true,
        'succeeded'
      );
    }
    onSuccessUrgeInterrupted(sessionId);
    onClose();
  };

  const handleLaunchBoredomMission = () => {
    onSuccessUrgeInterrupted(sessionId);
    onRecordIntervention('emergency_90s', '90-Second Reset -> Boredom Mission', true, 'succeeded');
    onClose();
    if (onOpenBoredomKiller) {
      onOpenBoredomKiller();
    }
  };

  if (!isOpen) return null;

  const currentStep = EMERGENCY_90S_STEPS[currentStepIndex] || EMERGENCY_90S_STEPS[0];
  const progressPercent = secondIntervention
    ? ((secondIntervention.durationSeconds - secondsLeft) / secondIntervention.durationSeconds) * 100
    : ((90 - secondsLeft) / 90) * 100;

  const renderIcon = (name: string) => {
    switch (name) {
      case 'SmartphoneOff':
        return <Smartphone className="w-8 h-8 text-red-400" />;
      case 'DoorOpen':
        return <DoorOpen className="w-8 h-8 text-amber-400" />;
      case 'Users':
        return <Users className="w-8 h-8 text-blue-400" />;
      case 'Wind':
        return <Wind className="w-8 h-8 text-cyan-400" />;
      case 'GlassWater':
        return <Droplets className="w-8 h-8 text-sky-400" />;
      case 'Activity':
        return <Activity className="w-8 h-8 text-emerald-400" />;
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-purple-400" />;
      case 'Zap':
        return <Zap className="w-8 h-8 text-amber-400" />;
      default:
        return <ShieldCheck className="w-8 h-8 text-amber-400" />;
    }
  };

  return (
    <div
      id="emergency-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-3 sm:p-6 overflow-y-auto"
    >
      <div
        id="emergency-modal-card"
        className="relative w-full max-w-lg bg-[#0c0f17] border border-red-900/60 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-red-950/40 flex flex-col items-center text-center"
      >
        {/* Top Controls */}
        <div className="w-full flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-300 text-xs font-bold tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              {secondIntervention
                ? language === 'ar'
                  ? 'تدخل تكيفي ثانٍ'
                  : 'SECONDARY INTERVENTION'
                : language === 'ar'
                ? 'بروتوكول الـ 90 ثانية'
                : '90-SECOND PROTOCOL'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="emergency-sound-toggle-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
              title={soundEnabled ? 'Mute' : 'Subtle Tick'}
              aria-label="Toggle sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
            <button
              id="emergency-close-btn"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Close"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Phase 5 Core Directive Banner */}
        <div className="w-full bg-red-950/50 border border-red-800/50 rounded-2xl p-3.5 mb-4 text-start">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-red-900/60 text-red-300 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-red-200 tracking-wide uppercase">
                {language === 'ar' ? '🚨 تحرّك الآن — لا تفاوض نفسك' : '🚨 MOVE NOW — DO NOT NEGOTIATE'}
              </h4>
              <p className="text-xs text-red-300/80 mt-0.5 leading-relaxed">
                {language === 'ar'
                  ? 'غيّر الموقف المادي أولاً واقطع السلسلة. لا تفكر في المستقبل البعيد، انتصر في هذه الـ 90 ثانية فقط.'
                  : 'Change your physical situation first. Don’t fight the whole future, win the next 90 seconds.'}
              </p>
            </div>
          </div>
        </div>

        {/* Circular Countdown Timer */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 my-1 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-slate-900"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-red-500 transition-all duration-1000 ease-linear"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono">
              {secondsLeft}
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-red-400/90 font-semibold mt-1">
              {t.secondsRemaining}
            </span>
          </div>
        </div>

        {/* Step Progress Tracker */}
        {!isFinished && !secondIntervention && (
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mt-2 mb-3 px-1">
            <span className="font-semibold text-slate-300">
              {language === 'ar'
                ? `الخطوة ${currentStepIndex + 1} من ${EMERGENCY_90S_STEPS.length}`
                : `Step ${currentStepIndex + 1} of ${EMERGENCY_90S_STEPS.length}`}
            </span>
            <div className="flex items-center gap-1">
              {EMERGENCY_90S_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentStepIndex
                      ? 'w-6 bg-red-500'
                      : i < currentStepIndex
                      ? 'w-2.5 bg-emerald-500'
                      : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step Content: Single Instruction & Action */}
        {!isFinished && !secondIntervention && (
          <div className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center min-h-[160px]">
            <div className="mb-2.5 p-3 rounded-2xl bg-slate-800/90 border border-slate-700/60 shadow-inner">
              {renderIcon(currentStep.icon)}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-1 tracking-tight">
              {language === 'ar' ? currentStep.titleAr : currentStep.titleEn}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed mb-3">
              {language === 'ar' ? currentStep.descAr : currentStep.descEn}
            </p>

            {/* Breathing Visualizer */}
            {currentStep.isBreathing && (
              <div className="my-3 flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-1000 ${
                    breathPhase === 'in'
                      ? 'scale-125 border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-lg shadow-cyan-500/20'
                      : breathPhase === 'hold'
                      ? 'scale-125 border-amber-400 bg-amber-950/40 text-amber-300'
                      : 'scale-90 border-slate-600 bg-slate-900 text-slate-400'
                  }`}
                >
                  <span className="text-[11px] font-bold">
                    {breathPhase === 'in'
                      ? language === 'ar'
                        ? 'شهيق'
                        : 'Inhale'
                      : breathPhase === 'hold'
                      ? language === 'ar'
                        ? 'حبس'
                        : 'Hold'
                      : language === 'ar'
                      ? 'زفير'
                      : 'Exhale'}
                  </span>
                </div>
                <span className="text-[11px] text-cyan-400 mt-2 font-medium">
                  {breathPhase === 'in'
                    ? t.breatheIn
                    : breathPhase === 'hold'
                    ? t.breatheHold
                    : t.breatheOut}
                </span>
              </div>
            )}

            {/* Phase 5 & 6 Forward Action Button */}
            <button
              id={`emergency-step-done-btn-${currentStepIndex}`}
              onClick={handleAdvanceStep}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-[0.98] text-white font-bold text-sm transition shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {currentStepIndex === EMERGENCY_90S_STEPS.length - 1
                  ? language === 'ar'
                    ? '✓ إنهاء البروتوكول'
                    : '✓ Finish Protocol'
                  : language === 'ar'
                  ? '✓ تم التنفيذ — الخطوة التالية'
                  : '✓ Done — Next Step'}
              </span>
              {language === 'ar' ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        )}

        {/* Second Adaptive Intervention View */}
        {!isFinished && secondIntervention && (
          <div className="w-full bg-slate-900/80 border border-amber-800/40 rounded-2xl p-5 flex flex-col items-center justify-center">
            <div className="mb-3 p-3 rounded-2xl bg-amber-950/40 border border-amber-700/50">
              <RotateCcw className="w-7 h-7 text-amber-400" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-amber-300 mb-1.5">
              {language === 'ar' ? secondIntervention.titleAr : secondIntervention.titleEn}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed mb-4">
              {language === 'ar'
                ? secondIntervention.instructionAr
                : secondIntervention.instructionEn}
            </p>

            <button
              id="emergency-complete-second-btn"
              onClick={handleCompleteSecondIntervention}
              className="w-full py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 min-h-[44px]"
            >
              {language === 'ar'
                ? secondIntervention.actionTextAr
                : secondIntervention.actionTextEn}
            </button>
          </div>
        )}

        {/* End of 90s Assessment Options */}
        {isFinished && (
          <div className="w-full mt-3 flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-1" />
              <h4 className="text-base sm:text-lg font-bold text-slate-100">
                {t.endOfEmergencyTitle}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ar'
                  ? 'لقد قطعت الاندفاع الأولي واستعدت السيطرة على اللحظة الحاضرة.'
                  : 'You broke the initial surge and reclaimed present control.'}
              </p>
            </div>

            {/* I Interrupted the Urge */}
            <button
              id="emergency-didnt-act-btn"
              onClick={handleDidntAct}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm sm:text-base transition shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{t.didntAct}</span>
            </button>

            {/* Urge Still Strong -> Second Adaptive Intervention */}
            <button
              id="emergency-still-urge-btn"
              onClick={handleStillFeelUrge}
              className="w-full py-3 px-4 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 active:scale-[0.98] border border-amber-700/60 text-amber-300 font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>{t.stillFeelUrge}</span>
            </button>

            {/* Start Safe Boredom Killer Activity */}
            <button
              id="emergency-another-btn"
              onClick={handleLaunchBoredomMission}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition min-h-[44px] flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.needAnother}</span>
            </button>
          </div>
        )}

        {/* Pause/Resume button if active */}
        {!isFinished && (
          <button
            id="emergency-pause-toggle-btn"
            onClick={() => setIsActive(!isActive)}
            className="mt-3 text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition py-1"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              {isActive
                ? language === 'ar'
                  ? 'إيقاف مؤقت'
                  : 'Pause'
                : language === 'ar'
                ? 'استئناف'
                : 'Resume'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
