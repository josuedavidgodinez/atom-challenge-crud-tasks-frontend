import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { API_ENDPOINTS } from "../constants/app.constants";
import { ApiResponse } from "../interfaces/api-response.interface";
import {
    ActualizarTareaRequest,
    CrearTareaRequest,
    EliminarTareaRequest,
    ObtenerTareasResponse
} from "../interfaces/tarea.interface";
import { handleHttpError } from "../utils/error.utils";

/**
 * Servicio de tareas
 * Responsabilidades:
 * - CRUD completo de tareas
 * - Gestión de peticiones HTTP a los endpoints de tareas
 *
 * Siguiendo principios SOLID:
 * - SRP: Responsabilidad única de gestión de tareas
 * - OCP: Abierto para extensión (agregar más métodos), cerrado para modificación
 * - DIP: Depende de abstracciones (HttpClient, StorageService)
 */
@Injectable({
    providedIn: "root"
})
export class TareasService {
    private readonly headers = new HttpHeaders({
        "Content-Type": "application/json"
    });

    constructor(
        private readonly http: HttpClient
    ) { }

    /**
     * Crea una nueva tarea
     * Requiere autenticación (token enviado por interceptor)
     * @param tarea - Datos de la tarea a crear
     * @returns Observable con la respuesta del API
     */
    crearTarea(tarea: CrearTareaRequest): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(
            API_ENDPOINTS.CREAR_TAREA,
            tarea,
            { headers: this.headers }
        ).pipe(
            catchError((error) => handleHttpError(error))
        );
    }

    /**
     * Obtiene todas las tareas del usuario autenticado
     * Requiere autenticación (token enviado por interceptor)
     * @returns Observable con la lista de tareas
     */
    obtenerTareas(): Observable<ObtenerTareasResponse> {
        return this.http.get<ObtenerTareasResponse>(
            API_ENDPOINTS.OBTENER_TAREAS,
            { headers: this.headers }
        ).pipe(
            catchError((error) => handleHttpError(error))
        );
    }

    /**
     * Actualiza una tarea existente
     * Requiere autenticación (token enviado por interceptor)
     * @param tarea - Datos de la tarea a actualizar
     * @returns Observable con la respuesta del API
     */
    actualizarTarea(tarea: ActualizarTareaRequest): Observable<ApiResponse> {
        return this.http.put<ApiResponse>(
            API_ENDPOINTS.ACTUALIZAR_TAREA,
            tarea,
            { headers: this.headers }
        ).pipe(
            catchError((error) => handleHttpError(error))
        );
    }

    /**
     * Elimina una tarea
     * Requiere autenticación (token enviado por interceptor)
     * @param tareaId - ID de la tarea a eliminar
     * @returns Observable con la respuesta del API
     */
    eliminarTarea(tareaId: string): Observable<ApiResponse> {
        const body: EliminarTareaRequest = { tareaId };

        return this.http.request<ApiResponse>(
            "DELETE",
            API_ENDPOINTS.ELIMINAR_TAREA,
            {
                headers: this.headers,
                body
            }
        ).pipe(
            catchError((error) => handleHttpError(error))
        );
    }
}
