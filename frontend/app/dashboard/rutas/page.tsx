'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRutas } from '@/hooks/use-rutas';
import { useRutasCrud } from '@/hooks/use-rutas-crud';
import { Map, MapPinned, Zap, Clock, Route as RouteIcon, Compass, CheckCircle2, List, Settings2 } from 'lucide-react';
import { RutasTable } from '@/components/rutas/rutas-table';
import { RutaMapModal } from '@/components/rutas/ruta-map-modal';
import type { Ruta } from '@/types/ruta';

// Cargar el mapa dinámicamente sin SSR
const MapRoute = dynamic(() => import('@/components/rutas/map-route'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted/20 animate-pulse flex items-center justify-center rounded-2xl border border-dashed border-border">
      <div className="flex flex-col items-center text-muted-foreground gap-2">
        <Map className="h-8 w-8 animate-bounce" />
        <p className="text-sm font-medium">Cargando OpenStreetMap...</p>
      </div>
    </div>
  )
});

const DEMO_WAYPOINTS = [
  { lat: -16.500, lng: -68.150, name: "Almacén Central" },
  { lat: -16.510, lng: -68.130, name: "Cliente A (Miraflores)" },
  { lat: -16.495, lng: -68.125, name: "Cliente B (Sopocachi)" },
  { lat: -16.520, lng: -68.115, name: "Cliente C (Obrajes)" }
];

