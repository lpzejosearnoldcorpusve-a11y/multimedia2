import { UsuariosList } from './components/usuarios-list';

export const metadata = {
  title: 'Usuarios - TransportApp',
  description: 'Gestión de usuarios de la transportadora',
};

export default function UsuariosPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Gestión de Usuarios</h1>
        <p className="mt-2 text-muted-foreground">
          Crea, edita y elimina usuarios del sistema
        </p>
      </div>
      <UsuariosList />
    </div>
  );
}
