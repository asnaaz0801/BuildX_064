import React, { useState, useCallback } from 'react';
import { SafeSafarMap } from './components/map/SafeSafarMap';
import { HeaderNav } from './components/layout/HeaderNav';
import { CommandSidebar } from './components/layout/CommandSidebar';
import { SafetyIntelligenceHUD } from './components/hud/SafetyIntelligenceHUD';
import { RouteComparisonBar } from './components/routes/RouteComparisonBar';
import { WhyThisRouteModal } from './components/routes/WhyThisRouteModal';
import { SOSModal } from './components/emergency/SOSModal';
import { FakeCallModal } from './components/emergency/FakeCallModal';
import { IncidentReportModal } from './components/community/IncidentReportModal';
import { FirstLoadCinematic } from './components/demo/FirstLoadCinematic';
import { HeroDemoController } from './components/demo/HeroDemoController';
import { MobileNavigation } from './components/layout/MobileNavigation';

import { useSafetySimulation } from './hooks/useSafetySimulation';
import { useAudioEffects } from './hooks/useAudioEffects';
import { USER_START_LOCATION, DEMO_DESTINATION } from './data/nagpurRoutes';
import { SafeHaven, IncidentSignal, LatLngTuple } from './types/safety';

export function App() {
  // Cinematic splash state
  const [hasShownSplash, setHasShownSplash] = useState<boolean>(false);

  // App core state
  const [destinationText, setDestinationText] = useState<string>('Sadar Commercial Concourse');
  const [selectedRouteId, setSelectedRouteId] = useState<'fastest' | 'safer'>('safer');
  const [isNightMode, setIsNightMode] = useState<boolean>(true); // Night view looks ultra-premium
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showSafeHavens, setShowSafeHavens] = useState<boolean>(true);
  const [showIncidents, setShowIncidents] = useState<boolean>(true);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number>(1); // 08:00 PM default

  // Route scanning simulation state
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('ANALYSIS ACTIVE');
  const [analysisMode, setAnalysisMode] = useState<boolean>(false);
  const [activeSegmentHighlightId, setActiveSegmentHighlightId] = useState<string | null>(null);

  // Camera navigation
  const [flyToTarget, setFlyToTarget] = useState<{ coords: LatLngTuple; zoom: number; timestamp: number } | null>(null);

  // Community user reported incidents
  const [userIncidents, setUserIncidents] = useState<IncidentSignal[]>([]);

  // Modals state
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isFakeCallOpen, setIsFakeCallOpen] = useState<boolean>(false);
  const [isWhyThisRouteOpen, setIsWhyThisRouteOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Hero demo walkthrough state
  const [isHeroDemoRunning, setIsHeroDemoRunning] = useState<boolean>(false);

  // Mobile navigation active tab
  const [mobileTab, setMobileTab] = useState<string>('home');

  // Toast banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio effects
  const {
    playClick,
    playRadarPing,
    playSuccessChime,
    playAlertTone,
    startRingtone,
    stopRingtone,
  } = useAudioEffects();

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Compute dynamic safety simulation for both routes
  const saferMetrics = useSafetySimulation('safer', selectedTimeIndex, isNightMode, userIncidents.length);
  const fastestMetrics = useSafetySimulation('fastest', selectedTimeIndex, isNightMode, userIncidents.length);

  const activeMetrics = selectedRouteId === 'safer' ? saferMetrics : fastestMetrics;

  // Handle Find Safe Routes scanning sequence
  const handleSearchRoutes = useCallback(() => {
    setIsScanning(true);
    playRadarPing();

    const steps = [
      'SCANNING ROUTE VECTORS...',
      'ANALYZING STREET LIGHTING MESH...',
      'EVALUATING INCIDENT DENSITY...',
      'MAPPING VERIFIED SAFE HAVENS...',
      'ANALYZING TIME DEGRADATION...',
      'ROUTE SAFETY READY',
    ];

    steps.forEach((stepText, idx) => {
      setTimeout(() => {
        setScanStep(stepText);
        if (idx < steps.length - 1) {
          playClick();
        } else {
          playSuccessChime();
          setIsScanning(false);
          showToast('Route safety telemetry synchronized.');
        }
      }, (idx + 1) * 600);
    });
  }, [playRadarPing, playClick, playSuccessChime, showToast]);

  // Handle fly to specific coordinate
  const triggerFlyTo = useCallback((coords: LatLngTuple, zoom: number = 16, segmentId?: string) => {
    setFlyToTarget({ coords, zoom, timestamp: Date.now() });
    if (segmentId) {
      setActiveSegmentHighlightId(segmentId);
    }
    playClick();
  }, [playClick]);

  // Handle new community incident submission
  const handleAddIncident = useCallback((newInc: IncidentSignal) => {
    setUserIncidents((prev) => [newInc, ...prev]);
    triggerFlyTo(newInc.coordinates, 16);
    showToast('Safety report verified & added to community safety mesh.');
  }, [triggerFlyTo, showToast]);

  return (
    <div className={`relative w-screen h-screen overflow-hidden ${isNightMode ? 'dark bg-[#050811]' : 'bg-slate-100'}`}>
      {/* 1. First Load Cinematic Splash Sequence */}
      {!hasShownSplash && (
        <FirstLoadCinematic onComplete={() => setHasShownSplash(true)} />
      )}

      {/* 2. Top Header Navigation */}
      <HeaderNav
        isNightMode={isNightMode}
        onToggleNightMode={() => {
          setIsNightMode(!isNightMode);
          playClick();
        }}
        showHeatmap={showHeatmap}
        onToggleHeatmap={() => {
          setShowHeatmap(!showHeatmap);
          playClick();
        }}
        showSafeHavens={showSafeHavens}
        onToggleSafeHavens={() => {
          setShowSafeHavens(!showSafeHavens);
          playClick();
        }}
        showIncidents={showIncidents}
        onToggleIncidents={() => {
          setShowIncidents(!showIncidents);
          playClick();
        }}
        onTriggerSOS={() => {
          setIsSOSOpen(true);
          playAlertTone();
        }}
        onTriggerFakeCall={() => {
          setIsFakeCallOpen(true);
          playClick();
        }}
        onStartHeroDemo={() => {
          setIsHeroDemoRunning(true);
          playClick();
        }}
        isHeroDemoRunning={isHeroDemoRunning}
      />

      {/* 3. Hero Demo Walkthrough Controller (When active) */}
      <HeroDemoController
        isRunning={isHeroDemoRunning}
        onStop={() => setIsHeroDemoRunning(false)}
        onSetDestination={(val) => setDestinationText(val)}
        onSearchRoutes={handleSearchRoutes}
        onSelectRoute={(id) => {
          setSelectedRouteId(id);
          playClick();
        }}
        onOpenWhyThisRoute={() => {
          setIsWhyThisRouteOpen(true);
          setAnalysisMode(true);
        }}
        onCloseWhyThisRoute={() => {
          setIsWhyThisRouteOpen(false);
          setAnalysisMode(false);
        }}
        onFlyTo={triggerFlyTo}
        onToggleNightMode={() => setIsNightMode((prev) => !prev)}
        onOpenFakeCall={() => setIsFakeCallOpen(true)}
        onCloseFakeCall={() => setIsFakeCallOpen(false)}
        onOpenSOS={() => setIsSOSOpen(true)}
        onCloseSOS={() => setIsSOSOpen(false)}
        onSelectTimeIndex={(idx) => setSelectedTimeIndex(idx)}
      />

      {/* 4. Main Leaflet Interactive Map (Hero: 65–70% of visual attention) */}
      <main className="absolute inset-0 z-0">
        <SafeSafarMap
          isNightMode={isNightMode}
          showHeatmap={showHeatmap}
          showSafeHavens={showSafeHavens}
          showIncidents={showIncidents}
          selectedRouteId={selectedRouteId}
          analysisMode={analysisMode}
          isScanning={isScanning}
          flyToTarget={flyToTarget}
          activeSegmentHighlightId={activeSegmentHighlightId}
          userIncidents={userIncidents}
          onSelectIncident={(inc) => {
            showToast(`Selected risk signal: ${inc.title} (${inc.impactScore} pts)`);
          }}
          onSelectSafeHaven={(haven) => {
            showToast(`Safe Haven selected: ${haven.name}`);
          }}
        />
      </main>

      {/* 5. Left Command Sidebar (Route Inputs, Presets, Time Simulator, Haven Directory) */}
      <CommandSidebar
        destinationText={destinationText}
        onChangeDestination={setDestinationText}
        onSearchRoutes={handleSearchRoutes}
        isScanning={isScanning}
        selectedTimeIndex={selectedTimeIndex}
        onSelectTimeIndex={(idx) => {
          setSelectedTimeIndex(idx);
          playClick();
        }}
        isNightMode={isNightMode}
        onToggleNightMode={() => {
          setIsNightMode(!isNightMode);
          playClick();
        }}
        onOpenReportModal={() => {
          setIsReportModalOpen(true);
          playClick();
        }}
        onSelectSafeHaven={(haven) => {
          showToast(`Focusing on Safe Haven: ${haven.name}`);
        }}
        onFlyToHaven={(coords) => triggerFlyTo(coords, 17)}
      />

      {/* 6. Right Safety Intelligence HUD (Live Area Signal, Radial Score, Telemetry Factors) */}
      <SafetyIntelligenceHUD
        currentArea="Nagpur Central (Sitabuldi)"
        safetyScore={activeMetrics.score}
        safetyTier={activeMetrics.tier}
        factors={activeMetrics.factors}
        isScanning={isScanning}
        scanStep={scanStep}
        riskSignalCount={4 + userIncidents.length}
        positiveSignalCount={7}
        advisoryNote={activeMetrics.advisoryNote}
        onOpenWhyThisRoute={() => {
          setIsWhyThisRouteOpen(true);
          setAnalysisMode(true);
          playClick();
        }}
        selectedRouteId={selectedRouteId}
      />

      {/* 7. Bottom Route Comparison Dual Cards (⚡ Fastest vs 🛡️ Safer) */}
      <RouteComparisonBar
        selectedRouteId={selectedRouteId}
        onSelectRoute={(id) => {
          setSelectedRouteId(id);
          triggerFlyTo([21.1530, 79.0835], 15);
          playClick();
        }}
        onOpenWhyThisRoute={() => {
          setIsWhyThisRouteOpen(true);
          setAnalysisMode(true);
          playClick();
        }}
        fastestDynamicScore={fastestMetrics.score}
        saferDynamicScore={saferMetrics.score}
      />

      {/* 8. Mobile Bottom Navigation Dock */}
      <MobileNavigation
        onOpenRoutes={() => {
          // focus routes
          triggerFlyTo([21.1530, 79.0835], 15);
        }}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenHUD={() => {
          // toggle or view HUD
        }}
        onTriggerSOS={() => {
          setIsSOSOpen(true);
          playAlertTone();
        }}
        onTriggerFakeCall={() => {
          setIsFakeCallOpen(true);
          playClick();
        }}
        selectedRouteId={selectedRouteId}
        activeTab={mobileTab}
        setActiveTab={setMobileTab}
      />

      {/* 9. Interactive "Why this route?" Modal */}
      <WhyThisRouteModal
        isOpen={isWhyThisRouteOpen}
        onClose={() => {
          setIsWhyThisRouteOpen(false);
          setAnalysisMode(false);
          setActiveSegmentHighlightId(null);
        }}
        onFocusFeature={(coords, zoom, segId) => {
          triggerFlyTo(coords, zoom, segId);
          setIsWhyThisRouteOpen(false);
        }}
      />

      {/* 10. Emergency SOS Assistance Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        onTriggerAudioAlert={playAlertTone}
        userCoords={USER_START_LOCATION}
      />

      {/* 11. Simulated Discreet Fake Call Modal */}
      <FakeCallModal
        isOpen={isFakeCallOpen}
        onClose={() => setIsFakeCallOpen(false)}
        onStartRingtone={startRingtone}
        onStopRingtone={stopRingtone}
      />

      {/* 12. Community Incident Reporting Modal */}
      <IncidentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitIncident={handleAddIncident}
        userCoords={USER_START_LOCATION}
        onPlayChime={playSuccessChime}
      />

      {/* 13. System Toast Confirmation */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/95 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
