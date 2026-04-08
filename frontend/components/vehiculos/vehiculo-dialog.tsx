'use client';

import { useState, useEffect } from 'react';
import type { Vehiculo } from '@/types/vehiculo';
import { X, Car, FileText, MapPin, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface VehiculoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehiculo: Vehiculo | null;
  onSave: (idOrData: any, data?: any) => Promise<any>;
}

// Pasos del Wizard
const STEPS = [
  { id: 'general', title: 'Datos Generales', icon: Car },
  { id: 'legal', title: 'Documentación', icon: FileText },
  { id: 'tracking', title: 'Rastreo y GPS', icon: MapPin },
];

export function VehiculoDialog({ isOpen, onClose, vehiculo, onSave }: VehiculoDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState<Partial<Vehiculo>>({
    placa: '',
    marca: '',
    anio: new Date().getFullYear(),
    tipo_vehiculo: '',
    capacidad_litros: 0,
    combustible: '',
    chasis: '',
    nro_soat: '',
    venc_soat: '',
    nro_itv: '',
    venc_itv: '',
    nro_permiso: '',
    venc_permiso: '',
    gps_id: '',
    gps_activo: false,
    estado: 'Activo'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formatear fechas para input type="date"
  const formatDateForInput = (dateString?: string | null) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  useEffect(() => {
    if (vehiculo) {
      setFormData({
        ...vehiculo,
        venc_soat: formatDateForInput(vehiculo.venc_soat),
        venc_itv: formatDateForInput(vehiculo.venc_itv),
        venc_permiso: formatDateForInput(vehiculo.venc_permiso),
      });
    }
  }, [vehiculo]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Re-formatear fechas a ISO si es necesario, o dejarlas como YYYY-MM-DD (Django las acepta)
      const dataToSave = { ...formData };
      
      // Limpiar campos vacíos si son de fecha para evitar errores en Django
      if (!dataToSave.venc_soat) dataToSave.venc_soat = null;
      if (!dataToSave.venc_itv) dataToSave.venc_itv = null;
      if (!dataToSave.venc_permiso) dataToSave.venc_permiso = null;

      if (vehiculo) {
        await onSave(vehiculo.id, dataToSave);
      } else {
        await onSave(dataToSave);
      }
      onClose();
    } catch (error) {
      alert("Error al guardar el vehículo. Revisa que todos los campos requeridos estén llenos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renders de cada paso
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Placa *</label>
              <input required className="input-modern" value={formData.placa || ''} onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })} placeholder="ABC-123" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Marca *</label>
              <input required className="input-modern" value={formData.marca || ''} onChange={(e) => setFormData({ ...formData, marca: e.target.value })} placeholder="Ej: Volvo, Mercedes" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Año *</label>
              <input type="number" required className="input-modern" value={formData.anio || ''} onChange={(e) => setFormData({ ...formData, anio: parseInt(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Tipo de Vehículo</label>
              <select className="input-modern" value={formData.tipo_vehiculo || ''} onChange={(e) => setFormData({ ...formData, tipo_vehiculo: e.target.value })}>
                <option value="">Selecciona...</option>
                <option value="Camión">Camión</option>
                <option value="Tráiler">Tráiler</option>
                <option value="Furgoneta">Furgoneta</option>
                <option value="Camioneta">Camioneta</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Capacidad (Litros)</label>
              <input type="number" className="input-modern" value={formData.capacidad_litros || ''} onChange={(e) => setFormData({ ...formData, capacidad_litros: parseFloat(e.target.value) })} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Combustible</label>
              <select className="input-modern" value={formData.combustible || ''} onChange={(e) => setFormData({ ...formData, combustible: e.target.value })}>
                <option value="">Selecciona...</option>
                <option value="Diésel">Diésel</option>
                <option value="Gasolina">Gasolina</option>
                <option value="GNV">GNV</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-semibold text-foreground">Chasis / VIN</label>
              <input className="input-modern" value={formData.chasis || ''} onChange={(e) => setFormData({ ...formData, chasis: e.target.value.toUpperCase() })} placeholder="Ingresa el número de chasis..." />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Nro. SOAT</label>
              <input className="input-modern" value={formData.nro_soat || ''} onChange={(e) => setFormData({ ...formData, nro_soat: e.target.value })} placeholder="Número de póliza" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Vencimiento SOAT</label>
              <input type="date" className="input-modern [&::-webkit-calendar-picker-indicator]:cursor-pointer" value={formData.venc_soat || ''} onChange={(e) => setFormData({ ...formData, venc_soat: e.target.value })} onClick={(e) => { try { e.currentTarget.showPicker() } catch(err){} }} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Nro. ITV (Insp. Técnica)</label>
              <input className="input-modern" value={formData.nro_itv || ''} onChange={(e) => setFormData({ ...formData, nro_itv: e.target.value })} placeholder="Certificado ITV" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Vencimiento ITV</label>
              <input type="date" className="input-modern [&::-webkit-calendar-picker-indicator]:cursor-pointer" value={formData.venc_itv || ''} onChange={(e) => setFormData({ ...formData, venc_itv: e.target.value })} onClick={(e) => { try { e.currentTarget.showPicker() } catch(err){} }} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Nro. Permiso Circulación</label>
              <input className="input-modern" value={formData.nro_permiso || ''} onChange={(e) => setFormData({ ...formData, nro_permiso: e.target.value })} placeholder="Permiso especial" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Vencimiento Permiso</label>
              <input type="date" className="input-modern [&::-webkit-calendar-picker-indicator]:cursor-pointer" value={formData.venc_permiso || ''} onChange={(e) => setFormData({ ...formData, venc_permiso: e.target.value })} onClick={(e) => { try { e.currentTarget.showPicker() } catch(err){} }} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="space-y-4 col-span-2 p-5 rounded-lg border border-primary/20 bg-primary/5">
              <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Configuración de Telemetría
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">ID del Dispositivo GPS</label>
                  <input className="input-modern bg-background" value={formData.gps_id || ''} onChange={(e) => setFormData({ ...formData, gps_id: e.target.value })} placeholder="IMEI o ID del tracker" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={formData.gps_activo || false} onChange={(e) => setFormData({ ...formData, gps_activo: e.target.checked })} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${formData.gps_activo ? 'bg-primary' : 'bg-muted-foreground/30'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.gps_activo ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground">GPS Activo</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2 col-span-2 mt-4">
              <label className="text-sm font-semibold text-foreground">Estado General del Vehículo</label>
              <select className="input-modern w-full" value={formData.estado || 'Activo'} onChange={(e) => setFormData({ ...formData, estado: e.target.value })}>
                <option value="Activo">🟢 Activo (Apto para Viajes)</option>
                <option value="Inactivo">🔴 Inactivo</option>
                <option value="En Mantenimiento">🟡 En Mantenimiento</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Estilos inyectados solo para este componente para garantizar inputs modernos si no hay tailwindforms */}
      <style dangerouslySetInnerHTML={{__html: `
        .input-modern {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border) / 0.8);
          background-color: hsl(var(--background));
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: hsl(var(--foreground));
          color-scheme: dark;
          transition: all 0.2s ease-in-out;
        }
        .input-modern:focus {
          outline: none;
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2);
        }
      `}} />

      <div className="relative w-full max-w-3xl rounded-2xl bg-card shadow-2xl border border-border/50 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-border bg-muted/20 px-6 py-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {vehiculo ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {vehiculo ? `Placa: ${vehiculo.placa}` : 'Completa el asistente de configuración'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper Visual */}
        <div className="bg-muted/10 px-6 py-4 border-b border-border flex items-center justify-between">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  isActive ? 'border-primary bg-primary/10 text-primary' : 
                  isCompleted ? 'border-primary bg-primary text-primary-foreground' : 
                  'border-muted-foreground/30 text-muted-foreground'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-bold ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">Paso {index + 1}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Contenido Formulario */}
        <form id="vehiculo-wizard" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          {renderStepContent()}
        </form>

        {/* Footer / Controles */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <button
            type="button"
            onClick={() => currentStep > 0 ? setCurrentStep(s => s - 1) : onClose()}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md border border-input bg-background hover:bg-muted font-medium transition-colors flex items-center gap-2"
          >
            {currentStep > 0 ? <ChevronLeft className="w-4 h-4" /> : null}
            {currentStep > 0 ? 'Anterior' : 'Cancelar'}
          </button>
          
          <button
            type="submit"
            form="vehiculo-wizard"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
            {currentStep < STEPS.length - 1 ? (
              <>Siguiente <ChevronRight className="w-4 h-4" /></>
            ) : (
              <>{vehiculo ? 'Guardar Cambios' : 'Finalizar Registro'} <CheckCircle2 className="w-4 h-4" /></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
