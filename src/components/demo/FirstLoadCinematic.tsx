import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Navigation, Activity } from 'lucide-react';

interface FirstLoadCinematicProps {
  onComplete: () => void;
}

export const FirstLoadCinematic: React.FC<FirstLoadCinematicProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    // 0.0s - Shield appears
    const t0 = setTimeout(() => setStep(1), 50);
    // 0.2s - Title appears
    const t1 = setTimeout(() => setStep(2), 220);
    // 0.5s - Taglines appear
    const t2 = setTimeout(() => setStep(3), 520);
    // 0.8s - System telemetry sync
    const t3 = setTimeout(() => setStep(4), 850);
    // 1.2s - Ready to dissolve
    const t4 = setTimeout(() => {
      setIsDismissed(true);
      setTimeout(onComplete, 400); // allow fade out transition
    }, 1400);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  if (isDismissed && step >= 4) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050811] transition-opacity duration-500 ${
        isDismissed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient safety grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative flex flex-col items-center text-center px-6 max-w-lg z-10">
        {/* 0.0s Shield Logo with Pulse Rings */}
        <div 
          className={`relative mb-6 transition-all duration-700 ease-out transform ${
            step >= 1 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
        >
          {/* Concentric radar rings */}
          <div className="absolute -inset-4 rounded-full border border-emerald-500/20 animate-ping opacity-40" />
          <div className="absolute -inset-8 rounded-full border border-sky-500/10 animate-pulse opacity-30" />
          
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <Shield className="w-10 h-10 text-emerald-400 fill-emerald-400/20 animate-pulse" />
          </div>
        </div>

        {/* 0.2s Brand Title */}
        <div 
          className={`transition-all duration-500 ease-out transform ${
            step >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Autonomous Safety Intelligence
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white flex items-center justify-center gap-2">
            SAFE <span className="text-emerald-400">SAFAR</span>
          </h1>
        </div>

        {/* 0.5s Taglines */}
        <div 
          className={`mt-3 space-y-1 transition-all duration-500 ease-out transform ${
            step >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <p className="text-lg md:text-xl font-medium text-slate-200">
            “Don’t Just Find a Route. Find a Safer One.”
          </p>
          <p className="text-xs font-mono text-slate-400 tracking-wider">
            Your Route. Your Safety. Your Safar.
          </p>
        </div>

        {/* 0.8s Live Sensor Status */}
        <div 
          className={`mt-8 flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 transition-all duration-500 ease-out transform ${
            step >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Synchronizing Nagpur Central safety mesh...</span>
        </div>

        {/* Skip button */}
        <button
          onClick={() => {
            setIsDismissed(true);
            setTimeout(onComplete, 100);
          }}
          className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest underline underline-offset-4"
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
};
