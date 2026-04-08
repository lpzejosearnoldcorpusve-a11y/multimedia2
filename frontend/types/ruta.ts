export interface Ruta {
  id: string;
  nombre: string;
  vehiculo: string | null;
  origen: string;
  origen_lat: number | null;
  origen_lng: number | null;
  destino: string;
  destino_lat: number | null;
  destino_lng: number | null;
  distancia_km: number | null;
  duracion_minutos: number | null;
  fecha_salida: string | null;
  fecha_llegada_estimada: string | null;
  estado: string | null;
  inicio_real: string | null;
  fin_real: string | null;
  observaciones: string | null; // Usaremos esto para almacenar la polyline de OSRM
  creado_en: string;
  actualizado_en: string | null;
}
