import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  USER_START_LOCATION, 
  DEMO_DESTINATION, 
  FASTEST_ROUTE_COORDS, 
  SAFER_ROUTE_COORDS,
  DEMO_ROUTES 
} from '../../data/nagpurRoutes';
import { INITIAL_SAFE_HAVENS } from '../../data/safeHavens';
import { INITIAL_INCIDENTS, DEMO_HEAT_POINTS, HeatPoint } from '../../data/incidentHistory';
import { SafeHaven, IncidentSignal, LatLngTuple } from '../../types/safety';

interface SafeSafarMapProps {
  isNightMode: boolean;
  showHeatmap: boolean;
  showSafeHavens: boolean;
  showIncidents: boolean;
  selectedRouteId: 'fastest' | 'safer';
  analysisMode: boolean;
  isScanning: boolean;
  flyToTarget: { coords: LatLngTuple; zoom: number; timestamp: number } | null;
  onSelectIncident?: (incident: IncidentSignal) => void;
  onSelectSafeHaven?: (haven: SafeHaven) => void;
  activeSegmentHighlightId?: string | null;
  userIncidents?: IncidentSignal[];
}

export const SafeSafarMap: React.FC<SafeSafarMapProps> = ({
  isNightMode,
  showHeatmap,
  showSafeHavens,
  showIncidents,
  selectedRouteId,
  analysisMode,
  isScanning,
  flyToTarget,
  onSelectIncident,
  onSelectSafeHaven,
  activeSegmentHighlightId,
  userIncidents = [],
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  
  // Layer Groups for clean management
  const heatLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const safeHavenGroupRef = useRef<L.LayerGroup | null>(null);
  const incidentGroupRef = useRef<L.LayerGroup | null>(null);
  const routesGroupRef = useRef<L.LayerGroup | null>(null);
  const highlightGroupRef = useRef<L.LayerGroup | null>(null);

  // Progressive drawing animation refs
  const fastestPolylineRef = useRef<L.Polyline | null>(null);
  const saferPolylineRef = useRef<L.Polyline | null>(null);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [21.1530, 79.0835], // Centered right between Sitabuldi & Sadar
      zoom: 15,
      minZoom: 13,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    });

    // Custom positioned zoom control
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initial Tile Layer
    const tileUrl = isNightMode 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Initialize layer groups
    heatLayerGroupRef.current = L.layerGroup().addTo(map);
    safeHavenGroupRef.current = L.layerGroup().addTo(map);
    incidentGroupRef.current = L.layerGroup().addTo(map);
    routesGroupRef.current = L.layerGroup().addTo(map);
    highlightGroupRef.current = L.layerGroup().addTo(map);

    // Add Start Location Pulse Marker
    const startIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-8 h-8 rounded-full bg-cyan-500/20 beacon-pulse"></div>
          <div class="absolute w-5 h-5 rounded-full bg-sky-500/40 animate-ping"></div>
          <div class="relative w-4 h-4 rounded-full bg-sky-400 border-2 border-white shadow-[0_0_12px_rgba(14,165,233,0.8)] flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const startMarker = L.marker(USER_START_LOCATION, { icon: startIcon }).addTo(map);
    startMarker.bindPopup(`
      <div class="p-2 text-xs">
        <div class="font-mono text-emerald-400 uppercase tracking-wider text-[10px]">Your Current Location</div>
        <div class="font-bold text-sm text-white">Nagpur Central / Zero Mile</div>
        <div class="text-slate-300 text-[11px] mt-0.5">Sitabuldi Interchange Area</div>
        <div class="mt-2 flex items-center gap-1 text-[11px] text-emerald-400">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Safety beacon broadcasting</span>
        </div>
      </div>
    `);

    // Add Destination Marker
    const destIcon = L.divIcon({
      className: 'custom-dest-marker',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="w-6 h-6 rounded-lg bg-emerald-500 border border-white text-slate-950 flex items-center justify-center font-bold text-xs shadow-[0_0_16px_rgba(16,185,129,0.8)]">
            🏁
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const destMarker = L.marker(DEMO_DESTINATION, { icon: destIcon }).addTo(map);
    destMarker.bindPopup(`
      <div class="p-2 text-xs">
        <div class="font-mono text-emerald-400 uppercase tracking-wider text-[10px]">Destination</div>
        <div class="font-bold text-sm text-white">Sadar Commercial Concourse</div>
        <div class="text-slate-300 text-[11px] mt-0.5">Residency Road, Mount Rd</div>
      </div>
    `);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle Day / Night Tile Swap
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const tileUrl = isNightMode 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    tileLayerRef.current.setUrl(tileUrl);
  }, [isNightMode]);

  // 3. Render / Animate Routes
  useEffect(() => {
    if (!routesGroupRef.current) return;
    routesGroupRef.current.clearLayers();

    const isFastestSelected = selectedRouteId === 'fastest';

    // Fastest Route Polyline
    const fastestPolyline = L.polyline(FASTEST_ROUTE_COORDS, {
      color: isFastestSelected ? '#f59e0b' : '#d97706',
      weight: isFastestSelected ? 6 : 4,
      opacity: isFastestSelected ? 0.95 : 0.35,
      dashArray: isFastestSelected ? undefined : '6, 8',
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(routesGroupRef.current);

    // Add glowing stroke under active fastest route
    if (isFastestSelected) {
      L.polyline(FASTEST_ROUTE_COORDS, {
        color: '#f59e0b',
        weight: 12,
        opacity: 0.25,
      }).addTo(routesGroupRef.current);
    }

    fastestPolyline.on('click', () => {
      // route clicked
    });

    // Safer Route Polyline
    const saferPolyline = L.polyline(SAFER_ROUTE_COORDS, {
      color: !isFastestSelected ? '#10b981' : '#059669',
      weight: !isFastestSelected ? 7 : 4,
      opacity: !isFastestSelected ? 1.0 : 0.35,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(routesGroupRef.current);

    // Glowing halo under active safer route
    if (!isFastestSelected) {
      L.polyline(SAFER_ROUTE_COORDS, {
        color: '#10b981',
        weight: 16,
        opacity: 0.22,
      }).addTo(routesGroupRef.current);
      
      // Animated inner dash flow
      const innerFlow = L.polyline(SAFER_ROUTE_COORDS, {
        color: '#ffffff',
        weight: 2,
        opacity: 0.8,
        dashArray: '8, 16',
        className: 'route-flowing',
      }).addTo(routesGroupRef.current);
    }

    fastestPolylineRef.current = fastestPolyline;
    saferPolylineRef.current = saferPolyline;

  }, [selectedRouteId]);

  // 4. Render Safety Heatmap Layer
  useEffect(() => {
    if (!heatLayerGroupRef.current) return;
    heatLayerGroupRef.current.clearLayers();

    if (!showHeatmap) return;

    DEMO_HEAT_POINTS.forEach((pt: HeatPoint) => {
      const isHaven = pt.type === 'haven';
      const color = isHaven ? '#10b981' : pt.intensity > 0.7 ? '#ef4444' : '#f59e0b';
      const radius = isHaven ? 140 : 180 + pt.intensity * 100;
      const opacity = isHaven ? 0.18 : 0.24 + pt.intensity * 0.15;

      // Outer diffuse circle
      L.circle([pt.lat, pt.lng], {
        radius: radius,
        color: 'transparent',
        fillColor: color,
        fillOpacity: opacity,
        stroke: false,
      }).addTo(heatLayerGroupRef.current!);

      // Inner concentrated core
      L.circle([pt.lat, pt.lng], {
        radius: radius * 0.45,
        color: 'transparent',
        fillColor: color,
        fillOpacity: opacity * 1.6,
        stroke: false,
      }).addTo(heatLayerGroupRef.current!);
    });
  }, [showHeatmap]);

  // 5. Render Safe Havens
  useEffect(() => {
    if (!safeHavenGroupRef.current) return;
    safeHavenGroupRef.current.clearLayers();

    if (!showSafeHavens) return;

    INITIAL_SAFE_HAVENS.forEach((haven) => {
      const getHavenIcon = (type: string) => {
        switch (type) {
          case 'police': return '👮';
          case 'hospital': return '🏥';
          case 'store247': return '🏪';
          case 'petrol': return '⛽';
          case 'pharmacy': return '💊';
          default: return '🛡️';
        }
      };

      const icon = L.divIcon({
        className: 'safe-haven-marker',
        html: `
          <div class="relative group cursor-pointer transition-transform hover:scale-125">
            <div class="absolute -inset-1 rounded-full bg-emerald-500/30 pulse-low"></div>
            <div class="relative w-7 h-7 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center text-xs shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              ${getHavenIcon(haven.type)}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(haven.coordinates, { icon }).addTo(safeHavenGroupRef.current!);
      marker.on('click', () => {
        onSelectSafeHaven?.(haven);
      });

      marker.bindPopup(`
        <div class="p-2 min-w-[200px]">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Verified Safe Haven
            </span>
            <span class="text-[10px] text-slate-400 font-mono">${haven.distanceMeters}m</span>
          </div>
          <div class="font-bold text-sm text-white mt-1.5">${haven.name}</div>
          <div class="text-xs text-slate-300 mt-0.5">${haven.address}</div>
          <div class="mt-2 text-[11px] text-slate-400 italic">${haven.notes}</div>
          <div class="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span class="text-emerald-400 font-medium">● 24/7 Monitored</span>
            <span class="text-sky-400 font-mono">${haven.emergencyPhone}</span>
          </div>
        </div>
      `);
    });
  }, [showSafeHavens, onSelectSafeHaven]);

  // 6. Render Incidents (Initial + User Submitted)
  useEffect(() => {
    if (!incidentGroupRef.current) return;
    incidentGroupRef.current.clearLayers();

    if (!showIncidents) return;

    const allIncidents = [...userIncidents, ...INITIAL_INCIDENTS];

    allIncidents.forEach((inc) => {
      const isElevated = inc.severity === 'elevated';
      const borderCol = isElevated ? 'border-rose-500 text-rose-400' : 'border-amber-500 text-amber-400';
      const shadowCol = isElevated ? 'rgba(244,63,94,0.6)' : 'rgba(245,158,11,0.5)';
      const pulseClass = isElevated ? 'pulse-high' : 'pulse-low';

      const getCatIcon = (cat: string) => {
        switch (cat) {
          case 'lighting': return '💡';
          case 'harassment': return '🚨';
          case 'accident': return '🚗';
          case 'suspicious': return '👤';
          case 'deserted': return '🚧';
          default: return '⚠️';
        }
      };

      const icon = L.divIcon({
        className: 'incident-marker',
        html: `
          <div class="relative group cursor-pointer transition-transform hover:scale-125">
            <div class="absolute -inset-1 rounded-full ${isElevated ? 'bg-rose-500/40' : 'bg-amber-500/40'} ${pulseClass}"></div>
            <div class="relative w-6 h-6 rounded-full bg-slate-950 border-2 ${borderCol} flex items-center justify-center text-[10px] shadow-[0_0_12px_${shadowCol}]">
              ${getCatIcon(inc.category)}
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(inc.coordinates, { icon }).addTo(incidentGroupRef.current!);
      marker.on('click', () => {
        onSelectIncident?.(inc);
      });

      marker.bindPopup(`
        <div class="p-2 min-w-[210px]">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-mono uppercase tracking-wider ${isElevated ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'} px-1.5 py-0.5 rounded border">
              ${isElevated ? '🔴 ELEVATED RISK SIGNAL' : '🟡 MODERATE RISK SIGNAL'}
            </span>
            <span class="text-[10px] text-slate-400 font-mono">${inc.reportedTimeAgo}</span>
          </div>
          <div class="font-bold text-sm text-white mt-1.5">${inc.title}</div>
          <div class="text-xs text-slate-300 mt-1">${inc.description}</div>
          <div class="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span class="font-mono ${isElevated ? 'text-rose-400' : 'text-amber-400'}">Impact: ${inc.impactScore} safety pts</span>
            <span class="text-slate-400 text-[11px]">Route: ${inc.distanceToRouteMeters}m away</span>
          </div>
        </div>
      `);
    });
  }, [showIncidents, userIncidents, onSelectIncident]);

  // 7. Handle Analysis Mode Segment Highlighting
  useEffect(() => {
    if (!highlightGroupRef.current) return;
    highlightGroupRef.current.clearLayers();

    if (!analysisMode) return;

    // Highlight the active route segments with clear badges
    const currentRoute = DEMO_ROUTES[selectedRouteId];
    currentRoute.segments.forEach((seg) => {
      const isSegSelected = activeSegmentHighlightId === seg.id;
      const isSafe = seg.safetyType === 'safe';

      const color = isSafe ? '#10b981' : '#ef4444';
      const weight = isSegSelected ? 9 : 6;

      L.polyline(seg.coordinates, {
        color: color,
        weight: weight,
        opacity: 0.95,
        dashArray: isSafe ? undefined : '5, 8',
      }).addTo(highlightGroupRef.current!);

      // Midpoint callout
      const midLat = (seg.coordinates[0][0] + seg.coordinates[seg.coordinates.length - 1][0]) / 2;
      const midLng = (seg.coordinates[0][1] + seg.coordinates[seg.coordinates.length - 1][1]) / 2;

      const badgeIcon = L.divIcon({
        className: 'segment-label-badge',
        html: `
          <div class="px-2 py-0.5 rounded text-[10px] font-mono tracking-tight whitespace-nowrap shadow-lg border ${
            isSafe 
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40' 
              : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
          }">
            ${isSafe ? '✓ High Luminaire & CCTV' : '⚠️ Low Luminaire Alert'}
          </div>
        `,
        iconAnchor: [40, 10],
      });

      L.marker([midLat, midLng], { icon: badgeIcon }).addTo(highlightGroupRef.current!);
    });
  }, [analysisMode, selectedRouteId, activeSegmentHighlightId]);

  // 8. Handle Fly-To Camera Navigation
  useEffect(() => {
    if (!flyToTarget || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(flyToTarget.coords, flyToTarget.zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [flyToTarget]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Leaflet container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Radar scanning animation overlay */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden flex items-center justify-center">
          {/* Sweeping radar cone */}
          <div className="w-[800px] h-[800px] rounded-full border border-emerald-500/30 animate-radar-sweep bg-[conic-gradient(from_0deg,transparent_0deg,rgba(16,185,129,0.18)_25deg,transparent_30deg)]" />
          {/* Concentric scan rings */}
          <div className="absolute w-[300px] h-[300px] rounded-full border border-sky-400/30 animate-ping opacity-30" />
          <div className="absolute w-[600px] h-[600px] rounded-full border border-emerald-400/20 animate-pulse opacity-40" />
          
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/50 backdrop-blur-md text-xs font-mono text-emerald-300 flex items-center gap-2 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="tracking-widest uppercase">Autonomous Route Safety Radar Active</span>
          </div>
        </div>
      )}

      {/* Map watermark / coordinate telemetry */}
      <div className="absolute bottom-6 left-4 z-10 pointer-events-none hidden md:flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
        <span className="text-emerald-400 font-semibold">NAGPUR MESH</span>
        <span>21.1530° N, 79.0835° E</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300">LIVE SENSORS: 48</span>
      </div>
    </div>
  );
};
