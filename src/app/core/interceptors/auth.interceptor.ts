import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { clearAuthData, getAuthToken } from "../utils/storage.utils";

/**
 * Interceptor HTTP para agregar token de autenticación
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private readonly router: Router
    ) { }

    /**
     * Intercepta las peticiones HTTP
     * @param request - Petición HTTP original
     * @param next - Handler para continuar la cadena de petición
     * @returns Observable del evento HTTP
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Obtener token
        const token = getAuthToken();

        // Si existe token, agregarlo al header Authorization
        let modifiedRequest = request;
        if (token) {
            modifiedRequest = AuthInterceptor.addTokenToRequest(request, token);
        }

        // Continuar con la petición y manejar errores de autenticación
        return next.handle(modifiedRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                // Si es error 401 (No autorizado), limpiar sesión y redirigir a login
                if (error.status === 401) {
                    this.handleUnauthorizedError();
                }
                return throwError(() => error);
            })
        );
    }

    /**
     * Agrega el token Bearer al header de la petición
     * @param request - Petición HTTP original
     * @param token - Token de autenticación
     * @returns Petición HTTP clonada con el token
     */
    private static addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    /**
     * Maneja errores de autorización
     * Limpia la sesión y redirige al login
     */
    private handleUnauthorizedError(): void {
        clearAuthData();
        this.router.navigate(["/login"]);
    }
}
