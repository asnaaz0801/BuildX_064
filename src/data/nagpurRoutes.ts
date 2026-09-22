import { SafetyRoute, LatLngTuple } from '../types/safety';

export const USER_START_LOCATION: LatLngTuple = [21.1458, 79.0882]; // Nagpur Central / Zero Mile / Sitabuldi
export const DEMO_DESTINATION: LatLngTuple = [21.1625, 79.0788];   // Sadar Bazaar / Mount Road

// Fastest Route coordinates: Shorter but cuts through Mohan Nagar / Railway colony unlit alleys
export const FASTEST_ROUTE_COORDS: LatLngTuple[] = [
  [21.1458, 79.0882], // Zero Mile Start
  [21.1485, 79.0898], // Railway station approach
  [21.1518, 79.0910], // Unlit back alley 1
  [21.1545, 79.0885], // Narrow railway colony cut
  [21.1570, 79.0850], // Dark underpass connection
  [21.1595, 79.0815], // Mohan Nagar back road
  [21.1625, 79.0788], // Sadar Destination
];

// Safer Route coordinates: Slightly longer, stays on wide arterial VIP / Residency Rd with CCTV and streetlights
export const SAFER_ROUTE_COORDS: LatLngTuple[] = [
  [21.1458, 79.0882], // Zero Mile Start
  [21.1472, 79.0855], // Sitabuldi Police Station junction (Safe Haven 1)
  [21.1505, 79.0830], // RBI Square / Civil Lines Boulevard (Wide, brightly lit)
  [21.1538, 79.0812], // Vidhan Bhavan arterial avenue (High patrol density)
  [21.1575, 79.0800], // 24/7 MedPlus Pharmacy & Lit Commercial Strip (Safe Haven 2)
  [21.1605, 79.0792], // Sadar Residency Main Road
  [21.1625, 79.0788], // Sadar Destination
];

export const DEMO_ROUTES: Record<'fastest' | 'safer', SafetyRoute> = {
  fastest: {
    id: 'fastest',
    name: 'Fastest Route',
    tagline: 'Via Railway Colony Backway',
    distanceKm: 1.8,
    durationMin: 12,
    safetyScore: 62,
    safetyTier: 'moderate',
    summaryBadge: '🟠 Moderate Safety Signals',
    description: 'Direct route with 3 minutes saved, but crosses two low-visibility alleys and has zero verified safe havens along the direct path.',
    coordinates: FASTEST_ROUTE_COORDS,
    factors: {
      lighting: 48,
      pedestrianActivity: 52,
      incidentHistory: 58,
      safeHavens: 40,
      communitySignals: 65,
    },
    segments: [
      {
        id: 'fast-seg-1',
        name: 'Station Back-Alley',
        coordinates: [
          [21.1518, 79.0910],
          [21.1545, 79.0885],
        ],
        safetyType: 'risk',
        description: 'Poor street lighting reported 2h ago. Low footfall after 8:30 PM.',
        factorImpact: '-14 pts lighting penalty',
      },
      {
        id: 'fast-seg-2',
        name: 'Railway Colony Dark Underpass',
        coordinates: [
          [21.1570, 79.0850],
          [21.1595, 79.0815],
        ],
        safetyType: 'risk',
        description: 'Underpass with intermittent luminaire outages. Historical evening hazard.',
        factorImpact: '-12 pts incident history penalty',
      }
    ],
    keyAdvantages: [
      {
        id: 'fast-adv-1',
        title: '3 minutes quicker transit',
        description: 'Bypasses the Residency Road traffic signals during rush hours.',
        icon: 'Zap',
      }
    ],
    cautions: [
      '3 non-functional municipal streetlights on segment',
      'No 24/7 open commercial stores within 350 meters',
      'Lower community safety confidence rating after 9:00 PM',
    ]
  },
  safer: {
    id: 'safer',
    name: 'Safer Route (Recommended)',
    tagline: 'Via VIP Residency Corridor',
    distanceKm: 2.1,
    durationMin: 15,
    safetyScore: 88,
    safetyTier: 'lower-risk',
    summaryBadge: '🟢 Lower-risk Profile',
    description: 'Optimum safety profile. Follows high-luminaire arterial avenues with continuous pedestrian presence, 2 immediate safe havens, and police beat coverage.',
    coordinates: SAFER_ROUTE_COORDS,
    factors: {
      lighting: 92,
      pedestrianActivity: 78,
      incidentHistory: 84,
      safeHavens: 95,
      communitySignals: 82,
    },
    segments: [
      {
        id: 'safe-seg-1',
        name: 'Civil Lines Boulevard Corridor',
        coordinates: [
          [21.1472, 79.0855],
          [21.1538, 79.0812],
        ],
        safetyType: 'safe',
        description: 'Double-sided high mast LED lamps, continuous CCTV surveillance grid.',
        factorImpact: '+18 pts lighting & patrol',
      },
      {
        id: 'safe-seg-2',
        name: 'Residency Road Commercial Haven Zone',
        coordinates: [
          [21.1575, 79.0800],
          [21.1625, 79.0788],
        ],
        safetyType: 'safe',
        description: 'Well-lit active storefronts, 24/7 pharmacy, visible security personnel.',
        factorImpact: '+16 pts safe haven proximity',
      }
    ],
    keyAdvantages: [
      {
        id: 'safe-adv-1',
        title: 'Better street lighting (+14 pts)',
        description: 'Continuous 92% high-luminance streetlamps with zero reported outages in last 30 days.',
        icon: 'Sun',
        targetFocus: [21.1505, 79.0830],
        targetZoom: 16,
        segmentHighlightId: 'safe-seg-1',
      },
      {
        id: 'safe-adv-2',
        title: '2 safe havens nearby (+18 pts)',
        description: 'Directly passes Sitabuldi Police Station (150m) and Apollo 24/7 Chemist (80m).',
        icon: 'ShieldCheck',
        targetFocus: [21.1472, 79.0855],
        targetZoom: 17,
      },
      {
        id: 'safe-adv-3',
        title: 'Higher pedestrian activity (+11 pts)',
        description: 'Active commercial storefronts and regular transit stops maintain eye-on-the-street safety.',
        icon: 'Users',
        targetFocus: [21.1575, 79.0800],
        targetZoom: 16,
        segmentHighlightId: 'safe-seg-2',
      },
      {
        id: 'safe-adv-4',
        title: 'Lower incident density (-22% risk)',
        description: 'Only 1 minor incident reported in last 90 days versus 6 along the railway back-alleys.',
        icon: 'TrendingDown',
        targetFocus: [21.1538, 79.0812],
        targetZoom: 15,
      },
      {
        id: 'safe-adv-5',
        title: 'Active Police patrol post (+12 pts)',
        description: 'Dedicated PCR vehicle presence stationed 24/7 at RBI Square intersection.',
        icon: 'BadgeAlert',
        targetFocus: [21.1472, 79.0855],
        targetZoom: 17,
      },
    ],
    cautions: [
      '+3 minutes longer travel time due to pedestrian crossing zones',
      'Moderate vehicle traffic between 6:00 PM and 8:30 PM',
    ]
  }
};
