'use client';

import { useState } from 'react';
import { useVehiculos } from '@/hooks/use-vehiculos';
import { VehiculosTable } from '@/components/vehiculos/vehiculos-table';
import { VehiculoDialog } from '@/components/vehiculos/vehiculo-dialog';
import { Car, Search, PlusCircle, Activity } from 'lucide-react';

export default function VehiculosPage() {
  const { vehiculos, isLoading, crear, actualizar, eliminar } = useVehiculos();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState<any>(null);

  const filteredVehiculos = vehiculos.filter((v) =>
    v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activos = vehiculos.filter(v => v.estado === 'Activo').length;
  const inactivos = vehiculos.length - activos;

  const handleEdit = (v: any) => {
    setEditingVehiculo(v);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      eliminar(id);
    }
  };

  const handleCreateNew = () => {
    setEditingVehiculo(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Car className="h-8 w-8 text-primary" />
          Vehículos
        </h2>
      </div>

      {/* Cards de KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="tracking-tight text-sm font-medium">Total Registrados</h3>
            <Car className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">{vehiculos.length}</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="tracking-tight text-sm font-medium">Activos en Ruta</h3>
            <Activity className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2 text-green-600">{activos}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 py-4 rounded-lg bg-background">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por placa o marca..."
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Nuevo Vehículo
        </button>
      </div>

      {/* Contenido / Tabla */}
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <VehiculosTable
          data={filteredVehiculos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      {isDialogOpen && (
        <VehiculoDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          vehiculo={editingVehiculo}
          onSave={editingVehiculo ? actualizar : crear}
        />
      )}
    </div>
  );
}
