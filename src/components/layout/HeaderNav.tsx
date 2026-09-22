import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Clock, 
  Flame, 
  MapPin, 
  AlertTriangle, 
  Phone, 
  AlertOctagon, 
  Play, 
  Sun, 
  Moon, 
  Layers,
  Sparkles
} from 'lucide-react';

interface HeaderNavProps {
  isNightMode: boolean;
  onToggleNightMode: () => void;
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  showSafeHavens: boolean;
  onToggleSafeHavens: () => void;
  showIncidents: boolean;
  onToggleIncidents: () => void;
  onTriggerSOS: () => void;
  onTriggerFakeCall: () => void;
  onStartHeroDemo: () => void;
  isHeroDemoRunning: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  isNightMode,
  onToggleNightMode,
  showHeatmap,
  onToggleHeatmap,
  showSafeHavens,
  onToggleSafeHavens,
  showIncidents,
  onToggleIncidents,
  onTriggerSOS,
  onTriggerFakeCall,
  onStartHeroDemo,
  isHeroDemoRunning,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-3 left-3 right-3 z-30 select-none">
      <div className="glass-panel rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-2xl border border-white/10 backdrop-blur-xl">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Shield className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black font-display tracking-tight text-white flex items-center gap-1">
                SAFE <span className="text-emerald-400">SAFAR</span>
              </h1>
              <span className="hidden xl:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-medium">
                ● Safety intelligence active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium truncate">
              “Don’t Just Find a Route. Find a Safer One.”
            </p>
          </div>
        </div>

        {/* Center: Live Clock & Layer Toggles */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Live Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold text-white">{timeStr}</span>
          </div>

          {/* Quick Map Layer Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
            <button
              onClick={onToggleHeatmap}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                showHeatmap 
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Heatmap</span>
            </button>

            <button
              onClick={onToggleSafeHavens}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                showSafeHavens 
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Safe Havens</span>
            </button>

            <button
              onClick={onToggleIncidents}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                showIncidents 
                  ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Incidents</span>
            </button>
          </div>
        </div>

        {/* Right: Actions (Hero Demo Tour, Fake Call, SOS, Night Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hero Demo Runner Button */}
          <button
            onClick={onStartHeroDemo}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isHeroDemoRunning
                ? 'bg-purple-600 text-white animate-pulse border border-purple-400'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-950/40'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isHeroDemoRunning ? 'fill-white' : 'fill-slate-950'}`} />
            <span className="hidden sm:inline">{isHeroDemoRunning ? 'Running Demo...' : 'Hero Demo Tour (60s)'}</span>
            <span className="sm:hidden">Tour</span>
          </button>

          {/* Fake Call Trigger */}
          <button
            onClick={onTriggerFakeCall}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-sky-400 border border-sky-500/30 flex items-center gap-1.5 text-xs font-mono font-medium transition-colors shadow-sm"
            title="Simulate Fake Call"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden md:inline">Fake Call</span>
          </button>

          {/* SOS Floating Emergency Trigger */}
          <button
            onClick={onTriggerSOS}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-rose-950/60 border border-rose-400/40 animate-pulse"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>SOS</span>
          </button>

          {/* Day / Night toggle */}
          <button
            onClick={onToggleNightMode}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors"
            title={isNightMode ? 'Switch to Daylight' : 'Switch to Night Vision'}
          >
            {isNightMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
