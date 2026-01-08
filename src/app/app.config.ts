import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { AuthInterceptor } from "./core/interceptors/auth.interceptor";

/**
 * Configuración principal de la aplicación
 * Incluye todos los providers necesarios siguiendo el principio de Inversión de Dependencias (DIP)
 */
export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        // Configuración de HttpClient con interceptores
        provideHttpClient(withInterceptorsFromDi()),
        // Registro del interceptor de autenticación
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
};
