import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  Shield, 
  HeartHandshake, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown
} from 'lucide-react';
import { TimeAwareSlider } from '../hud/TimeAwareSlider';
import { INITIAL_SAFE_HAVENS } from '../../data/safeHavens';
import { SafeHaven, LatLngTuple } from '../../types/safety';

interface CommandSidebarProps {
  destinationText: string;
  onChangeDestination: (val: string) => void;
  onSearchRoutes: () => void;
  isScanning: boolean;
  selectedTimeIndex: number;
  onSelectTimeIndex: (idx: number) => void;
  isNightMode: boolean;
  onToggleNightMode: () => void;
  onOpenReportModal: () => void;
  onSelectSafeHaven: (haven: SafeHaven) => void;
  onFlyToHaven: (coords: LatLngTuple) => void;
}

export const CommandSidebar: React.FC<CommandSidebarProps> = ({
  destinationText,
  onChangeDestination,
  onSearchRoutes,
  isScanning,
  selectedTimeIndex,
  onSelectTimeIndex,
  isNightMode,
  onToggleNightMode,
  onOpenReportModal,
  onSelectSafeHaven,
  onFlyToHaven,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isHavenListOpen, setIsHavenListOpen] = useState<boolean>(false);

  const presets = [
    { label: 'Sadar Commercial Concourse', short: 'Sadar' },
    { label: 'Civil Lines Boulevard', short: 'Civil Lines' },
    { label: 'Dharampeth High St', short: 'Dharampeth' },
  ];

  return (
    <aside 
      className={`fixed top-20 left-4 z-20 transition-all duration-300 ${
        isCollapsed ? '-translate-x-[calc(100%-40px)]' : 'translate-x-0'
      } max-w-sm w-full select-none`}
    >
      <div className="relative glass-panel rounded-2xl p-5 shadow-2xl border border-white/10 text-slate-100 max-h-[86vh] overflow-y-auto backdrop-blur-xl">
        {/* Collapse toggle tab */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-9 top-6 w-9 h-10 rounded-r-xl bg-slate-900/90 border-r border-y border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors shadow-lg"
          title={isCollapsed ? "Expand Controls" : "Collapse Controls"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        {/* Route Input Box */}
        <div className="space-y-2 mb-4">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Route Planning</span>
            <span className="text-emerald-400 font-bold">LIVE TELEMETRY</span>
          </div>

          {/* Start Point (Fixed to Nagpur Central) */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400 ring-4 ring-sky-400/20" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Starting Point</div>
              <div className="text-xs font-bold text-white truncate">
                Zero Mile / Sitabuldi (Nagpur Central)
              </div>
            </div>
          </div>

          {/* Destination Point */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-slate-800 focus-within:border-emerald-500/60 transition-colors">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Safe Destination</div>
              <input
                type="text"
                value={destinationText}
                onChange={(e) => onChangeDestination(e.target.value)}
                placeholder="Enter destination..."
                className="w-full text-xs font-bold text-white bg-transparent focus:outline-none placeholder-slate-500"
              />
            </div>
            {destinationText && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified
              </span>
            )}
          </div>

          {/* Destination Presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {presets.map((p) => (
              <button
                key={p.short}
                onClick={() => onChangeDestination(p.short)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                  destinationText.toLowerCase().includes(p.short.toLowerCase())
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.short}
              </button>
            ))}
          </div>
        </div>

        {/* Find Safe Routes Action Button */}
        <button
          onClick={onSearchRoutes}
          disabled={isScanning}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all transform active:scale-98 mb-4 border border-emerald-400/30"
        >
          {isScanning ? (
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Scanning Safety Vectors...</span>
            </div>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Find Safe Routes</span>
            </>
          )}
        </button>

        {/* Time-Aware Safety Simulator Component */}
        <div className="mb-4">
          <TimeAwareSlider
            selectedTimeIndex={selectedTimeIndex}
            onSelectTimeIndex={onSelectTimeIndex}
            isNightMode={isNightMode}
            onToggleNightMode={onToggleNightMode}
          />
        </div>

        {/* Nearby Safe Havens Quick Directory */}
        <div className="mb-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden">
          <button
            onClick={() => setIsHavenListOpen(!isHavenListOpen)}
            className="w-full p-3 flex items-center justify-between text-xs font-mono text-slate-300 hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">Nearby Safe Havens (10)</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isHavenListOpen ? 'rotate-180' : ''}`} />
          </button>

          {isHavenListOpen && (
            <div className="p-2 space-y-1.5 max-h-44 overflow-y-auto border-t border-slate-800">
              {INITIAL_SAFE_HAVENS.slice(0, 5).map((haven) => (
                <div
                  key={haven.id}
                  onClick={() => {
                    onSelectSafeHaven(haven);
                    onFlyToHaven(haven.coordinates);
                  }}
                  className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="truncate mr-2">
                    <div className="font-semibold text-white truncate">{haven.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{haven.address}</div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex-shrink-0">
                    {haven.distanceMeters}m
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Report Safety Signal Trigger */}
        <button
          onClick={onOpenReportModal}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Report Safety Signal or Hazard</span>
        </button>
      </div>
    </aside>
  );
};
