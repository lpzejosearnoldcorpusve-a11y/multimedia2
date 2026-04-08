export interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  anio: number | null;
  tipo_vehiculo: string | null;
  capacidad_litros: number | null;
  combustible: string | null;
  chasis: string | null;
  nro_soat: string | null;
  venc_soat: string | null;
  nro_itv: string | null;
  venc_itv: string | null;
  nro_permiso: string | null;
  venc_permiso: string | null;
  gps_id: string | null;
  gps_activo: boolean | null;
  estado: string | null;
  creado_en: string;
  actualizado_en: string | null;
}
