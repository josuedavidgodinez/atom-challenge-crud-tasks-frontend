import { environment } from "../../../environments/environment";

/**
 * URLs de los endpoints de las cloud functions
 */
export const API_ENDPOINTS = {
    CREAR_USUARIO: environment.apiEndpoints.crearUsuario,
    LOGIN_USUARIO: environment.apiEndpoints.loginUsuario,
    CREAR_TAREA: environment.apiEndpoints.crearTarea,
    OBTENER_TAREAS: environment.apiEndpoints.obtenerTareas,
    ACTUALIZAR_TAREA: environment.apiEndpoints.actualizarTarea,
    ELIMINAR_TAREA: environment.apiEndpoints.eliminarTarea
} as const;

/**
 * Configuración de Firebase
 */
export const FIREBASE_CONFIG = {
    API_KEY: environment.firebase.apiKey,
    SIGN_IN_WITH_CUSTOM_TOKEN_URL: environment.firebase.signInWithCustomTokenUrl
} as const;

/**
 * Keys para SessionStorage
 */
export const STORAGE_KEYS = {
    AUTH_TOKEN: "auth_token",
    USER_DATA: "user_data"
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
