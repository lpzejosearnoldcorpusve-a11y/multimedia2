import { useState, useCallback, useEffect } from 'react';
import type { Usuario } from '@/types';
import { api } from '@/services/api';
import { useAuth } from '@/context/auth-context';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth(); // Only hook dependencies when authenticated

  const fetchUsuarios = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Usuario[]>('/users/');
      setUsuarios(data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsuarios();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchUsuarios]);

  const crear = useCallback(
    async (userData: Omit<Usuario, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const nuevoUsuario = await api.post<Usuario>('/users/', userData);
        setUsuarios((prev) => [nuevoUsuario, ...prev]);
        return nuevoUsuario;
      } catch (error) {
        console.error('Error creando usuario:', error);
        throw error; // Let the UI handle the error (e.g., duplicate email)
      }
    },
    []
  );

  const actualizar = useCallback(
    async (id: string, userData: Partial<Usuario>) => {
      try {
        const usuarioActualizado = await api.put<Usuario>(`/users/${id}/`, userData);
        setUsuarios((prev) =>
          prev.map((u) => (u.id === id ? usuarioActualizado : u))
        );
        return usuarioActualizado;
      } catch (error) {
        console.error('Error actualizando usuario:', error);
        throw error;
      }
    },
    []
  );

  const eliminar = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/users/${id}/`);
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        throw error;
      }
    },
    []
  );

  return {
    usuarios,
    isLoading,
    crear,
    actualizar,
    eliminar,
    refetch: fetchUsuarios, // Exported in case manual refresh is needed
  };
}
