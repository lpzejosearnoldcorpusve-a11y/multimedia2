export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Bienvenido</h1>
          <p className="mt-2 text-muted-foreground">
            Selecciona una sección del menú para comenzar
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground">Gestión de Usuarios</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Administra los usuarios del sistema, crea, edita y elimina registros
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 opacity-50">
            <h3 className="font-semibold text-foreground">Camiones</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Próximamente: Gestión de tu flota de vehículos
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 opacity-50">
            <h3 className="font-semibold text-foreground">Rutas</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Próximamente: Planifica tus rutas de entrega
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
