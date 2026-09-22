import React from 'react';
import { TIME_PROFILES } from '../../hooks/useSafetySimulation';
import { Clock, Moon, Sun, AlertTriangle } from 'lucide-react';

interface TimeAwareSliderProps {
  selectedTimeIndex: number;
  onSelectTimeIndex: (index: number) => void;
  isNightMode: boolean;
  onToggleNightMode: () => void;
}

export const TimeAwareSlider: React.FC<TimeAwareSliderProps> = ({
  selectedTimeIndex,
  onSelectTimeIndex,
  isNightMode,
  onToggleNightMode,
}) => {
  const currentProfile = TIME_PROFILES[selectedTimeIndex] || TIME_PROFILES[1];

  return (
    <div className="glass-card rounded-2xl p-4 border border-white/10 text-slate-100 shadow-xl select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
            TIME-AWARE SAFETY SIMULATOR
          </span>
        </div>

        {/* Day / Night Mode Toggle */}
        <button
          onClick={onToggleNightMode}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all border ${
            isNightMode 
              ? 'bg-indigo-950/80 text-indigo-200 border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.25)]' 
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
          }`}
          title="Toggle Day / Night Mode"
        >
          {isNightMode ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isNightMode ? '🌙 NIGHT VISION' : '☀️ DAYLIGHT'}</span>
        </button>
      </div>

      {/* Preset Time Buttons */}
      <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
        {TIME_PROFILES.map((profile, idx) => {
          const isSelected = selectedTimeIndex === idx;
          const isLate = profile.hour24 >= 22 || profile.hour24 <= 4;
          return (
            <button
              key={profile.timeLabel}
              onClick={() => onSelectTimeIndex(idx)}
              className={`py-2 px-1 rounded-lg text-center transition-all ${
                isSelected 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 text-xs'
              }`}
            >
              <div className="text-[11px] font-mono leading-tight">{profile.timeLabel}</div>
              <div className="flex items-center justify-center mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  profile.riskTier === 'lower-risk' 
                    ? 'bg-emerald-400' 
                    : profile.riskTier === 'moderate' 
                    ? 'bg-amber-400' 
                    : 'bg-rose-500'
                }`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Time advisory explanation */}
      <div className="mt-3 flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-white/5 leading-relaxed">
        <span className="text-emerald-400 font-mono font-bold">{currentProfile.timeLabel}:</span>
        <span className="text-slate-300 text-[11px]">{currentProfile.advisory}</span>
      </div>
    </div>
  );
};
