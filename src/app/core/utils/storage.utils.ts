import { STORAGE_KEYS } from "../constants/app.constants";

/**
 * Utilidades para operaciones de almacenamiento
 * Funciones puras sin dependencias de instancia
 */

/**
 * Guarda un valor en sessionStorage de forma segura
 * @param key - Clave de almacenamiento
 * @param value - Valor a guardar
 */
export function saveToSessionStorage(key: string, value: string): void {
    try {
        sessionStorage.setItem(key, value);
    } catch (error) {
        // Error manejado silenciosamente para no romper el flujo
    }
}

/**
 * Obtiene un valor de sessionStorage de forma segura
 * @param key - Clave de almacenamiento
 * @returns Valor almacenado o null
 */
export function getFromSessionStorage(key: string): string | null {
    try {
        return sessionStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

/**
 * Elimina un valor de sessionStorage de forma segura
 * @param key - Clave de almacenamiento
 */
export function removeFromSessionStorage(key: string): void {
    try {
        sessionStorage.removeItem(key);
    } catch (error) {
        // Error manejado silenciosamente
    }
}

/**
 * Guarda el token de autenticación
 * @param token - Token a guardar
 */
export function saveAuthToken(token: string): void {
    saveToSessionStorage(STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * Obtiene el token de autenticación
 * @returns Token almacenado o null
 */
export function getAuthToken(): string | null {
    return getFromSessionStorage(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Verifica si existe un token de autenticación
 * @returns true si existe un token
 */
export function hasAuthToken(): boolean {
    return getAuthToken() !== null;
}

/**
 * Limpia todos los datos de autenticación
 */
export function clearAuthData(): void {
    removeFromSessionStorage(STORAGE_KEYS.AUTH_TOKEN);
}
