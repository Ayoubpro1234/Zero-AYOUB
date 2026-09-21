import React from 'react';
import {
  Home,
  AlertTriangle,
  BarChart3,
  GitCommitHorizontal,
  CalendarCheck,
  Sparkles,
  Award,
  Settings,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../lib/translations';

export type TabType =
  | 'home'
  | 'emergency'
  | 'map'
  | 'chain'
  | 'plan'
  | 'boredom'
  | 'progress'
  | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const items = [
    { id: 'home' as TabType, label: t.navHome, icon: Home },
    { id: 'emergency' as TabType, label: t.navEmergency, icon: AlertTriangle, highlight: true },
    { id: 'map' as TabType, label: t.navTriggerMap, icon: BarChart3 },
    { id: 'chain' as TabType, label: t.navChain, icon: GitCommitHorizontal },
    { id: 'plan' as TabType, label: t.navDailyPlan, icon: CalendarCheck },
    { id: 'boredom' as TabType, label: t.navBoredomKiller, icon: Sparkles },
    { id: 'progress' as TabType, label: t.navProgress, icon: Award },
    { id: 'settings' as TabType, label: t.navSettings, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0c14]/95 backdrop-blur-lg border-t border-slate-800/90 px-1 py-1 sm:py-1.5 shadow-2xl safe-area-pb">
      <div className="max-w-4xl mx-auto flex items-center justify-around gap-0.5 overflow-x-auto no-scrollbar touch-pan-x">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[46px] sm:min-w-[62px] min-h-[46px] py-1 px-1 rounded-xl transition-all duration-150 touch-manipulation active:scale-95 ${
                isActive
                  ? item.highlight
                    ? 'text-red-400 bg-red-950/50 border border-red-700/50 font-bold'
                    : 'text-amber-400 bg-amber-950/40 border border-amber-600/40 font-bold'
                  : item.highlight
                  ? 'text-red-400/80 hover:text-red-300 hover:bg-slate-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] sm:text-[11px] mt-0.5 whitespace-nowrap leading-tight tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
