'use client';

import { useState, useCallback } from 'react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { UsuarioForm } from './usuario-form';
import { UsuarioTabla } from './usuario-tabla';
import type { Usuario } from '@/types';

export function UsuariosList() {
  const { usuarios, crear, actualizar, eliminar } = useUsuarios();
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = useCallback(
    async (formData: any) => {
      setIsLoading(true);
      setSuccessMessage('');
      try {
        if (usuarioEditar) {
          actualizar(usuarioEditar.id, formData);
          setSuccessMessage('Usuario actualizado exitosamente');
        } else {
          crear(formData);
          setSuccessMessage('Usuario creado exitosamente');
        }
        setUsuarioEditar(undefined);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [usuarioEditar, crear, actualizar]
  );

  const handleEdit = (usuario: Usuario) => {
    setUsuarioEditar(usuario);
    // Scroll al formulario
    setTimeout(() => {
      document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const handleDelete = (id: string) => {
    try {
      eliminar(id);
      setSuccessMessage('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelEdit = () => {
    setUsuarioEditar(undefined);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Formulario */}
      <div className="lg:col-span-1">
        <div className="sticky top-0 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-6 text-xl font-bold text-foreground">
            {usuarioEditar ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <UsuarioForm
            usuario={usuarioEditar}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          {usuarioEditar && (
            <button
              onClick={handleCancelEdit}
              className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Limpiar formulario
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="lg:col-span-2">
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground">
            Usuarios ({usuarios.length})
          </h2>
          {successMessage && (
            <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-500">
              {successMessage}
            </div>
          )}
          <UsuarioTabla
            usuarios={usuarios}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
