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
        const token = getAuthToken();

        // Agregar token si existe
        const modifiedRequest = token
            ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
            : request;

        // Manejar errores 401
        return next.handle(modifiedRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    clearAuthData();
                    this.router.navigate(["/login"]);
                }
                return throwError(() => error);
            })
        );
    }
}
