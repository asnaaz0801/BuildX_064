import React, { useState } from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, Send, CheckCircle, X, Navigation, Radio } from 'lucide-react';
import { LatLngTuple } from '../../types/safety';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAudioAlert?: () => void;
  userCoords: LatLngTuple;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  onTriggerAudioAlert,
  userCoords,
}) => {
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastDone, setBroadcastDone] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleShareLocation = () => {
    setIsBroadcasting(true);
    onTriggerAudioAlert?.();

    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastDone(true);
    }, 1800);
  };

  const resetAndClose = () => {
    setIsBroadcasting(false);
    setBroadcastDone(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative glass-panel w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-rose-500/40 text-slate-100 overflow-hidden">
        {/* Top Emergency Beacon Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 animate-shimmer" />

        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900/80 text-slate-400 hover:text-white transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-pulse">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-rose-400">
              Safe Safar Rapid Response
            </div>
            <h2 className="text-xl font-bold font-display text-white">
              EMERGENCY ASSISTANCE
            </h2>
          </div>
        </div>

        {/* Current Location Landmark */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            <span>CURRENT GPS FIX:</span>
          </div>
          <div className="text-sm font-bold text-white mt-1">
            Zero Mile Stone / Sitabuldi Interchange
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">
            {userCoords[0].toFixed(4)}° N, {userCoords[1].toFixed(4)}° E • Accuracy: 3.2m
          </div>
        </div>

        {/* Immediate Responders Nearby */}
        <div className="space-y-2 mb-5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Immediate Emergency Assets Nearby
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="text-base">👮</span>
              <div>
                <div className="text-xs font-bold text-white">Sitabuldi Police Station</div>
                <div className="text-[11px] text-slate-400">Direct PCR line active</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">700m</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="text-base">🏥</span>
              <div>
                <div className="text-xs font-bold text-white">Care Hospital Emergency</div>
                <div className="text-[11px] text-slate-400">24/7 Trauma unit</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">1.2 km</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="text-base">🏪</span>
              <div>
                <div className="text-xs font-bold text-white">24/7 MedPlus Safe Haven</div>
                <div className="text-[11px] text-slate-400">Illuminated refuge point</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">400m</span>
          </div>
        </div>

        {/* Broadcast Status / Actions */}
        {broadcastDone ? (
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center animate-in zoom-in-95 duration-200">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-emerald-300">
              ✓ Location Sharing Simulated
            </div>
            <div className="text-xs text-slate-300 mt-1 leading-relaxed">
              Encrypted live telemetry dispatched to 3 designated emergency contacts and closest Nagpur PCR patrol car.
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-2">
              Device battery: 84% • Audio beacon active
            </div>
            <button
              onClick={resetAndClose}
              className="mt-4 px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              Close Emergency Window
            </button>
          </div>
        ) : isBroadcasting ? (
          <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/50 text-center space-y-3">
            <div className="flex items-center justify-center">
              <Radio className="w-8 h-8 text-rose-400 animate-pulse" />
            </div>
            <div className="text-sm font-mono text-rose-300 font-semibold animate-pulse">
              DISPATCHING LIVE SOS TELEMETRY...
            </div>
            <div className="text-xs text-slate-400">
              Establishing priority link with Nagpur Emergency Central...
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleShareLocation}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/60 transition-all transform active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>SIMULATE LIVE LOCATION BROADCAST</span>
            </button>

            <button
              onClick={resetAndClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-white/5 transition-colors"
            >
              Cancel / Safe
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
