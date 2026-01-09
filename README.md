# Atom Challenge - CRUD Tasks Frontend

Aplicación web de gestión de tareas con Angular 17, Material Design y Firebase Authentication.

## 🚀 Stack

- Angular 17 (Standalone Components) + Material Design
- TypeScript + SCSS + RxJS
- Firebase Auth + Cypress E2E
- CI/CD con GitHub Actions

## 🚀 Inicio Rápido

```bash
# Instalar
npm install

# Desarrollo
npm run start:local  # http://localhost:4200

# Build producción
npm run build:prod

# Tests E2E
npm run test:e2e
```

## 📱 Funcionalidades

- ✅ Autenticación con correo (Firebase Custom Tokens)
- ✅ CRUD completo de tareas
- ✅ Actualización optimista (UI instantánea)
- ✅ Estados: Pendiente / Completada
- ✅ Responsive design (Mobile-first)
- ✅ Notificaciones (Material Snackbar)

## 🏗️ Arquitectura

```
Clean Architecture - 4 Capas
Pages → Components → Services → Core
(UI)    (Reutiliz.)  (Lógica)  (Utils)
```

**Componentes principales:**
- `TareasComponent` (Página principal)
- `LoginComponent` (Autenticación)
- `TareaCardComponent` (Tarjeta de tarea)
- `TareaDialogComponent` (Crear/Editar)
- `ConfirmDialogComponent` (Confirmaciones)

## 🧪 Testing

```bash
npm run test:e2e        # Cypress headless
npm run test:e2e:open   # Cypress UI
npm run test:e2e:ci     # CI/CD
```

**Cobertura:** Flow completo de usuario (login → crear → editar → eliminar)

## 🚢 Deploy

```bash
npm run deploy  # Manual a Firebase Hosting
```

Push a `main` → Deploy automático vía GitHub Actions

**URL Producción:** https://atom-challenge-crud-tasks.web.app

## 📚 Documentación

En `documentacion/`:

- [configuracion.md](documentacion/configuracion.md) - Setup y desarrollo
- [arquitectura.md](documentacion/arquitectura.md) - Estructura y patrones
- [componentes.md](documentacion/componentes.md) - Componentes principales
- [servicios.md](documentacion/servicios.md) - Servicios y guards

## 🛠️ Scripts

```bash
npm run start              # Dev (producción)
npm run start:local        # Dev (local)
npm run build:prod         # Build producción
npm run build:local        # Build desarrollo
npm run test:e2e           # Tests E2E
npm run lint               # ESLint
npm run deploy             # Deploy Firebase
```

## 🔐 Variables de Entorno

Configurar en Firebase Console:
- `FIREBASE_API_KEY` (production)

Locales: `environment.local.ts` (no versionado)

## 📦 Estructura

```
src/
├── app/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas (Login, Tareas)
│   └── core/           # Servicios, guards, utils
├── assets/
│   └── styles/         # Variables SCSS globales
└── environments/       # Configuración por entorno
```

## 🎯 Optimizaciones

- ✅ Tree shaking automático
- ✅ Minificación en producción
- ✅ Actualización optimista (UX)
- ✅ Lazy loading de rutas
- ✅ Standalone components (menor bundle)
- ✅ OnPush change detection (performance)
