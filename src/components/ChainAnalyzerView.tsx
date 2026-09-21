import React, { useState } from 'react';
import {
  GitCommitHorizontal,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Smartphone,
  Search,
  Eye,
  Activity,
  Info,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS, BEFORE_EVENT_TRANSLATIONS, LOCATION_TRANSLATIONS } from '../lib/translations';
import { computeAnalytics, loadTriggers } from '../lib/storage';

interface ChainAnalyzerViewProps {
  language: Language;
  onOpenEmergency: () => void;
  onOpenAntiSearch: () => void;
}

export const ChainAnalyzerView: React.FC<ChainAnalyzerViewProps> = ({
  language,
  onOpenEmergency,
  onOpenAntiSearch,
}) => {
  const t = TRANSLATIONS[language];
  const [activeStage, setActiveStage] = useState<number>(0);
  const analytics = computeAnalytics();
  const triggerLogs = loadTriggers();

  const getBeforeLabel = (act: string) => {
    if (act === 'none') return language === 'ar' ? 'الوحدة والفراغ' : 'Isolation & boredom';
    return (
      BEFORE_EVENT_TRANSLATIONS[act as keyof typeof BEFORE_EVENT_TRANSLATIONS]?.[language] || act
    );
  };

  const getLocationLabel = (loc: string) => {
    if (loc === 'none') return language === 'ar' ? 'غرفة النوم' : 'Bedroom';
    return (
      LOCATION_TRANSLATIONS[loc as keyof typeof LOCATION_TRANSLATIONS]?.[language] || loc
    );
  };

  const chainNodes = [
    {
      stage: 1,
      titleAr: '1. الفراغ والملل أو العزلة',
      titleEn: '1. Boredom / Loneliness / Void',
      subtitleAr: 'حالة فراغ ذهني أو عزلة تسبق الرغبة التلقائية',
      subtitleEn: 'Unstructured downtime or isolation preceding automatic urges',
      icon: Activity,
      riskLevel: 'LOW',
      effortToStopAr: 'تدخل مبكر (جهد منخفض جداً)',
      effortToStopEn: 'Early intervention (Very low effort)',
      interceptStrategyAr: 'الحل الفوري: مهمة من قاتل الملل، شرب ماء بارد، خروج للهواء، حركة بدنية خفيفة.',
      interceptStrategyEn: 'Immediate Tactic: Boredom Killer mission, hydration, step outside, light movement.',
      isEarliestExit: true,
      color: 'emerald',
    },
    {
      stage: 2,
      titleAr: '2. التقاط الهاتف دون غاية محددة',
      titleEn: '2. Picking up Phone Aimlessly',
      subtitleAr: 'استجابة تلقائية ميكانيكية للهروب من الفراغ',
      subtitleEn: 'Automatic reflex to reach for screen to escape quiet moments',
      icon: Smartphone,
      riskLevel: 'MODERATE',
      effortToStopAr: 'تدخل مبكر (جهد منخفض)',
      effortToStopEn: 'Early intervention (Low effort)',
      interceptStrategyAr: 'الحل الفوري: وضع الهاتف في غرفة أخرى، وضعه على الشاحن بعيداً، الجلوس مع الآخرين.',
      interceptStrategyEn: 'Immediate Tactic: Place phone in another room or onto charger, relocate near people.',
      isEarliestExit: true,
      color: 'emerald',
    },
    {
      stage: 3,
      titleAr: '3. التمرير العشوائي في التطبيقات',
      titleEn: '3. Aimless App Scrolling',
      subtitleAr: 'تصفح سريع غير مقصود يعرض العين لمنبهات بصرية مفاجئة',
      subtitleEn: 'Rapid passive feeds exposing attention to unexpected cues',
      icon: Eye,
      riskLevel: 'ELEVATED',
      effortToStopAr: 'تدخل متوسط (يتطلب وعياً إرادياً)',
      effortToStopEn: 'Moderate effort (Requires intentional pause)',
      interceptStrategyAr: 'الحل الفوري: إغلاق التطبيق فوراً، وقوف ومغادرة المقعد، غسيل الوجه بالماء.',
      interceptStrategyEn: 'Immediate Tactic: Exit app immediately, stand up, splash cold water.',
      isEarliestExit: false,
      color: 'amber',
    },
    {
      stage: 4,
      titleAr: '4. ظهور محفز بصري أو سياقي',
      titleEn: '4. Suggestive Trigger / Cue',
      subtitleAr: 'ملاحظة صورة أو فكرة تركز الانتباه وتثير الرغبة',
      subtitleEn: 'Noticing a cue that captures attention and sparks an impulse',
      icon: AlertTriangle,
      riskLevel: 'HIGH',
      effortToStopAr: 'تدخل حاسم (يتطلب تغييراً فورياً للمكان)',
      effortToStopEn: 'Decisive effort (Requires immediate environment shift)',
      interceptStrategyAr: 'الحل الفوري: إطلاق بروتوكول الـ 90 ثانية فوراً! ضع الهاتف بعيداً واخرج من الغرفة.',
      interceptStrategyEn: 'Immediate Tactic: Launch 90s Protocol NOW! Drop phone and leave room.',
      isEarliestExit: false,
      color: 'orange',
    },
    {
      stage: 5,
      titleAr: '5. فتح محرك البحث أو التفتيش',
      titleEn: '5. Opening Search Bar (High-Risk)',
      subtitleAr: 'البحث اليدوي المتعمّد (الوصول لأخطر مراحل الانزلاق)',
      subtitleEn: 'Active searching and browsing queries (late-stage high risk)',
      icon: Search,
      riskLevel: 'CRITICAL',
      effortToStopAr: 'مرحلة حرجة (توقف فوري دون تردد)',
      effortToStopEn: 'Critical stage (Immediate stop without debate)',
      interceptStrategyAr: 'الحل الفوري: وضع "مكافحة البحث" (ANTI-SEARCH). إغلاق المتصفح تماماً وتغيير المكان.',
      interceptStrategyEn: 'Immediate Tactic: ANTI-SEARCH Mode. Slam browser shut and leave room immediately.',
      isEarliestExit: false,
      color: 'red',
    },
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <GitCommitHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              {t.chainTitle}
            </h2>
            <p className="text-xs text-slate-400">{t.chainSub}</p>
          </div>
        </div>
      </div>

      {/* Personal Data-Driven Insight Card */}
      <div className="bg-[#10131e] border border-emerald-700/40 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>{language === 'ar' ? 'أقوى نقطة خروج مسجلة لديك' : 'Your Personal Early Exit Point'}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 font-mono">
            {t.personalHistoryLabel}
          </span>
        </div>

        {triggerLogs.length >= 2 ? (
          <div className="space-y-2 text-xs sm:text-sm text-slate-200">
            <p className="leading-relaxed">
              {language === 'ar' ? (
                <>
                  تُظهر بياناتك المسجلة أن أبكر نقطة تتكرر قبل الإلحاح هي:{' '}
                  <span className="font-bold text-amber-400">{getBeforeLabel(analytics.mostCommonBeforeEvent)}</span>{' '}
                  في مكان: <span className="font-bold text-amber-400">{getLocationLabel(analytics.mostCommonLocation)}</span>.
                </>
              ) : (
                <>
                  Based on your recorded events, your earliest repeated exit point is:{' '}
                  <span className="font-bold text-amber-400">{getBeforeLabel(analytics.mostCommonBeforeEvent)}</span>{' '}
                  at <span className="font-bold text-amber-400">{getLocationLabel(analytics.mostCommonLocation)}</span>.
                </>
              )}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'القطع عند مرحلة (الملل / التقاط الهاتف) يتطلب جهداً إرادياً بسيطاً، مقارنة بالانتظار حتى ظهور محفز بصري أو بدء البحث.'
                : 'Intervening at Stage 1 or 2 (boredom / picking up the phone) takes minimal effort compared to stopping once searching has begun.'}
            </p>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.earlyExitDesc}
          </p>
        )}
      </div>

      {/* Chain Vertical Interactive Stack */}
      <div className="space-y-3">
        {chainNodes.map((node, index) => {
          const Icon = node.icon;
          const isSelected = activeStage === index;
          const isExit = node.isEarliestExit;

          return (
            <div key={node.stage} className="relative">
              {/* Connector line */}
              {index < chainNodes.length - 1 && (
                <div className="absolute left-6 rtl:right-6 rtl:left-auto -bottom-4 w-0.5 h-4 bg-slate-800 z-0" />
              )}

              <div
                id={`chain-node-${node.stage}`}
                onClick={() => setActiveStage(index)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 relative z-10 ${
                  isSelected
                    ? 'bg-[#121624] border-amber-500/80 shadow-lg shadow-amber-950/20 scale-[1.01]'
                    : isExit
                    ? 'bg-[#0e131d] border-emerald-900/50 hover:border-emerald-700/60'
                    : 'bg-[#0f111a] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        node.color === 'emerald'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                          : node.color === 'amber'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800'
                          : node.color === 'orange'
                          ? 'bg-orange-950/60 text-orange-400 border border-orange-800'
                          : 'bg-red-950/80 text-red-400 border border-red-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-slate-100">
                          {language === 'ar' ? node.titleAr : node.titleEn}
                        </h4>
                        {isExit && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold">
                            {language === 'ar' ? 'أفضل نقطة تدخل' : 'Optimal Exit'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {language === 'ar' ? node.subtitleAr : node.subtitleEn}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      node.riskLevel === 'LOW'
                        ? 'bg-emerald-950 text-emerald-400'
                        : node.riskLevel === 'MODERATE'
                        ? 'bg-blue-950 text-blue-400'
                        : node.riskLevel === 'ELEVATED'
                        ? 'bg-amber-950 text-amber-400'
                        : node.riskLevel === 'HIGH'
                        ? 'bg-orange-950 text-orange-400'
                        : 'bg-red-950 text-red-400'
                    }`}
                  >
                    {node.riskLevel}
                  </span>
                </div>

                {/* Expanded Details on Active */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">
                        {language === 'ar' ? 'طبيعة التدخل المطلوبة:' : 'Intervention level:'}
                      </span>
                      <span className="font-bold text-amber-400 font-mono">
                        {language === 'ar' ? node.effortToStopAr : node.effortToStopEn}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200">
                      <span className="font-bold text-emerald-400 block mb-1">
                        {language === 'ar' ? 'التكتيك المعاكس الموصى به:' : 'Counter-Tactic:'}
                      </span>
                      {language === 'ar' ? node.interceptStrategyAr : node.interceptStrategyEn}
                    </div>

                    {node.stage === 4 && (
                      <button
                        id="chain-launch-emergency-btn"
                        onClick={onOpenEmergency}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-red-950/40 min-h-[44px]"
                      >
                        <Zap className="w-4 h-4" />
                        <span>{language === 'ar' ? 'تفعيل وضع الطوارئ 90s الآن' : 'Trigger 90s Emergency Now'}</span>
                      </button>
                    )}

                    {node.stage === 5 && (
                      <button
                        id="chain-launch-antisearch-btn"
                        onClick={onOpenAntiSearch}
                        className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-red-950/40 min-h-[44px]"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>{language === 'ar' ? 'تفعيل وضع مكافحة البحث الآن' : 'Trigger Anti-Search Mode Now'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Behavioral Explanation footer */}
      <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-2.5 text-[11px] text-slate-400">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <span>
          {language === 'ar'
            ? 'تنبيه: هذا المخطط يمثل نموذجاً سلوكياً لمساعدتك على ملاحظة مراحل الانزلاق مبكراً، وليس تشخيصاً طبياً أو عصبياً.'
            : 'Notice: This diagram models behavioral habits to help you notice early warning signs, not a medical or neurological diagnosis.'}
        </span>
      </div>
    </div>
  );
};
