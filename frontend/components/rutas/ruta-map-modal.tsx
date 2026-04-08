'use client';

import { X, Navigation, Route, Clock } from 'lucide-react';
import type { Ruta } from '@/types/ruta';
import dynamic from 'next/dynamic';

const MapRoute = dynamic(() => import('@/components/rutas/map-route'), { ssr: false });

interface RutaMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  ruta: Ruta | null;
}

export function RutaMapModal({ isOpen, onClose, ruta }: RutaMapModalProps) {
  if (!isOpen || !ruta) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[85vh] rounded-2xl bg-card shadow-2xl border border-border/50 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col">
        
        {/* Header Elegante */}
        <div className="flex items-center justify-between bg-primary/5 px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Ruta: {ruta.nombre || 'Desconocida'}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Route className="w-3.5 h-3.5" /> OSRM Distancia: {ruta.distancia_km} km
                </span>
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> IA ETA: {ruta.duracion_minutos} min
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Mapa Embebido */}
        <div className="flex-1 w-full bg-muted/20 relative z-0">
          <MapRoute 
            origin={ruta.origen_lat && ruta.origen_lng ? { lat: ruta.origen_lat, lng: ruta.origen_lng } : null}
            destinations={ruta.destino_lat && ruta.destino_lng ? [{ lat: ruta.destino_lat, lng: ruta.destino_lng, name: ruta.destino }] : []}
            encodedPolyline={ruta.observaciones || undefined}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-card flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
          >
            Cerrar Visor
          </button>
        </div>

      </div>
    </div>
  );
}
