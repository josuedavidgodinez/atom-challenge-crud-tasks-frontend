import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { AuthService } from "../services/auth.service";

/**
 * Guard para rutas públicas (login, registro)
 */
export const guestGuard: CanActivateFn = () => {
    const router = inject(Router);

    // Si el usuario está autenticado, redirigir a página principal
    if (AuthService.isAuthenticated()) {
        router.navigate(["/"]);
        return false;
    }

    // Si no está autenticado, permitir acceso
    return true;
};
