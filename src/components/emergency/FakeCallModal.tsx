import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  User, 
  Volume2, 
  Mic, 
  MicOff, 
  Grid, 
  UserPlus, 
  X, 
  Clock, 
  Play,
  VolumeX,
  ShieldCheck
} from 'lucide-react';

interface FakeCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRingtone: () => void;
  onStopRingtone: () => void;
}

type CallStage = 'configure' | 'countdown' | 'incoming' | 'active';

export const FakeCallModal: React.FC<FakeCallModalProps> = ({
  isOpen,
  onClose,
  onStartRingtone,
  onStopRingtone,
}) => {
  const [callerName, setCallerName] = useState<string>('Mom');
  const [callerAvatar, setCallerAvatar] = useState<string>('👩');
  const [delaySeconds, setDelaySeconds] = useState<number>(5);
  const [currentCountdown, setCurrentCountdown] = useState<number>(5);
  const [stage, setStage] = useState<CallStage>('configure');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaker, setIsSpeaker] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);

  const countdownIntervalRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<number | null>(null);

  // Clean reset when modal closes
  const handleFullClose = () => {
    onStopRingtone();
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
    setStage('configure');
    setCallDuration(0);
    onClose();
  };

  // Start countdown timer
  const handleStartCountdown = () => {
    setStage('countdown');
    setCurrentCountdown(delaySeconds);

    let count = delaySeconds;
    countdownIntervalRef.current = window.setInterval(() => {
      count -= 1;
      if (count <= 0) {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        triggerIncomingCall();
      } else {
        setCurrentCountdown(count);
      }
    }, 1000);
  };

  // Trigger Incoming Call
  const triggerIncomingCall = () => {
    setStage('incoming');
    onStartRingtone();
  };

  // Accept Call
  const handleAcceptCall = () => {
    onStopRingtone();
    setStage('active');
    setCallDuration(0);

    durationIntervalRef.current = window.setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  // Decline or End Call
  const handleEndCall = () => {
    onStopRingtone();
    if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
    handleFullClose();
  };

  // Format seconds to MM:SS
  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg select-none animate-in fade-in duration-200">
      {/* 1. CONFIGURATION VIEW */}
      {stage === 'configure' && (
        <div className="relative glass-panel w-full max-w-md rounded-3xl p-6 border border-white/10 text-slate-100 shadow-2xl">
          <button
            onClick={handleFullClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Phone className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Discreet Safety Tool
              </div>
              <h2 className="text-xl font-bold font-display text-white">
                SIMULATED FAKE CALL
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 mb-5">
            Trigger a realistic simulated phone call to help gracefully extract yourself from uncomfortable situations.
          </p>

          {/* Caller Preset Selection */}
          <div className="space-y-2 mb-4">
            <label className="text-xs font-mono text-slate-400 uppercase">
              Who’s Calling?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Mom', emoji: '👩' },
                { name: 'Dad', emoji: '👨' },
                { name: 'Friend', emoji: '👤' },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setCallerName(item.name);
                    setCallerAvatar(item.emoji);
                  }}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                    callerName === item.name
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-xs">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Custom Caller Name Input */}
            <input
              type="text"
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
              placeholder="Or enter custom caller name..."
              className="w-full mt-2 px-3 py-2 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
            />
          </div>

          {/* Delay Selector */}
          <div className="space-y-2 mb-6">
            <label className="text-xs font-mono text-slate-400 uppercase">
              Trigger Delay
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '5 Sec', value: 5 },
                { label: '10 Sec', value: 10 },
                { label: '30 Sec', value: 30 },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setDelaySeconds(item.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-mono border transition-all ${
                    delaySeconds === item.value
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={handleStartCountdown}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-950/60 transition-all"
          >
            <Clock className="w-4 h-4" />
            <span>Schedule Fake Call ({delaySeconds}s)</span>
          </button>
        </div>
      )}

      {/* 2. COUNTDOWN VIEW */}
      {stage === 'countdown' && (
        <div className="relative glass-panel w-full max-w-sm rounded-3xl p-8 border border-white/10 text-slate-100 text-center shadow-2xl">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">
            Incoming Call Scheduled
          </div>
          <div className="text-lg font-bold text-white mb-6">
            Stand By for {callerName}...
          </div>

          {/* Big countdown indicator */}
          <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-sky-500/20 animate-pulse" />
            <div className="absolute -inset-2 rounded-full border border-sky-400/30 animate-ping opacity-30" />
            <span className="text-5xl font-black font-display text-sky-400">
              {currentCountdown}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={triggerIncomingCall}
              className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
            >
              Ring Now
            </button>
            <button
              onClick={handleFullClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 3. SIMULATED INCOMING CALL (Full-screen mobile simulation) */}
      {stage === 'incoming' && (
        <div className="relative w-full max-w-sm h-[680px] rounded-[42px] bg-slate-950 border-[6px] border-slate-800 text-white shadow-2xl overflow-hidden flex flex-col justify-between p-8">
          {/* Simulated phone dynamic island / speaker */}
          <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto" />

          {/* Caller Identity */}
          <div className="text-center mt-6">
            <div className="relative w-28 h-28 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute -inset-3 rounded-full bg-emerald-500/20 animate-ping opacity-40" />
              <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-4xl shadow-xl">
                {callerAvatar}
              </div>
            </div>

            <h3 className="text-2xl font-bold font-display tracking-tight text-white">
              {callerName}
            </h3>
            <p className="text-xs font-mono text-emerald-400 mt-1 animate-pulse">
              Incoming Call...
            </p>
          </div>

          {/* Bottom Action Triggers */}
          <div className="mb-4">
            <div className="flex items-center justify-around">
              {/* Decline Button */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleEndCall}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-rose-950/60"
                >
                  <PhoneOff className="w-7 h-7 text-white" />
                </button>
                <span className="text-[11px] font-mono text-slate-400">Decline</span>
              </div>

              {/* Accept Button */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleAcceptCall}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-emerald-950/60 animate-bounce"
                >
                  <Phone className="w-7 h-7 text-slate-950" />
                </button>
                <span className="text-[11px] font-mono text-emerald-400">Accept</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ACTIVE CALL VIEW */}
      {stage === 'active' && (
        <div className="relative w-full max-w-sm h-[680px] rounded-[42px] bg-slate-950 border-[6px] border-slate-800 text-white shadow-2xl overflow-hidden flex flex-col justify-between p-8">
          <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto" />

          {/* Caller & Duration */}
          <div className="text-center mt-6">
            <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 mx-auto mb-3 flex items-center justify-center text-3xl">
              {callerAvatar}
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              {callerName}
            </h3>
            <p className="text-sm font-mono text-slate-300 mt-1">
              {formatDuration(callDuration)}
            </p>
          </div>

          {/* Active Call In-Call Controls */}
          <div className="grid grid-cols-3 gap-4 my-auto px-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-2xl flex flex-col items-center gap-1 transition-colors ${
                isMuted ? 'bg-white text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span className="text-[10px] font-mono">Mute</span>
            </button>

            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              className={`p-4 rounded-2xl flex flex-col items-center gap-1 transition-colors ${
                isSpeaker ? 'bg-white text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-[10px] font-mono">Speaker</span>
            </button>

            <button className="p-4 rounded-2xl bg-slate-900 text-slate-300 hover:bg-slate-800 flex flex-col items-center gap-1">
              <Grid className="w-5 h-5" />
              <span className="text-[10px] font-mono">Keypad</span>
            </button>
          </div>

          {/* End Call Button */}
          <div className="mb-4 flex flex-col items-center gap-2">
            <button
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-rose-950/60"
            >
              <PhoneOff className="w-7 h-7 text-white" />
            </button>
            <span className="text-[11px] font-mono text-rose-400">End Call & Return</span>
          </div>
        </div>
      )}
    </div>
  );
};
