'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import polylineUtil from 'polyline';

// Corregir iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícono personalizado Animado (Pulsante)
const createNumberedIcon = (num: number) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div class="marker-pulse-container"><div class="marker-pulse-circle bg-blue-500"></div><div class="marker-pulse-ring border-blue-400"></div><span class="marker-number">${num}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const OriginIcon = L.divIcon({
  className: 'custom-origin-icon',
  html: `<div class="marker-pulse-container"><div class="marker-pulse-circle bg-green-500 scale-125"></div><div class="marker-pulse-ring border-green-400"></div><span class="marker-number">A</span></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

interface MapRouteProps {
  origin: { lat: number; lng: number } | null;
  destinations: Array<{ lat: number; lng: number; name?: string }>;
  encodedPolyline?: string;
  aiThinking?: boolean;
}

// Componente para redimensionar y centrar el mapa automáticamente
function MapBounder({ origin, destinations, encodedPolyline }: MapRouteProps) {
  const map = useMap();
  useEffect(() => {
    if (origin) {
      const bounds = L.latLngBounds([origin.lat, origin.lng], [origin.lat, origin.lng]);
      destinations.forEach(d => bounds.extend([d.lat, d.lng]));
      
      if (encodedPolyline) {
        try {
          const decoded = polylineUtil.decode(encodedPolyline);
          decoded.forEach(p => bounds.extend([p[0], p[1]]));
        } catch(e){}
      }
      
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, origin, destinations, encodedPolyline]);
  return null;
}

export default function MapRoute({ origin, destinations, encodedPolyline, aiThinking }: MapRouteProps) {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  useEffect(() => {
    // Si la IA está "pensando", mostramos simulaciones caóticas
    if (aiThinking && origin && destinations.length > 0) {
      const intervalId = setInterval(() => {
        // Mezclar aleatoriamente el array (simulando búsqueda Heurística/Genética)
        const shuffled = [...destinations].sort(() => Math.random() - 0.5);
        const randomPath: [number, number][] = [
          [origin.lat, origin.lng],
          ...shuffled.map(d => [d.lat, d.lng] as [number, number])
        ];
        // Retornar a casa para cerrar el loop
        randomPath.push([origin.lat, origin.lng]);
        setRouteCoordinates(randomPath);
      }, 150); // Mueve los rayos rojos cada 150ms
      
      return () => clearInterval(intervalId);
    } 

    // Si ya hay IA resuelta
    if (encodedPolyline) {
      setRouteCoordinates(polylineUtil.decode(encodedPolyline) as [number, number][]);
    } else {
      // Si no hay IA, dibuja líneas rectas entre puntos (Conexión de Puntos)
      if (origin && destinations.length > 0) {
        const straightLine: [number, number][] = [
          [origin.lat, origin.lng],
          ...destinations.map(d => [d.lat, d.lng] as [number, number])
        ];
        setRouteCoordinates(straightLine);
      } else {
        setRouteCoordinates([]);
      }
    }
  }, [encodedPolyline, origin, destinations]);

  const defaultCenter: [number, number] = [-16.5, -68.15]; // La Paz, Bolivia aprox

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-border relative">
      {/* CSS Inyectado para animaciones UX PRO */}
      <style dangerouslySetInnerHTML={{__html: `
        .marker-pulse-container {
          position: relative;
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
        }
        .marker-pulse-circle {
          position: absolute; width: 100%; height: 100%; border-radius: 50%;
          border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); z-index: 2;
        }
        .marker-pulse-ring {
          position: absolute; width: 100%; height: 100%; border-radius: 50%;
          border-width: 2px; border-style: solid;
          animation: map-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; z-index: 1;
        }
        .marker-number {
          position: relative; z-index: 3; color: white; font-weight: 900; font-size: 14px; text-shadow: 0px 1px 2px rgba(0,0,0,0.8);
        }
        @keyframes map-ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
        .glowing-route {
          /* RUTA ÓPTIMA GANADORA (VERDE FÓSFORO) */
          filter: drop-shadow(0 0 10px rgba(74, 222, 128, 0.9)) drop-shadow(0 0 25px rgba(34, 197, 94, 0.8));
          animation: map-dash-flow 1.5s linear infinite;
        }
        .unoptimized-route {
          opacity: 0.5;
          animation: map-dash-flow 3s linear infinite reverse;
        }
        .thinking-route {
          /* RUTAS MENTALES DE LA IA (ROJO FUEGO / FALLIDOS) */
          filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.8));
          animation: explode-flash 0.15s infinite alternate;
        }
        @keyframes explode-flash {
          0% { opacity: 0.6; stroke-width: 4; }
          100% { opacity: 1; stroke-width: 7; }
        }
        @keyframes map-dash-flow {
          to { stroke-dashoffset: -30; }
        }
      `}} />

      <MapContainer 
        center={origin ? [origin.lat, origin.lng] : defaultCenter} 
        zoom={14} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Modo Neón (Dark Matter)">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer checked name="Vista Satelital 3D">
            <TileLayer
              attribution='Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={18}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="OSM Standard (Claro)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {origin && (
          <Marker position={[origin.lat, origin.lng]} icon={OriginIcon}>
            <Popup><strong>Punto de Partida (A)</strong></Popup>
          </Marker>
        )}

        {destinations.map((dest, idx) => (
          <Marker 
            key={idx} 
            position={[dest.lat, dest.lng]} 
            icon={createNumberedIcon(idx + 1)}
          >
            <Popup>
              <strong>Parada {idx + 1}</strong>
              {dest.name && <><br/>{dest.name}</>}
            </Popup>
          </Marker>
        ))}

        {routeCoordinates.length > 0 && (
          <Polyline 
            positions={routeCoordinates} 
            pathOptions={{ 
              color: aiThinking ? '#ef4444' : encodedPolyline ? '#4ade80' : '#cbd5e1', // Red -> Green -> Gray 
              weight: aiThinking ? 4 : encodedPolyline ? 7 : 4, 
              opacity: 0.9, 
              lineCap: 'round', 
              lineJoin: 'round',
              dashArray: aiThinking ? '10 20' : encodedPolyline ? '15, 15' : '10, 10' 
            }}
            className={aiThinking ? "thinking-route" : encodedPolyline ? "glowing-route" : "unoptimized-route"} 
          />
        )}

        <MapBounder origin={origin} destinations={destinations} encodedPolyline={encodedPolyline} />
      </MapContainer>
    </div>
  );
}
