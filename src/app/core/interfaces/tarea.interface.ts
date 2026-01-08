import { ApiResponse } from "./api-response.interface";

/**
 * Estados válidos para una tarea
 * P = Pendiente
 * C = Completada
 */
export type EstadoTarea = "P" | "C";

/**
 * Interfaz para una tarea
 */
export interface Tarea {
    id?: string;
    titulo: string;
    descripcion: string;
    estado: EstadoTarea;
    usuario?: string;
    fecha_de_creacion?: {
        _seconds: number;
        _nanoseconds: number;
    };
}

/**
 * Request para crear una nueva tarea
 */
export interface CrearTareaRequest {
    titulo: string;
    descripcion: string;
    estado: EstadoTarea;
}

/**
 * Request para actualizar una tarea existente
 */
export interface ActualizarTareaRequest {
    tareaId: string;
    titulo: string;
    descripcion: string;
    estado: EstadoTarea;
}

/**
 * Request para eliminar una tarea
 */
export interface EliminarTareaRequest {
    tareaId: string;
}

/**
 * Response con lista de tareas
 */
export interface ObtenerTareasResponse extends ApiResponse {
    datos: Tarea[];
}
