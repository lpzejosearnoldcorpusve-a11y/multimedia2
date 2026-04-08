import { useState, useCallback, useEffect } from 'react';
import type { Vehiculo } from '@/types/vehiculo';
import { api } from '@/services/api';
import { useAuth } from '@/context/auth-context';

export function useVehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchVehiculos = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Vehiculo[]>('/vehiculos/');
      setVehiculos(data);
    } catch (error) {
      console.error('Error fetching vehiculos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchVehiculos();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchVehiculos]);

  const crear = useCallback(async (data: Omit<Vehiculo, 'id' | 'creado_en' | 'actualizado_en'>) => {
    try {
      const nuevo = await api.post<Vehiculo>('/vehiculos/', data);
      setVehiculos((prev) => [nuevo, ...prev]);
      return nuevo;
    } catch (error) {
      console.error('Error creando vehiculo:', error);
      throw error;
    }
  }, []);

  const actualizar = useCallback(async (id: string, data: Partial<Vehiculo>) => {
    try {
      const rev = await api.put<Vehiculo>(`/vehiculos/${id}/`, data);
      setVehiculos((prev) => prev.map((item) => (item.id === id ? rev : item)));
      return rev;
    } catch (error) {
      console.error('Error actualizando vehiculo:', error);
      throw error;
    }
  }, []);

  const eliminar = useCallback(async (id: string) => {
    try {
      await api.delete(`/vehiculos/${id}/`);
      setVehiculos((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error eliminando vehiculo:', error);
      throw error;
    }
  }, []);

  return {
    vehiculos,
    isLoading,
    crear,
    actualizar,
    eliminar,
    refetch: fetchVehiculos,
  };
}
