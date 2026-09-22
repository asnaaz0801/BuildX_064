import React, { useState, useEffect } from 'react';
import { SafetyScoreRadial } from './SafetyScoreRadial';
import { SafetyFactorBreakdown } from '../../types/safety';
import { ShieldCheck, ChevronRight, ChevronLeft, Eye, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

interface SafetyIntelligenceHUDProps {
  currentArea: string;
  safetyScore: number;
  safetyTier: 'lower-risk' | 'moderate' | 'elevated';
  factors: SafetyFactorBreakdown;
  isScanning: boolean;
  scanStep: string;
  riskSignalCount: number;
  positiveSignalCount: number;
  advisoryNote: string;
  onOpenWhyThisRoute?: () => void;
  selectedRouteId: 'fastest' | 'safer';
}

export const SafetyIntelligenceHUD: React.FC<SafetyIntelligenceHUDProps> = ({
  currentArea,
  safetyScore,
  safetyTier,
  factors,
  isScanning,
  scanStep,
  riskSignalCount,
  positiveSignalCount,
  advisoryNote,
  onOpenWhyThisRoute,
  selectedRouteId,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div 
      className={`fixed top-20 right-4 z-20 transition-all duration-300 ${
        isCollapsed ? 'translate-x-[calc(100%-40px)]' : 'translate-x-0'
      } max-w-sm w-full select-none`}
    >
      {/* Container with Glass Panel */}
      <div className="relative glass-panel rounded-2xl p-5 shadow-2xl border border-white/10 text-slate-100 backdrop-blur-xl">
        {/* Collapse toggle tab */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-9 top-6 w-9 h-10 rounded-l-xl bg-slate-900/90 border-l border-y border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors shadow-lg"
          title={isCollapsed ? "Expand HUD" : "Collapse HUD"}
        >
          {isCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        {/* Header telemetry */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                AI Command Center
              </div>
              <div className="text-xs font-bold text-white tracking-wide">
                SAFETY INTELLIGENCE
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ANALYSIS ACTIVE</span>
          </div>
        </div>

        {/* Dynamic Scanning State Banner */}
        {isScanning ? (
          <div className="mb-4 p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <div className="text-xs font-mono text-sky-200 tracking-wide font-semibold animate-pulse">
              {scanStep}
            </div>
          </div>
        ) : (
          /* Area & Signal Counters */
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Current Area</div>
              <div className="text-xs font-bold text-slate-100 truncate mt-0.5">{currentArea}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-center">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-rose-400 flex items-center gap-0.5">
                  ↓ {riskSignalCount} risks
                </span>
                <span className="text-emerald-400 flex items-center gap-0.5">
                  ↑ {positiveSignalCount} safe
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Radial Score & Factor Telemetry */}
        <SafetyScoreRadial
          score={safetyScore}
          tier={safetyTier}
          factors={factors}
          label={selectedRouteId === 'safer' ? 'SAFER ROUTE SIGNAL' : 'FASTEST ROUTE SIGNAL'}
        />

        {/* "Why this route?" Quick Inspector Trigger */}
        <button
          onClick={onOpenWhyThisRoute}
          className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition-all transform active:scale-98 group"
        >
          <Sparkles className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform" />
          <span>Why this route? (Analysis Mode)</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Legal / Ethics Safety Advisory Notice */}
        <div className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-slate-950/40 border border-white/5 text-[10px] text-slate-400 leading-relaxed font-sans">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>{advisoryNote}</span>
        </div>
      </div>
    </div>
  );
};
