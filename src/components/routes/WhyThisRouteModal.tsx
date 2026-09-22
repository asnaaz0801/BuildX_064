import React from 'react';
import { DEMO_ROUTES } from '../../data/nagpurRoutes';
import { LatLngTuple } from '../../types/safety';
import { 
  X, 
  Sparkles, 
  Sun, 
  ShieldCheck, 
  Users, 
  TrendingDown, 
  BadgeAlert, 
  ExternalLink,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface WhyThisRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFocusFeature: (coords: LatLngTuple, zoom: number, segmentId?: string) => void;
}

export const WhyThisRouteModal: React.FC<WhyThisRouteModalProps> = ({
  isOpen,
  onClose,
  onFocusFeature,
}) => {
  if (!isOpen) return null;

  const route = DEMO_ROUTES.safer;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-4 h-4 text-amber-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Users': return <Users className="w-4 h-4 text-sky-400" />;
      case 'TrendingDown': return <TrendingDown className="w-4 h-4 text-emerald-400" />;
      case 'BadgeAlert': return <BadgeAlert className="w-4 h-4 text-indigo-400" />;
      default: return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative glass-panel w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-emerald-500/30 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wider uppercase">
            Interactive Safety Audit
          </span>
          <span className="text-xs font-mono text-slate-400">Map Analysis Mode Active</span>
        </div>

        <h2 className="text-2xl font-bold font-display text-white">
          Why Safe Safar Recommends This Route
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Click any factor below to immediately pinpoint and inspect the intelligence signals live on the map.
        </p>

        {/* Comparative Banner */}
        <div className="mt-5 grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Fastest Route (12 min)</div>
            <div className="text-xl font-extrabold text-amber-400 font-display mt-0.5">62 <span className="text-xs font-mono text-slate-400 font-normal">/100</span></div>
            <div className="text-[11px] text-slate-400 mt-1">Cut through unlit railway alleys. 0 safe havens.</div>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <div className="text-[10px] font-mono uppercase text-emerald-400">Safer Route (15 min)</div>
            <div className="text-xl font-extrabold text-emerald-400 font-display mt-0.5">88 <span className="text-xs font-mono text-slate-400 font-normal">/100</span></div>
            <div className="text-[11px] text-emerald-300 mt-1">+26 net safety points for only 3 extra minutes.</div>
          </div>
        </div>

        {/* Clickable Reasons Checklist */}
        <div className="mt-5 space-y-2.5">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Verified Safety Determinants</span>
            <span className="text-sky-400 text-[11px]">Click item to inspect on map ↗</span>
          </div>

          {route.keyAdvantages.map((adv) => (
            <div
              key={adv.id}
              onClick={() => {
                if (adv.targetFocus) {
                  onFocusFeature(adv.targetFocus, adv.targetZoom || 16, adv.segmentHighlightId);
                }
              }}
              className="group p-3.5 rounded-2xl bg-slate-900/50 hover:bg-slate-800/80 border border-white/5 hover:border-emerald-500/40 transition-all cursor-pointer flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-emerald-500/10 border border-white/5 group-hover:border-emerald-500/30 transition-colors mt-0.5">
                  {getIcon(adv.icon)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-emerald-300 flex items-center gap-1.5 transition-colors">
                    <span>{adv.title}</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {adv.description}
                  </div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-800/40 text-slate-400 group-hover:text-sky-400 transition-colors flex-shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Unlit Alternative Warning */}
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-amber-300">Why not the 12-min route? </span>
            The 1.8km path passes Mohan Nagar underpass and railway yard alleys which suffer from 4 unlit street lamps and 0 open businesses after 9:00 PM.
          </div>
        </div>

        {/* Done / Close CTA */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            Navigation engine: Safe Safar Autonomous Multi-Factor Core
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/60 transition-colors"
          >
            Continue with Safer Route
          </button>
        </div>
      </div>
    </div>
  );
};
