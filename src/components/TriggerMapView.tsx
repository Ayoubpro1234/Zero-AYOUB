import React from 'react';
import {
  BarChart3,
  Flame,
  Clock,
  MapPin,
  Activity,
  Zap,
  Info,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import { computeAnalytics } from '../lib/storage';
import {
  TRANSLATIONS,
  TRIGGER_TRANSLATIONS,
  LOCATION_TRANSLATIONS,
  BEFORE_EVENT_TRANSLATIONS,
} from '../lib/translations';

interface TriggerMapViewProps {
  language: Language;
}

export const TriggerMapView: React.FC<TriggerMapViewProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const analytics = computeAnalytics();

  const getTriggerLabel = (trig: string) => {
    if (trig === 'none' || !analytics.hasEnoughData)
      return language === 'ar' ? 'لا توجد بيانات كافية' : 'Insufficient data';
    return (
      TRIGGER_TRANSLATIONS[trig as keyof typeof TRIGGER_TRANSLATIONS]?.[language] || trig
    );
  };

  const getLocationLabel = (loc: string) => {
    if (loc === 'none' || !analytics.hasEnoughData)
      return language === 'ar' ? 'غير محدد بعد' : 'Unspecified';
    return (
      LOCATION_TRANSLATIONS[loc as keyof typeof LOCATION_TRANSLATIONS]?.[language] || loc
    );
  };

  const getBeforeLabel = (act: string) => {
    if (act === 'none' || !analytics.hasEnoughData)
      return language === 'ar' ? 'غير محدد بعد' : 'Unspecified';
    return (
      BEFORE_EVENT_TRANSLATIONS[act as keyof typeof BEFORE_EVENT_TRANSLATIONS]?.[language] || act
    );
  };

  const maxHourValue = Math.max(...analytics.hourlyDistribution, 1);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              {t.analyticsTitle}
            </h2>
            <p className="text-xs text-slate-400">{t.analyticsSub}</p>
          </div>
        </div>
      </div>

      {/* Empty State Banner if no data */}
      {!analytics.hasEnoughData && (
        <div className="p-5 rounded-3xl bg-[#0f121e] border border-slate-800 flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-200">
              {language === 'ar' ? 'مازال ماعندناش بيانات كافية.' : 'No data yet.'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'ابدأ بتسجيل أول تدخل باش نبداو نتعلمو من النمط ديالك ونكشفو أوقات الخطر والمحفزات الحقيقية.'
                : 'Start logging your real interventions so ZERO can identify your pattern, vulnerable hours, and primary triggers.'}
            </p>
          </div>
        </div>
      )}

      {/* Hero Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Top Trigger */}
        <div className="bg-[#10131e] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-semibold">{t.mostCommonTrigger}</span>
            <Activity className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-sm sm:text-base font-bold text-slate-100 truncate">
            {getTriggerLabel(analytics.mostCommonTrigger)}
          </span>
          <span className="text-[10px] text-slate-500 mt-1">{t.personalHistoryLabel}</span>
        </div>

        {/* Highest Risk Time */}
        <div className="bg-[#10131e] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-semibold">{t.mostDangerousTime}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-sm sm:text-base font-bold text-amber-400 font-mono">
            {analytics.hasEnoughData
              ? `${analytics.mostDangerousHour}:00 - ${(analytics.mostDangerousHour + 1) % 24}:00`
              : language === 'ar'
              ? 'غير متوفر بعد'
              : 'Unavailable yet'}
          </span>
          <span className="text-[10px] text-slate-500 mt-1">{t.personalHistoryLabel}</span>
        </div>

        {/* Most Common Location */}
        <div className="bg-[#10131e] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-semibold">{t.mostCommonLocation}</span>
            <MapPin className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-sm sm:text-base font-bold text-slate-100 truncate">
            {getLocationLabel(analytics.mostCommonLocation)}
          </span>
          <span className="text-[10px] text-slate-500 mt-1">{t.personalHistoryLabel}</span>
        </div>

        {/* Average Intensity */}
        <div className="bg-[#10131e] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-semibold">{t.averageIntensity}</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-1">
            {analytics.totalLogged > 0 ? (
              <>
                <span className="text-xl sm:text-2xl font-black text-slate-100 font-mono">
                  {analytics.averageIntensity}
                </span>
                <span className="text-xs text-slate-500">/ 10</span>
              </>
            ) : (
              <span className="text-sm font-bold text-slate-400">
                {language === 'ar' ? 'معطيات غير متوفرة' : 'Unavailable'}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 mt-1">{t.personalHistoryLabel}</span>
        </div>
      </div>

      {/* Proactive Risk Window Notice if upcoming */}
      {analytics.isUpcomingRiskWindow && (
        <div className="bg-gradient-to-r from-amber-950/60 to-red-950/40 border border-amber-600/50 rounded-2xl p-4 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-amber-200">
              {t.upcomingRiskTitle}
            </h4>
            <p className="text-xs text-amber-300/80 mt-0.5 leading-relaxed">
              {t.upcomingRiskDesc} ({analytics.upcomingRiskHour}:00).
            </p>
          </div>
        </div>
      )}

      {/* 24-Hour Urge Timeline Chart */}
      <div className="bg-[#10131e] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              {language === 'ar' ? 'توزيع الرغبات على مدار اليوم (24 ساعة)' : '24-Hour Urge Timeline'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'ar' ? 'يكشف الساعات الأكثر خطورة لتعزيز دفاعاتك قبلها' : 'Identifies high-risk windows to reinforce boundaries'}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {analytics.totalLogged} {language === 'ar' ? 'سجلات' : 'logs'}
          </span>
        </div>

        {/* Bar chart over 24 hours */}
        <div className="h-40 flex items-end gap-1 sm:gap-1.5 pt-6 pb-2 border-b border-slate-800">
          {analytics.hourlyDistribution.map((count, hour) => {
            const heightPercent =
              analytics.totalLogged === 0 ? 4 : Math.max(4, Math.round((count / maxHourValue) * 100));
            const isVulnerable = analytics.hasEnoughData && hour === analytics.mostDangerousHour && count > 0;
            const isCurrent = hour === new Date().getHours();

            return (
              <div
                key={hour}
                className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
              >
                {/* Tooltip */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 border border-slate-700 text-slate-200 text-[10px] px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-10 font-mono">
                  {hour}:00 - {count} {language === 'ar' ? 'سجل' : 'events'}
                </div>

                <div
                  className={`w-full rounded-t transition-all duration-500 ${
                    isVulnerable
                      ? 'bg-rose-500 shadow-md shadow-rose-950'
                      : count > 0
                      ? 'bg-amber-500/80'
                      : isCurrent
                      ? 'bg-slate-700/60'
                      : 'bg-slate-800/40'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Hour markers */}
        <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 px-1">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:00</span>
        </div>
      </div>

      {/* Intervention Strategy Effectiveness */}
      <div className="bg-[#10131e] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100">
            {language === 'ar' ? 'فعالية الاستراتيجيات التدخلية' : 'Intervention Strategy Effectiveness'}
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'ar' ? 'معدل نجاح كل تقنية في قطع التسلسل' : 'Success rate of each strategy in stopping the chain'}
          </p>
        </div>

        <div className="space-y-3">
          {Object.keys(analytics.categoryEffectiveness).length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-500">
              {language === 'ar'
                ? 'لا توجد بيانات تدخلات كافية حتى الآن. نفذ أول بروتوكول لرؤية فعالية التقنيات.'
                : 'No intervention history yet. Complete your first rescue protocol to evaluate methods.'}
            </div>
          ) : (
            Object.entries(analytics.categoryEffectiveness).map(([cat, stat]) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span className="capitalize">{cat}</span>
                  <span className="font-mono text-emerald-400">{stat.rate}% ({stat.success}/{stat.total})</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${stat.rate}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
