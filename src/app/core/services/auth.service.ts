import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import {
    catchError,
    map,
    switchMap,
    tap
} from "rxjs/operators";

import { API_ENDPOINTS, FIREBASE_CONFIG } from "../constants/app.constants";
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
    getUserData,
    hasAuthToken,
    saveAuthToken,
    saveUserData
} from "../utils/storage.utils";

/**
 * Interfaz para la respuesta de Firebase al intercambiar custom token
 */
interface FirebaseTokenResponse {
    idToken: string;
    refreshToken: string;
    expiresIn: string;
}

/**
 * Servicio de autenticación
 */
@Injectable({
    providedIn: "root"
})
export class AuthService {
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
            body
        ).pipe(
            catchError((error) => handleHttpError(error))
        );
    }

    /**
     * Realiza el login de un usuario
     * Intercambia el custom token por un ID token de Firebase
     * Guarda el ID token y datos de usuario en sessionStorage
     * @param correo - Email del usuario
     * @returns Observable con la respuesta del login
     */
    login(correo: string): Observable<LoginResponse> {
        const body: LoginUsuarioRequest = { correo };

        return this.http.post<LoginResponse>(
            API_ENDPOINTS.LOGIN_USUARIO,
            body
        ).pipe(
            switchMap((response) => {
                // Si no hay token, devolver respuesta tal cual
                if (!response.exito || !response.token) {
                    return of(response);
                }

                // Intercambiar custom token por ID token de Firebase
                return this.exchangeCustomTokenForIdToken(response.token).pipe(
                    tap((idToken) => {
                        // Guardar ID token y datos de usuario
                        saveAuthToken(idToken);
                        if (response.usuario) {
                            saveUserData(response.usuario);
                        }
                    }),
                    // Devolver la respuesta original del login
                    map(() => response)
                );
            }),
            catchError((error) => handleHttpError(error))
        );
    }

    /**
     * Intercambia un custom token de Firebase por un ID token
     * @param customToken - Custom token obtenido del backend
     * @returns Observable con el ID token
     */
    private exchangeCustomTokenForIdToken(customToken: string): Observable<string> {
        const url = `${FIREBASE_CONFIG.SIGN_IN_WITH_CUSTOM_TOKEN_URL}?key=${FIREBASE_CONFIG.API_KEY}`;
        const body = {
            token: customToken,
            returnSecureToken: true
        };

        return this.http.post<FirebaseTokenResponse>(url, body).pipe(
            map((firebaseResponse) => {
                if (!firebaseResponse.idToken) {
                    throw new Error("No se pudo obtener el ID token de Firebase");
                }
                // Extraer solo el idToken de la respuesta
                return firebaseResponse.idToken;
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

    /**
     * Obtiene los datos del usuario actual
     * @returns Datos del usuario o null
     */
    static getUserData<T = unknown>(): T | null {
        return getUserData<T>();
    }
}
