import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { AuthService } from "../services/auth.service";

/**
 * Guard de autenticación para proteger rutas
 */
export const authGuard: CanActivateFn = () => {
    const router = inject(Router);

    // Verificar si el usuario está autenticado
    if (AuthService.isAuthenticated()) {
        return true;
    }

    // Si no está autenticado, redirigir al login
    router.navigate(["/login"]);
    return false;
};
