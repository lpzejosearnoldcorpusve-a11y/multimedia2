'use client';

import { Map as MapIcon, Route, Clock, Navigation } from 'lucide-react';
import type { Ruta } from '@/types/ruta';

interface RutasTableProps {
  data: Ruta[];
  onViewMap: (ruta: Ruta) => void;
}

export function RutasTable({ data, onViewMap }: RutasTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-4 rounded-xl border border-dashed border-border bg-card/50 text-center animate-in fade-in">
        <MapIcon className="w-10 h-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground">No hay rutas registradas</h3>
        <p className="text-muted-foreground mt-2">Utiliza el Planificador IA para generar y guardar tu primer viaje.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-6 py-4 font-medium">Nombre de la Ruta</th>
              <th className="px-6 py-4 font-medium">Trayecto</th>
              <th className="px-6 py-4 font-medium">Parámetros IA</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((ruta) => (
              <tr key={ruta.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-semibold text-foreground">
                  {ruta.nombre || 'Ruta sin nombre'}
                </td>
                <td className="px-6 py-4 text-foreground">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-green-600 dark:text-green-500 uppercase tracking-tighter">Origen:</span>
                    <span className="truncate max-w-[200px] block font-medium" title={ruta.origen}>{ruta.origen}</span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-tighter mt-1">Destino Final:</span>
                    <span className="truncate max-w-[200px] block font-medium" title={ruta.destino}>{ruta.destino}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2"><Route className="w-4 h-4 text-blue-500" /> {ruta.distancia_km ? `${ruta.distancia_km} km` : 'N/A'}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" /> {ruta.duracion_minutos ? `${ruta.duracion_minutos} min (ETA)` : 'N/A'}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${
                    ruta.estado === 'Planificada' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800' :
                    ruta.estado === 'En Curso' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200'
                  }`}>
                    {ruta.estado || 'No definido'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onViewMap(ruta)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-primary bg-primary/10 hover:bg-primary/20 hover:scale-105 active:scale-95 rounded-lg transition-all font-semibold"
                    title="Ver Mapa de Ruta"
                  >
                    <Navigation className="w-4 h-4" /> <span className="hidden sm:inline">Visualizar Ruta</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
