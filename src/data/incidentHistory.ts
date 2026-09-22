import { IncidentSignal, LatLngTuple } from '../types/safety';

export const INITIAL_INCIDENTS: IncidentSignal[] = [
  {
    id: 'inc-1',
    title: 'Poor Street Lighting',
    category: 'lighting',
    coordinates: [21.1528, 79.0905],
    reportedTimeAgo: '2h ago',
    impactScore: -8,
    severity: 'elevated',
    distanceToRouteMeters: 320,
    description: '4 consecutive high-pressure sodium street lamps out. Dense tree canopy completely blocking ambient light after 8 PM.',
    verifiedCount: 14,
  },
  {
    id: 'inc-2',
    title: 'Railway Underpass Blackout',
    category: 'lighting',
    coordinates: [21.1582, 79.0838],
    reportedTimeAgo: '4h ago',
    impactScore: -12,
    severity: 'elevated',
    distanceToRouteMeters: 180,
    description: 'Municipal transformer glitch caused total blackout in the pedestrian underpass tunnel.',
    verifiedCount: 29,
  },
  {
    id: 'inc-3',
    title: 'Suspicious Group Loitering',
    category: 'suspicious',
    coordinates: [21.1555, 79.0892],
    reportedTimeAgo: '1h ago',
    impactScore: -10,
    severity: 'moderate',
    distanceToRouteMeters: 410,
    description: 'Group of unidentified individuals blocking the sidewalk near abandoned warehouse premises.',
    verifiedCount: 8,
  },
  {
    id: 'inc-4',
    title: 'Harassment Signal (Historical)',
    category: 'harassment',
    coordinates: [21.1508, 79.0925],
    reportedTimeAgo: '3d ago',
    impactScore: -15,
    severity: 'elevated',
    distanceToRouteMeters: 550,
    description: 'Verbal harassment reported near railway gate crossing at 10:15 PM. Police night beat increased patrol frequency.',
    verifiedCount: 37,
  },
  {
    id: 'inc-5',
    title: 'Deserted Construction Corridor',
    category: 'deserted',
    coordinates: [21.1440, 79.0915],
    reportedTimeAgo: '5h ago',
    impactScore: -6,
    severity: 'moderate',
    distanceToRouteMeters: 480,
    description: 'Metro line construction barricades limiting sightlines. No foot traffic after 9:00 PM.',
    verifiedCount: 12,
  },
  {
    id: 'inc-6',
    title: 'Blind Turn / Overgrown Foliage',
    category: 'other',
    coordinates: [21.1598, 79.0860],
    reportedTimeAgo: '1d ago',
    impactScore: -5,
    severity: 'low',
    distanceToRouteMeters: 290,
    description: 'Low visibility corner due to unpruned banyan branches hanging into the roadway.',
    verifiedCount: 6,
  },
  {
    id: 'inc-7',
    title: 'Minor Vehicle Accident & Spilled Gravel',
    category: 'accident',
    coordinates: [21.1480, 79.0810],
    reportedTimeAgo: '30m ago',
    impactScore: -4,
    severity: 'low',
    distanceToRouteMeters: 220,
    description: 'Two-wheeler skid incident, loose construction gravel on left shoulder. Slow down.',
    verifiedCount: 19,
  }
];

// Heatmap points: [latitude, longitude, intensity (0.0 to 1.0)]
// Higher intensity = elevated risk area (warmer yellow/red)
// Lower intensity = calm safe area
export interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number; // 0 (calm) to 1 (high risk)
  type: 'risk' | 'haven' | 'neutral';
}

export const DEMO_HEAT_POINTS: HeatPoint[] = [
  // High Risk cluster along railway back alleys & underpasses (Mohan Nagar)
  { lat: 21.1528, lng: 79.0905, intensity: 0.88, type: 'risk' },
  { lat: 21.1535, lng: 79.0898, intensity: 0.82, type: 'risk' },
  { lat: 21.1542, lng: 79.0888, intensity: 0.79, type: 'risk' },
  { lat: 21.1582, lng: 79.0838, intensity: 0.92, type: 'risk' },
  { lat: 21.1575, lng: 79.0845, intensity: 0.85, type: 'risk' },
  { lat: 21.1508, lng: 79.0925, intensity: 0.90, type: 'risk' },
  { lat: 21.1555, lng: 79.0892, intensity: 0.75, type: 'risk' },
  { lat: 21.1440, lng: 79.0915, intensity: 0.65, type: 'risk' },

  // Moderate clusters
  { lat: 21.1480, lng: 79.0810, intensity: 0.45, type: 'risk' },
  { lat: 21.1598, lng: 79.0860, intensity: 0.50, type: 'risk' },
  { lat: 21.1640, lng: 79.0820, intensity: 0.40, type: 'risk' },

  // Safe Green clusters (Safe Havens & Arterial Boulevard)
  { lat: 21.1465, lng: 79.0845, intensity: 0.12, type: 'haven' }, // Sitabuldi Police
  { lat: 21.1502, lng: 79.0834, intensity: 0.10, type: 'haven' }, // RBI Square
  { lat: 21.1538, lng: 79.0812, intensity: 0.15, type: 'haven' }, // Vidhan Bhavan
  { lat: 21.1578, lng: 79.0805, intensity: 0.14, type: 'haven' }, // Apollo Pharmacy
  { lat: 21.1635, lng: 79.0765, intensity: 0.12, type: 'haven' }, // Sadar Police
  { lat: 21.1520, lng: 79.0820, intensity: 0.18, type: 'haven' }, // Reliance Smart
];
