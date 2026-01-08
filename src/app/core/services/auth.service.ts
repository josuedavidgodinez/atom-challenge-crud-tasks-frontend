import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { API_ENDPOINTS } from "../constants/app.constants";
import { ApiResponse } from "../interfaces/api-response.interface";
import {
    CrearUsuarioRequest,
    LoginResponse,
    LoginUsuarioRequest
} from "../interfaces/auth.interface";
import { handleHttpError } from "../utils/error.utils";
import {
    clearAuthData,
    getAuthToken,
    hasAuthToken,
    saveAuthToken,
} from "../utils/storage.utils";

/**
 * Servicio de autenticación
 */
@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly headers = new HttpHeaders({
        "Content-Type": "application/json"
    });

    constructor(
        private readonly http: HttpClient
    ) { }

    /**
     * Crea un nuevo usuario
     * @param correo - Email del usuario
     * @returns Observable con la respuesta del API
     */
    crearUsuario(correo: string): Observable<ApiResponse> {
        const body: CrearUsuarioRequest = { correo };

        return this.http.post<ApiResponse>(
            API_ENDPOINTS.CREAR_USUARIO,
            body,
            { headers: this.headers }
        ).pipe(
            catchError((error) => handleHttpError(error))
        );
    }

    /**
     * Realiza el login de un usuario
     * Guarda el token y datos de usuario en sessionStorage
     * @param correo - Email del usuario
     * @returns Observable con la respuesta del login
     */
    login(correo: string): Observable<LoginResponse> {
        const body: LoginUsuarioRequest = { correo };

        return this.http.post<LoginResponse>(
            API_ENDPOINTS.LOGIN_USUARIO,
            body,
            { headers: this.headers }
        ).pipe(
            tap((response) => {
                if (response.exito && response.token) {
                    saveAuthToken(response.token);
                }
            }),
            catchError((error) => handleHttpError(error))
        );
    }

    /**
     * Cierra la sesión del usuario
     * Limpia todos los datos de autenticación
     */
    static logout(): void {
        clearAuthData();
    }

    /**
     * Verifica si el usuario está autenticado
     * @returns true si existe un token válido
     */
    static isAuthenticated(): boolean {
        return hasAuthToken();
    }

    /**
     * Obtiene el token actual
     * @returns Token de autenticación o null
     */
    static getToken(): string | null {
        return getAuthToken();
    }
}