export default function RutasPage() {
  const [activeTab, setActiveTab] = useState<'lista' | 'planificador'>('lista');

  // Hooks de datos
  const { isOptimizing, optimizationResult, optimizeRoute, clearResult } = useRutas();
  const { rutas, isLoading: isLoadingRutas, crearRuta } = useRutasCrud();
  
  // Estado local del mapa interactivo
  const [origin, setOrigin] = useState(DEMO_WAYPOINTS[0]);
  const [destinations, setDestinations] = useState(DEMO_WAYPOINTS.slice(1));
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado para la animación dramática de la IA
  const [isSimulatingAI, setIsSimulatingAI] = useState(false);

  // Estados visuales Modal 
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);

  const handleOptimize = async () => {
    try {
      setIsSimulatingAI(true);
      await optimizeRoute(origin, destinations);
      
      // Delay dramático para permitir que la animación de "pensamiento" se vea
      setTimeout(() => {
        setIsSimulatingAI(false);
      }, 3000); // 3 segundos de show visual

    } catch (e) {
      alert("Error llamando a la IA");
      setIsSimulatingAI(false);
    }
  };

  const handleReset = () => {
    clearResult();
    setOrigin(DEMO_WAYPOINTS[0]);
    setDestinations(DEMO_WAYPOINTS.slice(1));
  };

  const handleSaveRoute = async () => {
    if (!optimizationResult) return;
    setIsSaving(true);
    try {
      const finalDest = optimizationResult.ordered_destinations[optimizationResult.ordered_destinations.length - 1];
      
      const nuevaData: Partial<Ruta> = {
        nombre: `Ruta Óptima IA - ${new Date().toISOString().split('T')[0]}`,
        origen: "Almacén Central", // En producción saldría del form real
        origen_lat: optimizationResult.origin.lat,
        origen_lng: optimizationResult.origin.lng,
        destino: finalDest.name || "Destino Multiparada",
        destino_lat: finalDest.lat,
        destino_lng: finalDest.lng,
        distancia_km: optimizationResult.distance_km,
        duracion_minutos: optimizationResult.ml_eta_minutes,
        estado: 'Planificada',
        observaciones: optimizationResult.polyline // Guardamos el trazado geométrico
      };

      await crearRuta(nuevaData);
      alert("Ruta insertada dinámicamente en la base de datos Neon.");
      setActiveTab('lista'); // Saltar de regreso a la lista
    } catch(e) {
      alert("Error al guardar la ruta en DB.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-6 p-4 md:p-6 animate-in fade-in duration-500 bg-background/50 overflow-y-auto w-full">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2 text-foreground">
            <Compass className="h-8 w-8 text-primary" />
            Centro Logístico IA
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Administra tus rutas históricas y planifica envíos dinámicos.
          </p>
        </div>

        <div className="flex p-1 bg-muted rounded-xl shadow-inner max-w-sm">
          <button
            onClick={() => setActiveTab('lista')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-sm transition-all ${activeTab === 'lista' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <List className="w-4 h-4" /> Historial de Rutas
          </button>
          <button
            onClick={() => setActiveTab('planificador')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-sm transition-all ${activeTab === 'planificador' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Settings2 className="w-4 h-4" /> Planificador IA
          </button>
        </div>
      </div>

      {/* CONTENIDO PESTAÑA: LISTA */}
      {activeTab === 'lista' && (
        <div className="flex-1 flex flex-col gap-4 max-w-7xl">
          {isLoadingRutas ? (
            <div className="flex justify-center p-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
             <RutasTable 
               data={rutas} 
               onViewMap={(ruta) => setSelectedRuta(ruta)} 
             />
          )}

          {/* Modal de Mapa */}
          <RutaMapModal 
            isOpen={selectedRuta !== null} 
            onClose={() => setSelectedRuta(null)} 
            ruta={selectedRuta} 
          />
        </div>
      )}

      {/* CONTENIDO PESTAÑA: PLANIFICADOR IA */}
      {activeTab === 'planificador' && (
        <div className="flex-1 flex flex-col md:flex-row gap-6 h-full pb-4">
          <div className="w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Puntos Ingresados</h4>
                
                <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-700 dark:text-green-400">
                  <MapPinned className="h-5 w-5" />
                  <div>
                    <p className="text-xs font-bold uppercase opacity-80">Origen (A)</p>
                    <p className="text-sm font-medium">{origin.name}</p>
                  </div>
                </div>

                <div className="pl-6 border-l-2 border-dashed border-muted ml-2 py-2 space-y-2">
                  {destinations.map((dest, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {i+1}
                      </div>
                      <p className="text-sm font-medium">{dest.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex gap-2">
                {!optimizationResult ? (
                  <button 
                    onClick={handleOptimize}
                    disabled={isOptimizing || isSimulatingAI}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground p-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] hover:bg-primary/90 transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    {(isOptimizing || isSimulatingAI) ? (
                      <><span className="animate-spin text-xl">⚙️</span> Procesando... </>
                    ) : (
                      <><Zap className="h-5 w-5" /> Optimizar Inteligencia</>
                    )}
                  </button>
                ) : (
                  <button 
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 bg-muted text-foreground p-3 rounded-lg font-bold hover:bg-muted/80 transition-all"
                  >
                    Limpiar Mapa
                  </button>
                )}
              </div>
            </div>

            {/* Resultados y Botón de Salvado */}
            {(optimizationResult && !isSimulatingAI) && (
              <div className="bg-primary/5 rounded-xl border border-primary/20 p-5 shadow-inner space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Ruta Óptima Calculada
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background border border-border p-3 rounded-lg flex flex-col items-center text-center">
                    <RouteIcon className="h-5 w-5 text-blue-500 mb-1" />
                    <span className="text-xs text-muted-foreground font-medium">Distancia</span>
                    <span className="text-lg font-black text-blue-600">{optimizationResult.distance_km} km</span>
                  </div>
                  <div className="bg-background border border-border p-3 rounded-lg flex flex-col items-center text-center">
                    <Clock className="h-5 w-5 text-orange-500 mb-1" />
                    <span className="text-xs text-muted-foreground font-medium">ETA Predictivo</span>
                    <span className="text-lg font-black text-orange-600">{optimizationResult.ml_eta_minutes} min</span>
                  </div>
                </div>

                <button 
                  onClick={handleSaveRoute}
                  disabled={isSaving}
                  className="w-full bg-background border-2 border-primary text-primary font-bold p-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all shadow-md active:scale-95 disabled:opacity-50"
                  title="Almacena la ruta, polilínea geométrica y cálculos directos en Neon"
                >
                  {isSaving ? 'Guardando en BD...' : 'Guardar Viaje en BD'}
                </button>
              </div>
            )}
          </div>

          <div className="w-full md:w-2/3 h-[500px] md:h-full rounded-2xl border border-border shadow-sm overflow-hidden">
            <MapRoute 
              origin={(!isSimulatingAI && optimizationResult) ? optimizationResult.origin : origin}
              destinations={(!isSimulatingAI && optimizationResult) ? optimizationResult.ordered_destinations : destinations}
              encodedPolyline={(!isSimulatingAI && optimizationResult) ? optimizationResult.polyline : undefined}
              aiThinking={isSimulatingAI}
            />
          </div>
        </div>
      )}
    </div>
  );
}
