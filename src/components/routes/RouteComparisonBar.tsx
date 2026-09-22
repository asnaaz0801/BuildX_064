import React from 'react';
import { DEMO_ROUTES } from '../../data/nagpurRoutes';
import { Zap, ShieldCheck, ArrowRight, Sparkles, Navigation } from 'lucide-react';

interface RouteComparisonBarProps {
  selectedRouteId: 'fastest' | 'safer';
  onSelectRoute: (id: 'fastest' | 'safer') => void;
  onOpenWhyThisRoute: () => void;
  fastestDynamicScore: number;
  saferDynamicScore: number;
}

export const RouteComparisonBar: React.FC<RouteComparisonBarProps> = ({
  selectedRouteId,
  onSelectRoute,
  onOpenWhyThisRoute,
  fastestDynamicScore,
  saferDynamicScore,
}) => {
  const fastest = DEMO_ROUTES.fastest;
  const safer = DEMO_ROUTES.safer;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-3xl px-4 select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 1. Fastest Route Card */}
        <div
          onClick={() => onSelectRoute('fastest')}
          className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border ${
            selectedRouteId === 'fastest'
              ? 'glass-panel bg-amber-950/20 border-amber-500/50 shadow-[0_10px_30px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30'
              : 'glass-card hover:border-slate-600/60 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${
                selectedRouteId === 'fastest' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
              }`}>
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Direct Line
                </div>
                <div className="text-base font-bold text-white flex items-center gap-1.5">
                  <span>Fastest Route</span>
                  <span className="text-xs font-normal text-slate-400">({fastest.durationMin} min)</span>
                </div>
              </div>
            </div>

            {/* Safety Score Tag */}
            <div className="text-right">
              <div className="flex items-baseline justify-end">
                <span className="text-2xl font-black font-display text-amber-400">
                  {fastestDynamicScore}
                </span>
                <span className="text-[10px] font-mono text-slate-500 ml-0.5">/100</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Moderate
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-300 pt-2.5 border-t border-slate-800">
            <span className="font-mono text-slate-400">{fastest.distanceKm} km • 3 min faster</span>
            <span className="text-amber-300/90 text-[11px] truncate max-w-[180px]">
              ⚠️ 3 unlit back-alleys
            </span>
          </div>
        </div>

        {/* 2. Safer Route Card (Recommended Hero) */}
        <div
          onClick={() => onSelectRoute('safer')}
          className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border relative ${
            selectedRouteId === 'safer'
              ? 'glass-panel bg-emerald-950/25 border-emerald-400/60 shadow-[0_12px_35px_rgba(16,185,129,0.2)] ring-1 ring-emerald-400/40'
              : 'glass-card hover:border-slate-600/60 opacity-85 hover:opacity-100'
          }`}
        >
          {/* Recommended badge */}
          <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold font-mono tracking-wider shadow-md uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Recommended Route</span>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${
                selectedRouteId === 'safer' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  Verified Safe Corridor
                </div>
                <div className="text-base font-bold text-white flex items-center gap-1.5">
                  <span>Safer Route</span>
                  <span className="text-xs font-normal text-slate-400">({safer.durationMin} min)</span>
                </div>
              </div>
            </div>

            {/* Safety Score Tag */}
            <div className="text-right">
              <div className="flex items-baseline justify-end">
                <span className="text-2xl font-black font-display text-emerald-400">
                  {saferDynamicScore}
                </span>
                <span className="text-[10px] font-mono text-slate-500 ml-0.5">/100</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Lower-Risk
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-300 pt-2.5 border-t border-slate-800">
            <span className="font-mono text-slate-400">{safer.distanceKm} km • +3 min</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-300 text-[11px] font-medium truncate">
                ✓ 2 Safe Havens on path
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenWhyThisRoute();
                }}
                className="text-[10px] font-mono text-sky-400 hover:text-sky-300 underline underline-offset-2 flex items-center"
              >
                Why?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
