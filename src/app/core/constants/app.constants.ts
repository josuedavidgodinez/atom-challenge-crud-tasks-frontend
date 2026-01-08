/**
 * URLs de los endpoints del API
 * Desplegados en Google Cloud Run
 */
export const API_ENDPOINTS = {
    CREAR_USUARIO: "https://crearusuario-dpnddtqc3a-uc.a.run.app",
    LOGIN_USUARIO: "https://loginusuario-dpnddtqc3a-uc.a.run.app",
    CREAR_TAREA: "https://creartarea-dpnddtqc3a-uc.a.run.app",
    OBTENER_TAREAS: "https://obtenertareasporusuario-dpnddtqc3a-uc.a.run.app",
    ACTUALIZAR_TAREA: "https://actualizartarea-dpnddtqc3a-uc.a.run.app",
    ELIMINAR_TAREA: "https://eliminartarea-dpnddtqc3a-uc.a.run.app"
} as const;

/**
 * Keys para SessionStorage
 */
export const STORAGE_KEYS = {
    AUTH_TOKEN: "auth_token"
} as const;

/**
 * Mensajes de error estandarizados
 */
export const ERROR_MESSAGES = {
    NO_TOKEN: "No hay token de autenticación",
    INVALID_TOKEN: "Token de autenticación inválido",
    NETWORK_ERROR: "Error de conexión. Verifica tu conexión a internet",
    UNKNOWN_ERROR: "Ha ocurrido un error inesperado",
    SESSION_EXPIRED: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente"
} as const;

/**
 * Estados de tarea disponibles
 */
export const ESTADOS_TAREA = {
    PENDIENTE: "P",
    COMPLETADA: "C"
} as const;
