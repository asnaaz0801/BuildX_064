import React, { useEffect, useState } from 'react';
import { SafetyFactorBreakdown } from '../../types/safety';
import { Sun, Users, ShieldAlert, HeartHandshake, Signal } from 'lucide-react';

interface SafetyScoreRadialProps {
  score: number;
  tier: 'lower-risk' | 'moderate' | 'elevated';
  factors: SafetyFactorBreakdown;
  label?: string;
}

export const SafetyScoreRadial: React.FC<SafetyScoreRadialProps> = ({
  score,
  tier,
  factors,
  label = 'SAFETY SIGNAL'
}) => {
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  // Smooth number count-up animation
  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.round(score / 25));
    const timer = setInterval(() => {
      current += step;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, 24);

    return () => clearInterval(timer);
  }, [score]);

  // Circumference for radial gauge
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getTierColor = () => {
    switch (tier) {
      case 'lower-risk':
        return {
          stroke: '#10b981',
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          glow: 'rgba(16, 185, 129, 0.4)',
          badge: 'LOWER-RISK PROFILE',
        };
      case 'moderate':
        return {
          stroke: '#f59e0b',
          text: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          glow: 'rgba(245, 158, 11, 0.4)',
          badge: 'MODERATE RISK PROFILE',
        };
      case 'elevated':
        return {
          stroke: '#ef4444',
          text: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20',
          glow: 'rgba(239, 68, 68, 0.4)',
          badge: 'ELEVATED RISK SIGNAL',
        };
    }
  };

  const colors = getTierColor();

  const factorItems = [
    { label: 'Lighting', value: factors.lighting, icon: Sun, color: 'text-amber-400', barCol: 'bg-amber-400' },
    { label: 'Pedestrian Activity', value: factors.pedestrianActivity, icon: Users, color: 'text-sky-400', barCol: 'bg-sky-400' },
    { label: 'Incident History', value: factors.incidentHistory, icon: ShieldAlert, color: 'text-emerald-400', barCol: 'bg-emerald-400' },
    { label: 'Safe Havens', value: factors.safeHavens, icon: HeartHandshake, color: 'text-purple-400', barCol: 'bg-purple-400' },
    { label: 'Community Signals', value: factors.communitySignals, icon: Signal, color: 'text-cyan-400', barCol: 'bg-cyan-400' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Radial Gauge Container */}
      <div className="relative flex items-center justify-center my-2">
        <svg className="w-32 h-32 transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="7"
            className="text-slate-800/80 fill-transparent"
          />
          {/* Animated score circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={colors.stroke}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="fill-transparent transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${colors.glow})`
            }}
          />
        </svg>

        {/* Inner Score Telemetry */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            {label}
          </span>
          <div className="flex items-baseline">
            <span className={`text-3xl font-black font-display tracking-tight ${colors.text}`}>
              {animatedScore}
            </span>
            <span className="text-xs font-mono text-slate-500 ml-0.5">/100</span>
          </div>
        </div>
      </div>

      {/* Tier Badge */}
      <div className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase ${colors.bg} ${colors.text} ${colors.border} border shadow-sm`}>
        {colors.badge}
      </div>

      {/* Supporting Factor Telemetry Bars */}
      <div className="w-full mt-5 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>FACTOR TELEMETRY</span>
          <span>CONFIDENCE</span>
        </div>

        {factorItems.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span>{item.label}</span>
              </div>
              <span className="font-mono text-slate-200 text-xs font-semibold">
                {item.value}
              </span>
            </div>
            {/* Animated bar track */}
            <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${item.barCol}`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
