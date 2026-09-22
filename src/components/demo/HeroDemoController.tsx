import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, X, Sparkles } from 'lucide-react';
import { LatLngTuple } from '../../types/safety';

export interface HeroDemoStep {
  id: number;
  title: string;
  durationMs: number;
  action: () => void;
}

interface HeroDemoControllerProps {
  isRunning: boolean;
  onStop: () => void;
  // State mutators for each step in the demo sequence
  onSetDestination: (val: string) => void;
  onSearchRoutes: () => void;
  onSelectRoute: (id: 'fastest' | 'safer') => void;
  onOpenWhyThisRoute: () => void;
  onCloseWhyThisRoute: () => void;
  onFlyTo: (coords: LatLngTuple, zoom: number) => void;
  onToggleNightMode: () => void;
  onOpenFakeCall: () => void;
  onCloseFakeCall: () => void;
  onOpenSOS: () => void;
  onCloseSOS: () => void;
  onSelectTimeIndex: (idx: number) => void;
}

export const HeroDemoController: React.FC<HeroDemoControllerProps> = ({
  isRunning,
  onStop,
  onSetDestination,
  onSearchRoutes,
  onSelectRoute,
  onOpenWhyThisRoute,
  onCloseWhyThisRoute,
  onFlyTo,
  onToggleNightMode,
  onOpenFakeCall,
  onCloseFakeCall,
  onOpenSOS,
  onCloseSOS,
  onSelectTimeIndex,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const steps: { title: string; desc: string; duration: number; run: () => void }[] = [
    {
      title: '1. Initializing Safety Command Center',
      desc: 'Locking onto user beacon in Nagpur Central / Zero Mile...',
      duration: 3500,
      run: () => {
        onSetDestination('Sadar');
        onFlyTo([21.1458, 79.0882], 15);
      },
    },
    {
      title: '2. Destination Lock: "Sadar"',
      desc: 'Targeting Sadar Commercial Concourse (Mount Road)...',
      duration: 3000,
      run: () => {
        onSetDestination('Sadar Commercial Concourse');
      },
    },
    {
      title: '3. Autonomous Safety Radar Scan',
      desc: 'Analyzing municipal lighting, incident history, and safe havens...',
      duration: 4500,
      run: () => {
        onSearchRoutes();
      },
    },
    {
      title: '4. Comparing Fastest (62) vs Safer (88)',
      desc: 'Highlighting 15 min route with 2 safe havens (+26 net safety score)...',
      duration: 4500,
      run: () => {
        onSelectRoute('safer');
      },
    },
    {
      title: '5. Launching "Why This Route?" Audit',
      desc: 'Entering deep segment-by-segment analysis mode...',
      duration: 4500,
      run: () => {
        onOpenWhyThisRoute();
      },
    },
    {
      title: '6. Inspecting Safe Haven Proximity',
      desc: 'Focusing on Sitabuldi Police Station & Apollo 24/7 Chemist...',
      duration: 4500,
      run: () => {
        onCloseWhyThisRoute();
        onFlyTo([21.1472, 79.0855], 17);
      },
    },
    {
      title: '7. Night Vision Simulation (10:00 PM)',
      desc: 'Simulating late night: street lighting weight multiplies, scores adapt...',
      duration: 4500,
      run: () => {
        onToggleNightMode();
        onSelectTimeIndex(2); // 10:00 PM
      },
    },
    {
      title: '8. Discreet Safety Tool: Simulated Fake Call',
      desc: 'Opening discrete incoming call simulator with customizable caller...',
      duration: 5000,
      run: () => {
        onOpenFakeCall();
      },
    },
    {
      title: '9. Returning to Navigation Command Cockpit',
      desc: 'Safe extraction simulated, returning to live route guidance...',
      duration: 3500,
      run: () => {
        onCloseFakeCall();
        onFlyTo([21.1530, 79.0835], 15);
      },
    },
    {
      title: '10. Emergency Assistance (SOS Command)',
      desc: 'One-touch emergency response with nearest hospital and police dispatch...',
      duration: 5000,
      run: () => {
        onOpenSOS();
      },
    },
    {
      title: '11. Demo Sequence Complete',
      desc: 'Safe Safar: Don’t Just Find a Route. Find a Safer One.',
      duration: 4000,
      run: () => {
        onCloseSOS();
        onSelectTimeIndex(1); // Reset to 8 PM
      },
    },
  ];

  useEffect(() => {
    if (!isRunning) {
      setCurrentStepIndex(0);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const currentStep = steps[currentStepIndex];
    if (currentStep) {
      currentStep.run();

      timerRef.current = window.setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          onStop();
        }
      }, currentStep.duration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, currentStepIndex, isPaused]);

  if (!isRunning) return null;

  const activeStep = steps[currentStepIndex];

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-xl px-4 select-none animate-in slide-in-from-top-4 duration-300">
      <div className="glass-panel rounded-2xl p-4 shadow-2xl border border-purple-500/50 bg-slate-950/90 text-white backdrop-blur-xl">
        {/* Top bar with progress indicator */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              Interactive Hero Demo Tour • Step {currentStepIndex + 1}/{steps.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                if (currentStepIndex < steps.length - 1) {
                  setCurrentStepIndex((prev) => prev + 1);
                } else {
                  onStop();
                }
              }}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Next Step"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onStop}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Exit Demo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Title & Description */}
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{activeStep.title}</span>
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 font-mono">
            {activeStep.desc}
          </p>
        </div>

        {/* Linear Progress Bar */}
        <div className="mt-3 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-300 ease-out"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
