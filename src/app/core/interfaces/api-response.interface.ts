/**
 * Interfaz base para todas las respuestas del API
 */
export interface ApiResponse<T = any> {
    exito: boolean;
    mensaje: string;
    datos?: T;
    token?: string;
    usuario?: Usuario;
}

/**
 * Interfaz para datos de usuario
 */
export interface Usuario {
    id: string;
    correo: string;
}

/**
 * Interfaz para errores del API
 */
export interface ApiError {
    exito: false;
    mensaje: string;
}
