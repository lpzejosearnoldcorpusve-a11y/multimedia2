'use client';

import { Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Usuario } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface UsuarioTablaProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function UsuarioTabla({
  usuarios,
  onEdit,
  onDelete,
  isLoading,
}: UsuarioTablaProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteId(null);
  };

  if (usuarios.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No hay usuarios registrados</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Creado
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={usuario.id}
                className="border-b border-border hover:bg-accent/10 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-foreground">
                  {usuario.email}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {usuario.name}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {usuario.active ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-foreground">Activo</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-muted-foreground">Inactivo</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatDate(usuario.created_at)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(usuario)}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(usuario.id)}
                      disabled={isLoading}
                      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Eliminar usuario</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              ¿Estás seguro? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel className="border-border text-foreground hover:bg-accent/10">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
