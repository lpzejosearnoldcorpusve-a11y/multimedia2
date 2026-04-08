'use client';

import { Edit3, Trash2 } from 'lucide-react';
import type { Vehiculo } from '@/types/vehiculo';

interface VehiculosTableProps {
  data: Vehiculo[];
  onEdit: (vehiculo: Vehiculo) => void;
  onDelete: (id: string) => void;
}

export function VehiculosTable({ data, onEdit, onDelete }: VehiculosTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-4 rounded-xl border border-dashed border-border bg-card/50 text-center">
        <h3 className="text-lg font-semibold text-foreground">No hay vehículos</h3>
        <p className="text-muted-foreground mt-2">No se encontraron vehículos que coincidan con la búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-6 py-4 font-medium">Placa</th>
              <th className="px-6 py-4 font-medium">Marca / Año</th>
              <th className="px-6 py-4 font-medium">Tipo</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((vehiculo) => (
              <tr key={vehiculo.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-semibold text-foreground">
                  {vehiculo.placa}
                </td>
                <td className="px-6 py-4 text-foreground">
                  <div className="font-medium">{vehiculo.marca}</div>
                  <div className="text-xs text-muted-foreground">{vehiculo.anio || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {vehiculo.tipo_vehiculo || 'No especificado'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    vehiculo.estado === 'Activo' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {vehiculo.estado || 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onEdit(vehiculo)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors mr-2"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(vehiculo.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
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
