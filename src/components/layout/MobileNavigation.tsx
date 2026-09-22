import React from 'react';
import { Shield, Navigation, AlertTriangle, AlertOctagon, Phone, Layers, Sparkles } from 'lucide-react';

interface MobileNavigationProps {
  onOpenRoutes: () => void;
  onOpenReport: () => void;
  onOpenHUD: () => void;
  onTriggerSOS: () => void;
  onTriggerFakeCall: () => void;
  selectedRouteId: 'fastest' | 'safer';
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  onOpenRoutes,
  onOpenReport,
  onOpenHUD,
  onTriggerSOS,
  onTriggerFakeCall,
  selectedRouteId,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden select-none bg-slate-950/95 border-t border-white/10 backdrop-blur-xl px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around">
        {/* Home / Reset */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
            activeTab === 'home' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px] font-mono">Home</span>
        </button>

        {/* Routes Comparison */}
        <button
          onClick={() => {
            setActiveTab('routes');
            onOpenRoutes();
          }}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
            activeTab === 'routes' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Navigation className="w-5 h-5" />
          <span className="text-[10px] font-mono">Routes</span>
        </button>

        {/* Report Hazard */}
        <button
          onClick={onOpenReport}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-amber-400 hover:text-amber-300 transition-colors"
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="text-[10px] font-mono">Report</span>
        </button>

        {/* Fake Call Trigger */}
        <button
          onClick={onTriggerFakeCall}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-sky-400 hover:text-sky-300 transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span className="text-[10px] font-mono">Fake Call</span>
        </button>

        {/* SOS Emergency */}
        <button
          onClick={onTriggerSOS}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-rose-500 hover:text-rose-400 transition-colors animate-pulse"
        >
          <AlertOctagon className="w-5 h-5" />
          <span className="text-[10px] font-mono font-bold">SOS</span>
        </button>
      </div>
    </div>
  );
};
