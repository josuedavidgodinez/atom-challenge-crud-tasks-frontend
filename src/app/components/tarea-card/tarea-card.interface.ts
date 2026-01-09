import { Tarea } from "../../core/interfaces/tarea.interface";

/**
 * Eventos que puede emitir la tarjeta de tarea
 */
export interface TareaCardEvent {
    tarea: Tarea;
    action: "edit" | "delete" | "toggleEstado" | "click";
}

/**
 * Configuración de acciones disponibles en la tarjeta
 */
export interface TareaCardConfig {
    showEditButton?: boolean;
    showDeleteButton?: boolean;
    showEstadoCheckbox?: boolean;
    clickable?: boolean;
}
