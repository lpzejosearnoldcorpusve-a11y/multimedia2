import { useState, useCallback, useEffect } from 'react';
import { api } from '@/services/api';
import type { Ruta } from '@/types/ruta';
import { useAuth } from '@/context/auth-context';

export function useRutasCrud() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchRutas = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Ruta[]>('/rutas/');
      setRutas(data);
    } catch (error) {
      console.error('Error fetching rutas desde Neon:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRutas();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchRutas]);

  const crearRuta = useCallback(async (data: Partial<Ruta>) => {
    try {
      const nueva = await api.post<Ruta>('/rutas/', data);
      setRutas((prev) => [nueva, ...prev]);
      return nueva;
    } catch (error) {
      console.error('Error guardando la ruta en Neon:', error);
      throw error;
    }
  }, []);

  const eliminarRuta = useCallback(async (id: string) => {
    try {
      await api.delete(`/rutas/${id}/`);
      setRutas((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error eliminando la ruta:', error);
      throw error;
    }
  }, []);

  return {
    rutas,
    isLoading,
    crearRuta,
    eliminarRuta,
    refetch: fetchRutas
  };
}
