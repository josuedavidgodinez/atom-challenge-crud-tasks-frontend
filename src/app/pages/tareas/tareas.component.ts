import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

import { Usuario } from "../../core/interfaces/api-response.interface";
import { Tarea } from "../../core/interfaces/tarea.interface";
import { AuthService } from "../../core/services/auth.service";
import { TareasService } from "../../core/services/tareas.service";
import { toJSON } from "../../core/utils/format.utils";

/**
 * Componente de Página Principal - Listado de Tareas
 * Muestra JSON simple de tareas sin formato (por ahora)
 */
@Component({
    selector: "app-tareas",
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: "./tareas.component.html",
    styleUrl: "./tareas.component.scss"
})
export class TareasComponent implements OnInit, OnDestroy {
    tareas: Tarea[] = [];
    usuario: Usuario | null = null;
    loading = false;
    errorMessage = "";
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly tareasService: TareasService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.loadUser();
        this.loadTareas();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Carga la información del usuario actual
     */
    private loadUser(): void {
        this.usuario = AuthService.getUserData();
    }

    /**
     * Carga el listado de tareas
     */
    loadTareas(): void {
        this.loading = true;
        this.errorMessage = "";

        this.tareasService.obtenerTareas()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.loading = false;
                    if (response.exito && response.datos) {
                        this.tareas = response.datos;
                    } else {
                        this.errorMessage = response.mensaje;
                    }
                },
                error: (error) => {
                    this.loading = false;
                    this.errorMessage = error.mensaje || "Error al cargar las tareas";
                }
            });
    }

    /**
     * Maneja el cierre de sesión
     */
    onLogout(): void {
        AuthService.logout();
        this.router.navigate(["/login"]).catch(() => {
            this.errorMessage = "Error al cerrar sesión";
        });
    }

    /**
     * Expone toJSON para uso en el template
     */
    readonly toJSON = toJSON;
}
