import { useMemo } from 'react';
import { SafetyFactorBreakdown, TimeSafetyProfile } from '../types/safety';
import { DEMO_ROUTES } from '../data/nagpurRoutes';

export const TIME_PROFILES: TimeSafetyProfile[] = [
  {
    timeLabel: '06:00 PM',
    hour24: 18,
    safetyScoreMultiplier: 1.06,
    lightingWeight: 0.6,
    pedestrianFactor: 1.2,
    incidentModifier: 0.8,
    advisory: 'Daylight transitioning. High pedestrian presence and active street commerce across main corridors.',
    riskTier: 'lower-risk'
  },
  {
    timeLabel: '08:00 PM',
    hour24: 20,
    safetyScoreMultiplier: 1.0,
    lightingWeight: 1.0,
    pedestrianFactor: 1.0,
    incidentModifier: 1.0,
    advisory: 'Evening commute peak. Municipal lighting fully active. Moderate foot traffic on arterial roads.',
    riskTier: 'lower-risk'
  },
  {
    timeLabel: '10:00 PM',
    hour24: 22,
    safetyScoreMultiplier: 0.88,
    lightingWeight: 1.4,
    pedestrianFactor: 0.7,
    incidentModifier: 1.3,
    advisory: 'Commercial storefronts winding down. Route safety heavily reliant on continuous luminaire coverage.',
    riskTier: 'moderate'
  },
  {
    timeLabel: '12:00 AM',
    hour24: 24,
    safetyScoreMultiplier: 0.76,
    lightingWeight: 1.8,
    pedestrianFactor: 0.4,
    incidentModifier: 1.6,
    advisory: 'Late night window. Back-alleys drop significantly in safety rating. Sticking to verified arterial corridors advised.',
    riskTier: 'elevated'
  },
  {
    timeLabel: '02:00 AM',
    hour24: 2,
    safetyScoreMultiplier: 0.68,
    lightingWeight: 2.0,
    pedestrianFactor: 0.25,
    incidentModifier: 1.9,
    advisory: 'Minimal civilian transit. Highest risk disparity between unmonitored cuts and police-patrolled avenues.',
    riskTier: 'elevated'
  }
];

export function useSafetySimulation(
  selectedRouteId: 'fastest' | 'safer',
  selectedTimeIndex: number,
  isNightMode: boolean,
  addedIncidentCount: number = 0
) {
  const timeProfile = useMemo(() => {
    return TIME_PROFILES[selectedTimeIndex] || TIME_PROFILES[1];
  }, [selectedTimeIndex]);

  const baseRoute = useMemo(() => {
    return DEMO_ROUTES[selectedRouteId];
  }, [selectedRouteId]);

  const computedMetrics = useMemo(() => {
    const isSafer = selectedRouteId === 'safer';

    // Base score calculation
    let baseScore = baseRoute.safetyScore;

    // Time multiplier effect:
    // Faster route degrades much quicker at night (because it relies on unlit alleys)
    // Safer route degrades much less because it has 24/7 havens & high-mast lighting!
    const degradationVulnerability = isSafer ? 0.6 : 1.35;
    const timeDelta = (1 - timeProfile.safetyScoreMultiplier) * 100 * degradationVulnerability;
    
    // Night mode manual toggle penalty/boost
    const nightModeAdjustment = isNightMode ? -4 : 0;
    
    // Newly added incidents deduction
    const incidentPenalty = addedIncidentCount * (isSafer ? 1.5 : 3.0);

    let finalScore = Math.round(baseScore - timeDelta + nightModeAdjustment - incidentPenalty);
    finalScore = Math.max(18, Math.min(98, finalScore));

    // Factor breakdowns:
    const baseFactors = baseRoute.factors;
    const factors: SafetyFactorBreakdown = {
      lighting: Math.round(
        Math.max(10, Math.min(100, baseFactors.lighting * (isNightMode ? 0.92 : 1.0) - (timeProfile.hour24 >= 22 ? (isSafer ? 4 : 16) : 0)))
      ),
      pedestrianActivity: Math.round(
        Math.max(10, Math.min(100, baseFactors.pedestrianActivity * timeProfile.pedestrianFactor))
      ),
      incidentHistory: Math.round(
        Math.max(10, Math.min(100, baseFactors.incidentHistory - addedIncidentCount * 4))
      ),
      safeHavens: baseFactors.safeHavens,
      communitySignals: Math.round(
        Math.max(10, Math.min(100, baseFactors.communitySignals + addedIncidentCount * 2)) // community reporting increases signal confidence
      ),
    };

    const tier: 'lower-risk' | 'moderate' | 'elevated' = 
      finalScore >= 80 ? 'lower-risk' : finalScore >= 55 ? 'moderate' : 'elevated';

    return {
      score: finalScore,
      tier,
      factors,
      timeProfile,
      advisoryNote: 'Lower-risk profile based on available real-time safety signals. Always maintain situational awareness.',
    };
  }, [baseRoute, selectedRouteId, timeProfile, isNightMode, addedIncidentCount]);

  return computedMetrics;
}
