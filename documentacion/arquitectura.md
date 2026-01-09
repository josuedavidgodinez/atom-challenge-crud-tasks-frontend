# Arquitectura

## Clean Architecture - 4 Capas

```
Pages → Components → Services → Core
(UI)    (Reutiliz.)  (Lógica)   (Utils)
```

### 1. Pages (Containers)
- `LoginComponent`, `TareasComponent`
- **Responsabilidad:** Orquestación, estado

### 2. Components (Presentacionales)
- `TareaCardComponent`, `TareaDialogComponent`, `ConfirmDialogComponent`
- **Responsabilidad:** UI pura, @Input/@Output

### 3. Services
- `AuthService`, `TareasService`
- **Responsabilidad:** HTTP, lógica de negocio

### 4. Core
- Guards, Interceptors, Utils, Constants, Interfaces
- **Responsabilidad:** Infraestructura

## Principios SOLID

- **SRP:** Componentes con una responsabilidad
- **OCP:** Interfaces TypeScript extensibles
- **LSP:** Componentes intercambiables (@Input/@Output)
- **ISP:** Interfaces específicas (`TareaCardEvent`, `TareaDialogData`)
- **DIP:** Servicios inyectables, guards funcionales

## Patrones

- **Container/Presentational:** Separación UI/Lógica
- **Optimistic Updates:** UI instantánea + rollback en errores
- **Singleton Services:** `providedIn: 'root'`
- **Guards Funcionales:** `CanActivateFn` simplificado
- **HTTP Interceptor:** Token automático + manejo 401 global

## Estructura

```
src/app/
├── components/     # Reutilizables (TareaCard, TareaDialog, Confirms)
├── pages/          # Login, Tareas
└── core/           # Guards, Interceptors, Services, Utils, Interfaces
```

## Flujo de Datos

**Auth:** Login → Backend (Custom Token) → Exchange (ID Token) → SessionStorage → Redirect

**CRUD:** Component → Event → Optimistic UI → API → Success/Rollback

## Gestión de Estado

**Strategy:** Component state (no NgRx)

```typescript
tareas: Tarea[] = [];        // Estado local
loading = false;             // UI state
private destroy$ = new Subject(); // Lifecycle
```

## HTTP

**Chain:** Request → AuthInterceptor (token) → Backend → catchError (401) → Component

**Error Handling:** Interceptor (401 global) → Service (normaliza) → Component (muestra)

## Routing

```typescript
{ path: '', component: TareasComponent, canActivate: [authGuard] }
{ path: 'login', component: LoginComponent, canActivate: [guestGuard] }
```

## Standalone Components

**No hay NgModule** - Imports explícitos, mejor tree shaking

## RxJS

**Unsubscribe:** `takeUntil(destroy$)` en `ngOnDestroy`

**Operators:** `takeUntil`, `catchError`, `map`, `tap`, `switchMap`

## Mejores Prácticas

- TypeScript strict
- Readonly, arrow functions
- Interfaces explícitas
- Functional guards
- Smart/Dumb components
- TrackBy en listas
