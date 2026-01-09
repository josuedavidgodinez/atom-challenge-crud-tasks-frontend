import { Routes } from "@angular/router";

import { authGuard } from "./core/guards/auth.guard";
import { guestGuard } from "./core/guards/guest.guard";

export const routes: Routes = [
    {
        path: "login",
        loadComponent: () => import("./pages/login/login.component").then((m) => m.LoginComponent),
        canActivate: [guestGuard]
    },
    {
        path: "",
        loadComponent: () => import("./pages/tareas/tareas.component").then((m) => m.TareasComponent),
        canActivate: [authGuard]
    },
    {
        path: "**",
        redirectTo: "/"
    }
];
