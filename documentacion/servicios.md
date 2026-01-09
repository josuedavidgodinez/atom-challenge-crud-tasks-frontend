# Servicios y Core

## Servicios

### AuthService

**Ubicación:** `core/services/auth.service.ts`

**Métodos:**
```typescript
crearUsuario(correo: string): Observable<ApiResponse>
login(correo: string): Observable<LoginResponse>
static logout(): void
static isAuthenticated(): boolean
static getToken(): string | null
static getUserData<T>(): T | null
```

**Flujo Login:**
```
login() → Backend (custom token) → exchangeToken() → Firebase (ID token) → sessionStorage
```

**¿Por qué exchange?** Backend genera custom token, frontend necesita ID token para auth

---

### TareasService

**Ubicación:** `core/services/tareas.service.ts`

**Métodos:**
```typescript
crearTarea(tarea: CrearTareaRequest): Observable<ApiResponse>
obtenerTareas(): Observable<ObtenerTareasResponse>
actualizarTarea(tarea: ActualizarTareaRequest): Observable<ApiResponse>
eliminarTarea(tareaId: string): Observable<ApiResponse>
```

**Nota:** Token agregado automáticamente por `AuthInterceptor`

---

## Guards

### authGuard

**Ubicación:** `core/guards/auth.guard.ts`

```typescript
export const authGuard: CanActivateFn = () => {
  return AuthService.isAuthenticated() 
    ? true 
    : inject(Router).navigate(['/login']);
};
```

**Uso:** `{ path: '', canActivate: [authGuard] }`

---

### guestGuard

**Ubicación:** `core/guards/guest.guard.ts`

```typescript
export const guestGuard: CanActivateFn = () => {
  return !AuthService.isAuthenticated() 
    ? true 
    : inject(Router).navigate(['/']);
};
```

**Uso:** `{ path: 'login', canActivate: [guestGuard] }`

---

## Interceptors

### AuthInterceptor

**Ubicación:** `core/interceptors/auth.interceptor.ts`

```typescript
intercept(req, next) {
  const token = getAuthToken();
  const modifiedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` }})
    : req;
  
  return next.handle(modifiedReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        clearAuthData();
        this.router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}
```

**Ventajas:** Token automático, manejo 401 centralizado

---

## Utilidades

### error.utils.ts

```typescript
getErrorMessageByStatus(status: number): string
handleHttpError(error: HttpErrorResponse): Observable<never>
```

**Normaliza errores a:** `{ exito: false, mensaje: "..." }`

---

### storage.utils.ts

**Genéricas:**
```typescript
saveToSessionStorage(key: string, value: string): void
getFromSessionStorage(key: string): string | null
removeFromSessionStorage(key: string): void
```

**Auth específicas:**
```typescript
saveAuthToken(token: string): void
getAuthToken(): string | null
hasAuthToken(): boolean
saveUserData(userData: unknown): void
getUserData<T>(): T | null
clearAuthData(): void  // Limpia todo
```

**Storage:** `sessionStorage` (se pierde al cerrar pestaña)

---

## Constants

### app.constants.ts

```typescript
export const API_ENDPOINTS = {
  CREAR_USUARIO: environment.apiEndpoints.crearUsuario,
  LOGIN_USUARIO: environment.apiEndpoints.loginUsuario,
  CREAR_TAREA: environment.apiEndpoints.crearTarea,
  OBTENER_TAREAS: environment.apiEndpoints.obtenerTareas,
  ACTUALIZAR_TAREA: environment.apiEndpoints.actualizarTarea,
  ELIMINAR_TAREA: environment.apiEndpoints.eliminarTarea
} as const;

export const FIREBASE_CONFIG = {
  API_KEY: environment.firebase.apiKey,
  SIGN_IN_WITH_CUSTOM_TOKEN_URL: environment.firebase.signInWithCustomTokenUrl
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data"
} as const;

export const ERROR_MESSAGES = {
  INVALID_TOKEN: "Token de autenticación inválido",
  NETWORK_ERROR: "Error de conexión. Verifica tu conexión a internet",
  UNKNOWN_ERROR: "Ha ocurrido un error inesperado"
} as const;
```

---

## Interfaces

### api-response.interface.ts

```typescript
interface ApiResponse<T = any> {
  exito: boolean;
  mensaje: string;
  datos?: T;
}

interface Usuario {
  id: string;
  correo: string;
}
```

### auth.interface.ts

```typescript
interface CrearUsuarioRequest { correo: string; }
interface LoginUsuarioRequest { correo: string; }
interface LoginResponse extends ApiResponse {
  token: string;
  usuario: Usuario;
}
```

### tarea.interface.ts

```typescript
type EstadoTarea = "P" | "C";

interface Tarea {
  id?: string;
  titulo: string;
  descripcion: string;
  estado: EstadoTarea;
  usuario?: string;
  fecha_de_creacion?: { _seconds: number; _nanoseconds: number; };
}

interface CrearTareaRequest {
  titulo: string;
  descripcion: string;
  estado: EstadoTarea;
}

interface ActualizarTareaRequest {
  tareaId: string;
  titulo: string;
  descripcion: string;
  estado: EstadoTarea;
}

interface ObtenerTareasResponse extends ApiResponse {
  datos: Tarea[];
}
```
