# TransportApp - Gestión de Transportadora

Sistema de gestión modular para transportadoras de camiones, con autenticación y CRUD completo de usuarios.

## Características

- 🔐 **Autenticación simulada** con validación de email/contraseña
- 👥 **CRUD completo de usuarios** con formulario y tabla responsive
- 🎨 **Tema oscuro profesional** optimizado para logística
- 📱 **Diseño responsive** mobile-first
- 🏗️ **Arquitectura modular** lista para expandir con nuevos módulos (camiones, rutas, reportes)
- 💾 **Persistencia con localStorage** para datos simulados

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx                          # Página raíz (redirect)
│   ├── layout.tsx                        # Layout principal con AuthProvider
│   ├── globals.css                       # Estilos globales con tema oscuro
│   ├── login/
│   │   ├── page.tsx                      # Página de login
│   │   └── layout.tsx
│   └── dashboard/
│       ├── layout.tsx                    # Layout protegido del dashboard
│       ├── page.tsx                      # Dashboard principal
│       └── usuarios/
│           ├── page.tsx                  # Página de CRUD usuarios
│           └── components/
│               ├── usuario-form.tsx      # Formulario de crear/editar
│               ├── usuario-tabla.tsx     # Tabla con listado y acciones
│               └── usuarios-list.tsx     # Contenedor del módulo
│
├── components/
│   └── common/
│       ├── navbar.tsx                    # Barra superior con logo y logout
│       ├── sidebar.tsx                   # Menú de navegación
│       └── logout-button.tsx             # Botón de salir
│
├── context/
│   └── auth-context.tsx                  # Autenticación global con React Context
│
├── hooks/
│   └── useUsuarios.ts                    # Hook para CRUD de usuarios
│
├── lib/
│   └── utils.ts                          # Utilidades (cn, formatDate)
│
└── types/
    └── index.ts                          # Interfaces TypeScript
```

## Credenciales de Demostración

Para probar la aplicación sin restricciones, usa cualquier email y contraseña que cumpla:
- Email: formato válido (usuario@dominio.com)
- Contraseña: mínimo 6 caracteres

Ejemplo de credenciales sugeridas en la página:
- Email: `usuario@email.com`
- Contraseña: `password123`

## Cómo Usar

### 1. Login
1. Accede a `/login`
2. Completa el formulario con email y contraseña
3. Se redirigirá automáticamente a `/dashboard`

### 2. Gestión de Usuarios
1. En el sidebar, selecciona "Usuarios"
2. A la izquierda está el formulario para crear/editar
3. A la derecha está la tabla con todos los usuarios
4. **Crear**: Completa el formulario y haz clic en "Crear usuario"
5. **Editar**: Haz clic en "Editar" en cualquier fila de la tabla
6. **Eliminar**: Haz clic en "Eliminar" y confirma la acción

### 3. Logout
Haz clic en el botón "Salir" en la barra superior derecha

## Validaciones

### Login
- Email y contraseña son requeridos
- Contraseña debe tener al menos 6 caracteres

### Usuarios
- Email es requerido y debe ser único
- Nombre es requerido
- Email debe tener formato válido

## Datos

Los datos de usuarios se almacenan en `localStorage` del navegador:
- Los cambios persisten mientras no limpies el cache del navegador
- Al recargar la página, los datos se recuperan automáticamente
- Los datos iniciales incluyen 2 usuarios de ejemplo

## Tecnologías

- **Next.js 15+** - Framework React con App Router
- **React 19+** - Librería UI
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Estilos utilities
- **shadcn/ui** - Componentes accesibles
- **Lucide React** - Iconografía
- **React Context API** - State management para auth
- **localStorage** - Persistencia de datos

## Próximas Características

El dashboard está listo para expandir con:
- Gestión de Camiones/Vehículos
- Gestión de Rutas y Entregas
- Dashboard de Reportes y Estadísticas
- Integración con backend real
- Sistema de roles y permisos

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Build para producción
pnpm build
pnpm start
```

La aplicación estará disponible en `http://localhost:3000`

## Notas Arquitectónicas

- **Modularidad**: Cada sección es independiente y reutilizable
- **Escalabilidad**: Estructura lista para agregar más módulos
- **Type Safety**: TypeScript en todas las interfaces y componentes
- **Separación de responsabilidades**: Auth Context, Hooks, Componentes
- **Responsive**: Mobile-first con Tailwind CSS
- **Accesibilidad**: Componentes de shadcn/ui con ARIA

---

Creado con ❤️ para gestión eficiente de transportadoras
