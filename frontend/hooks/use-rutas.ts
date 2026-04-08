import { useState, useCallback } from 'react';
import { api } from '@/services/api';

export interface RouteOptimizationResult {
  origin: { lat: number, lng: number };
  ordered_destinations: Array<{ lat: number, lng: number, name?: string }>;
  distance_km: number;
  ml_eta_minutes: number;
  polyline: string;
  total_stops: number;
}

export function useRutas() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<RouteOptimizationResult | null>(null);

  const optimizeRoute = useCallback(async (origin: {lat: number, lng: number}, destinations: Array<{lat: number, lng: number, name?: string}>) => {
    try {
      setIsOptimizing(true);
      const response = await api.post<{success: boolean, data: RouteOptimizationResult}>('/rutas/optimize/', {
        origin,
        destinations
      });
      setOptimizationResult(response.data);
      return response.data;
    } catch (error) {
      console.error('Error optimizando la ruta (IA):', error);
      throw error;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  return {
    isOptimizing,
    optimizationResult,
    optimizeRoute,
    clearResult: () => setOptimizationResult(null)
  };
}
