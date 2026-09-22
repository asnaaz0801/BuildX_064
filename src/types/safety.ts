export type LatLngTuple = [number, number];

export interface SafetyFactorBreakdown {
  lighting: number;          // 0 - 100
  pedestrianActivity: number;// 0 - 100
  incidentHistory: number;   // 0 - 100
  safeHavens: number;        // 0 - 100
  communitySignals: number;  // 0 - 100
}

export interface RouteSegment {
  id: string;
  name: string;
  coordinates: LatLngTuple[];
  safetyType: 'safe' | 'moderate' | 'risk';
  description: string;
  factorImpact: string;
}

export interface SafetyRoute {
  id: 'fastest' | 'safer';
  name: string;
  tagline: string;
  distanceKm: number;
  durationMin: number;
  safetyScore: number;
  safetyTier: 'lower-risk' | 'moderate' | 'elevated';
  summaryBadge: string;
  description: string;
  coordinates: LatLngTuple[];
  factors: SafetyFactorBreakdown;
  segments: RouteSegment[];
  keyAdvantages: {
    id: string;
    title: string;
    description: string;
    icon: string;
    targetFocus?: LatLngTuple;
    targetZoom?: number;
    segmentHighlightId?: string;
  }[];
  cautions: string[];
}

export type SafeHavenType = 'police' | 'hospital' | 'store247' | 'petrol' | 'pharmacy';

export interface SafeHaven {
  id: string;
  name: string;
  type: SafeHavenType;
  coordinates: LatLngTuple;
  distanceMeters: number;
  address: string;
  verified: boolean;
  open247: boolean;
  emergencyPhone: string;
  notes: string;
}

export type IncidentCategory = 
  | 'lighting' 
  | 'harassment' 
  | 'accident' 
  | 'suspicious' 
  | 'deserted' 
  | 'other';

export interface IncidentSignal {
  id: string;
  title: string;
  category: IncidentCategory;
  coordinates: LatLngTuple;
  reportedTimeAgo: string;
  impactScore: number; // e.g. -8
  severity: 'low' | 'moderate' | 'elevated';
  distanceToRouteMeters: number;
  description: string;
  verifiedCount: number;
}

export interface TimeSafetyProfile {
  timeLabel: string;
  hour24: number;
  safetyScoreMultiplier: number;
  lightingWeight: number;
  pedestrianFactor: number;
  incidentModifier: number;
  advisory: string;
  riskTier: 'lower-risk' | 'moderate' | 'elevated';
}
