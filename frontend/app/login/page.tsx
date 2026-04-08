'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import TruckScene from '@/components/TruckScene';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reproducir música de camiones
  useEffect(() => {
    const audio = new Audio('/Musica de. Camiones.mp3');
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    const playAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(e => console.log('Autoplay bloqueado, esperando interacción del usuario', e));
      }
    };

    // Intentar reproducir de inmediato
    playAudio();

    // Si el navegador lo bloquea, reproducir al primer clic/tecla
    const handleInteraction = () => {
      playAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const toggleAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err) {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log(e));
      }
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary mx-auto"></div>
          <p className="text-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background relative">
      {/* Botón flotante para la música */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-6 right-6 z-50 rounded-full bg-background/50 backdrop-blur-md border border-border/50 hover:bg-background/80 shadow-md transition-all hover:scale-105"
        onClick={toggleAudio}
        type="button"
        title={isPlaying ? "Pausar música" : "Reproducir música"}
      >
        {isPlaying ? <Volume2 className="h-5 w-5 text-primary" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
      </Button>

      {/* 3D Scene Section (Left) */}
      <div className="relative hidden w-1/2 lg:flex items-center justify-center bg-slate-900 border-r border-border shadow-2xl">
        <TruckScene />
        
        {/* Overlay Info */}
        <div className="absolute top-12 left-12 z-10 pointer-events-none select-none">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/20 p-2.5 rounded-xl backdrop-blur-md shadow-lg border border-primary/20">
              <Truck className="h-8 w-8 text-primary drop-shadow-md" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
              TransportApp
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-md drop-shadow">
            El sistema definitivo para la gestión logística.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-12 left-12 z-10 pointer-events-none">
          <div className="flex gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-slate-400 text-sm font-medium tracking-wider uppercase">Live Tracking Enabled</span>
          </div>
        </div>
      </div>

      {/* Login Form Section (Right) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background relative">
        {/* Subtle background glow for extra pro look */}
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full w-[80%] h-[80%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10" />

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <Truck className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Bienvenido de nuevo
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder al dashboard.
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@transportapp.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                  required
                  className="bg-background/50 h-11"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Contraseña
                  </Label>
                  <a href="#" className="text-xs font-semibold text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isSubmitting}
                  required
                  className="bg-background/50 h-11"
                />
              </div>

              {error && (
                <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-lg animate-in fade-in duration-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-base font-medium shadow-md transition-all hover:scale-[1.02]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Ingresando...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Credenciales Demo
              </p>
              <div className="grid gap-2 text-sm text-muted-foreground bg-accent/30 p-4 rounded-lg border border-border/50">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Email:</span>
                  <span className="font-mono bg-background px-2 py-1 rounded text-xs">usuario@email.com</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Contraseña:</span>
                  <span className="font-mono bg-background px-2 py-1 rounded text-xs">password123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
