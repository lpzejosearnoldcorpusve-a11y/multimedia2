'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { Usuario } from '@/types';

interface UsuarioFormProps {
  usuario?: Usuario;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function UsuarioForm({ usuario, onSubmit, isLoading }: UsuarioFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    active: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (usuario) {
      setFormData({
        email: usuario.email,
        name: usuario.name,
        active: usuario.active,
      });
    } else {
      setFormData({
        email: '',
        name: '',
        active: true,
      });
    }
    setError('');
  }, [usuario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.name) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email inválido');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email" className="text-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="usuario@ejemplo.com"
          className="mt-2"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="name" className="text-foreground">
          Nombre
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nombre completo"
          className="mt-2"
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, active: checked as boolean })
          }
          disabled={isLoading}
        />
        <Label htmlFor="active" className="text-foreground cursor-pointer">
          Usuario activo
        </Label>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear usuario'}
      </Button>
    </form>
  );
}
