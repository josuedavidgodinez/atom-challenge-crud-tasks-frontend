import { Tarea } from "../../core/interfaces/tarea.interface";

/**
 * Datos para abrir el diálogo de tarea
 */
export interface TareaDialogData {
    tarea?: Tarea; // Si existe, es edición; si no, es creación
    mode: "create" | "edit";
}

/**
 * Resultado del diálogo de tarea
 */
export interface TareaDialogResult {
    action: "save" | "delete" | "cancel";
    tarea?: Partial<Tarea>;
}
