import React, { useState } from 'react';
import { IncidentCategory, IncidentSignal, LatLngTuple } from '../../types/safety';
import { 
  X, 
  Send, 
  Camera, 
  MapPin, 
  AlertTriangle, 
  Lightbulb, 
  ShieldAlert, 
  Car, 
  UserX, 
  Construction,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitIncident: (newIncident: IncidentSignal) => void;
  userCoords: LatLngTuple;
  onPlayChime?: () => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitIncident,
  userCoords,
  onPlayChime,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory>('lighting');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [severity, setSeverity] = useState<'low' | 'moderate' | 'elevated'>('moderate');
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'lighting' as IncidentCategory, label: 'Poor Lighting', emoji: '💡' },
    { id: 'harassment' as IncidentCategory, label: 'Harassment', emoji: '🚨' },
    { id: 'accident' as IncidentCategory, label: 'Accident / Hazard', emoji: '🚗' },
    { id: 'suspicious' as IncidentCategory, label: 'Suspicious Activity', emoji: '👤' },
    { id: 'deserted' as IncidentCategory, label: 'Unsafe / Deserted', emoji: '🚧' },
    { id: 'other' as IncidentCategory, label: 'Other Hazard', emoji: '⚠️' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const impactPoints = severity === 'elevated' ? -12 : severity === 'moderate' ? -8 : -4;

    // Slight coordinate offset to drop near user or current road
    const newCoords: LatLngTuple = [
      userCoords[0] + (Math.random() * 0.003 - 0.0015),
      userCoords[1] + (Math.random() * 0.003 - 0.0015),
    ];

    const incidentData: IncidentSignal = {
      id: `user-inc-${Date.now()}`,
      title: title || `${categories.find(c => c.id === selectedCategory)?.label} Report`,
      category: selectedCategory,
      coordinates: newCoords,
      reportedTimeAgo: 'Just now',
      impactScore: impactPoints,
      severity: severity,
      distanceToRouteMeters: Math.round(150 + Math.random() * 200),
      description: description || 'Community-verified safety signal reported by pedestrian.',
      verifiedCount: 1,
    };

    setTimeout(() => {
      onSubmitIncident(incidentData);
      onPlayChime?.();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10b981', '#38bdf8', '#f59e0b'],
        });
      } catch {
        // fallback
      }
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative glass-panel w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/10 text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono tracking-wider uppercase">
            Community Safety Mesh
          </span>
        </div>

        <h2 className="text-xl font-bold font-display text-white">
          Report a Safety Signal
        </h2>
        <p className="text-xs text-slate-300 mt-0.5 mb-5">
          Your report alerts nearby pedestrians and updates local route risk assessments in real time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Chip Selector */}
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase block mb-2">
              Signal Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500/20 border-amber-400/80 text-amber-300 shadow-md font-semibold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="text-xs truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Severity Selector */}
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase block mb-2">
              Perceived Risk Severity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low' as const, label: 'Low Impact', desc: '-4 pts', col: 'text-amber-300' },
                { id: 'moderate' as const, label: 'Moderate', desc: '-8 pts', col: 'text-amber-400' },
                { id: 'elevated' as const, label: 'Elevated Hazard', desc: '-12 pts', col: 'text-rose-400' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSeverity(item.id)}
                  className={`py-2 px-2 rounded-xl text-center border transition-all ${
                    severity === item.id
                      ? 'bg-slate-800 border-white/30 text-white font-bold'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className={`text-xs font-semibold ${item.col}`}>{item.label}</div>
                  <div className="text-[10px] font-mono text-slate-500">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title / Description */}
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase block mb-1">
              Location Description or Hazard Note
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 3 broken streetlamps near underpass exit"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details (e.g., poor visibility, ongoing works, low footfall)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Optional Photo Attachment Simulation */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-300">
                {hasPhoto ? 'Photo Attached (evidence.jpg)' : 'Attach Verification Photo'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHasPhoto(!hasPhoto)}
              className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400"
            >
              {hasPhoto ? 'Remove' : 'Simulate Capture'}
            </button>
          </div>

          {/* Location Landmark */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 pt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pinning to: Sitabuldi - Sadar Arterial Sector (Nagpur)</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 transition-all active:scale-98"
          >
            {isSubmitting ? (
              <span>Broadcasting to Safety Mesh...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Safety Report</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
