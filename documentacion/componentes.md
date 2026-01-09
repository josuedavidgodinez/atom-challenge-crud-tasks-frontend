# Componentes

## Jerarquía

```
AppComponent
├── LoginComponent
└── TareasComponent
    ├── TareaCardComponent (lista)
    ├── TareaDialogComponent (modal)
    ├── ConfirmDialogComponent (modal)
    └── ConfirmCreateUserDialogComponent (modal)
```

## Páginas

### LoginComponent

**Ubicación:** `pages/login/`

**Flujo:**
1. Login → `AuthService.login()`
2. Si no existe → `ConfirmCreateUserDialog`
3. Si confirma → `crearUsuario()` → login automático
4. Redirect a `/`

**Features:** Formulario reactivo, validación email, errores HTTP

---

### TareasComponent

**Ubicación:** `pages/tareas/`

**Features:**
- Estados: loading, error, empty, data
- Estadísticas (total, pendientes, completadas)
- CRUD con actualización optimista
- Notificaciones (SnackBar)

**Métodos principales:**
```typescript
loadTareas()              // Carga inicial
onCreateTarea()           // Abre modal
onTareaEvent()            // Maneja eventos de tarjetas
handleCreateTarea()       // Optimistic create
handleUpdateTarea()       // Optimistic update + rollback
handleDeleteTarea()       // Confirmación + delete
handleToggleEstado()      // Toggle P/C
```

**Actualización Optimista:**
```typescript
// 1. UI
this.tareas = [nuevaTarea, ...this.tareas];
// 2. API
this.service.crear().subscribe({
  error: () => this.tareas = this.tareas.filter(t => t.id !== tempId)
});
```

---

## Componentes Presentacionales

### TareaCardComponent

**Ubicación:** `components/tarea-card/`

**Inputs:**
```typescript
@Input() tarea: Tarea;
@Input() config: TareaCardConfig;  // showEdit, showDelete, etc.
```

**Outputs:**
```typescript
@Output() tareaEvent: EventEmitter<TareaCardEvent>;
// Eventos: 'click', 'edit', 'delete', 'toggleEstado'
```

**Features:** Fecha formateada, estados visuales, responsive, a11y

---

### TareaDialogComponent

**Ubicación:** `components/tarea-dialog/`

**Data (MAT_DIALOG_DATA):**
```typescript
{ tarea?: Tarea, mode: 'create' | 'edit' }
```

**Result (dialogRef.close()):**
```typescript
{ action: 'save' | 'delete' | 'cancel', tarea?: Partial<Tarea> }
```

**Validaciones:**
- `titulo`: required, min 3, max 100
- `descripcion`: required, min 5, max 500
- `estado`: 'P' | 'C'

**Features:** Formulario reactivo, character counter, detección de cambios

---

### ConfirmDialogComponent

**Ubicación:** `components/confirm-dialog/`

**Data:**
```typescript
{
  title: string,
  message: string,
  confirmText?: string,  // Default: "Confirmar"
  cancelText?: string,   // Default: "Cancelar"
  type?: 'warn' | 'danger' | 'info'
}
```

**Result:** `boolean` (true = confirmado)

**Features:** Iconos dinámicos, colores por tipo, a11y

---

### ConfirmCreateUserDialogComponent

**Ubicación:** `components/confirm-create-user-dialog/`

**Data:** `{ correo: string }`

**Result:** `boolean`

**Flujo:** Login falla → Dialog → Confirma → `crearUsuario()` → Login auto

---

## Estilos Compartidos

**Ubicación:** `assets/styles/_variables.scss`

```scss
$primary-color: #007bff;
$spacing-md: 1rem;

@mixin responsive($breakpoint) { ... }
@mixin flex-center { ... }
```

---

## Accesibilidad

```html
<button aria-label="Editar tarea">
<mat-card role="article" [attr.aria-label]="'Tarea: ' + titulo">
<div role="alert" aria-live="polite">{{ error }}</div>
<button cdkFocusInitial>Crear</button>
```
