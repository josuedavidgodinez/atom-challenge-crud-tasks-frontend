import { HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

import { ERROR_MESSAGES } from "../constants/app.constants";
import { ApiError } from "../interfaces/api-response.interface";

/**
 * Utilidades para manejo de errores HTTP
 * Funciones puras sin dependencias de instancia
 */

/**
 * Obtiene un mensaje de error basado en el código de estado HTTP
 * @param status - Código de estado HTTP
 * @returns Mensaje de error descriptivo
 */
export function getErrorMessageByStatus(status: number): string {
    switch (status) {
        case 401:
            return ERROR_MESSAGES.INVALID_TOKEN;
        case 0:
            return ERROR_MESSAGES.NETWORK_ERROR;
        default:
            return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
}

/**
 * Procesa errores HTTP y los convierte en un formato estandarizado
 * @param error - Error HTTP recibido
 * @returns Observable con el error procesado
 */
export function handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
        // Error del cliente o de red
        errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
    } else if (error.error && typeof error.error === "object" && "mensaje" in error.error) {
        // El backend retornó un mensaje de error
        errorMessage = (error.error as ApiError).mensaje;
    } else {
        // Error desconocido
        errorMessage = getErrorMessageByStatus(error.status);
    }

    return throwError(() => ({
        exito: false,
        mensaje: errorMessage
    } as ApiError));
}
