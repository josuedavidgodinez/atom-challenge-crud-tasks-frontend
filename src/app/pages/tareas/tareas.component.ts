import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

import { ConfirmDialogComponent } from "../../components/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogData } from "../../components/confirm-dialog/confirm-dialog.interface";
import { TareaCardComponent } from "../../components/tarea-card/tarea-card.component";
import { TareaCardEvent } from "../../components/tarea-card/tarea-card.interface";
import { TareaDialogComponent } from "../../components/tarea-dialog/tarea-dialog.component";
import { TareaDialogData, TareaDialogResult } from "../../components/tarea-dialog/tarea-dialog.interface";
import { Usuario } from "../../core/interfaces/api-response.interface";
import { EstadoTarea, Tarea } from "../../core/interfaces/tarea.interface";
import { AuthService } from "../../core/services/auth.service";
import { TareasService } from "../../core/services/tareas.service";

/**
 * Componente Container: Listado de Tareas
 *
 */
@Component({
    selector: "app-tareas",
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatSnackBarModule,
        MatIconModule,
        TareaCardComponent
    ],
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
        private readonly router: Router,
        private readonly dialog: MatDialog,
        private readonly snackBar: MatSnackBar
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
     * Abre el diálogo para crear una nueva tarea
     */
    onCreateTarea(): void {
        const dialogData: TareaDialogData = {
            mode: "create"
        };

        const dialogRef = this.dialog.open(TareaDialogComponent, {
            width: "600px",
            maxWidth: "90vw",
            data: dialogData,
            disableClose: false,
            autoFocus: true,
            role: "dialog",
            ariaLabel: "Crear nueva tarea"
        });

        dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: TareaDialogResult | undefined) => {
                if (result?.action === "save" && result.tarea) {
                    this.handleCreateTarea(result.tarea);
                }
            });
    }

    /**
     * Maneja eventos emitidos por las tarjetas de tareas
     */
    onTareaEvent(event: TareaCardEvent): void {
        switch (event.action) {
            case "click":
            case "edit":
                this.handleEditTarea(event.tarea);
                break;
            case "delete":
                this.handleDeleteTarea(event.tarea);
                break;
            case "toggleEstado":
                this.handleToggleEstado(event.tarea);
                break;
            default:
                break;
        }
    }

    /**
     * Maneja la creación de una tarea (con actualización optimista)
     */
    private handleCreateTarea(tareaData: Partial<Tarea>): void {
        if (!tareaData.titulo || !tareaData.descripcion || !tareaData.estado) {
            this.showMessage("Datos de tarea inválidos", "error");
            return;
        }

        // Actualización optimista: agregar tarea temporalmente
        const tempId = `temp-${Date.now()}`;
        const tempTarea: Tarea = {
            id: tempId,
            titulo: tareaData.titulo,
            descripcion: tareaData.descripcion,
            estado: tareaData.estado,
            fecha_de_creacion: {
                _seconds: Math.floor(Date.now() / 1000),
                _nanoseconds: 0
            }
        };

        this.tareas = [tempTarea, ...this.tareas];
        this.showMessage("Creando tarea...", "info");

        // Crear en backend
        this.tareasService.crearTarea({
            titulo: tareaData.titulo,
            descripcion: tareaData.descripcion,
            estado: tareaData.estado
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    if (response.exito) {
                        // Recargar para obtener el ID real del servidor
                        this.loadTareasInBackground();
                        this.showMessage("Tarea creada exitosamente", "success");
                    } else {
                        // Revertir cambio optimista
                        this.tareas = this.tareas.filter((t) => t.id !== tempId);
                        this.showMessage(response.mensaje || "Error al crear la tarea", "error");
                    }
                },
                error: (error) => {
                    // Revertir cambio optimista
                    this.tareas = this.tareas.filter((t) => t.id !== tempId);
                    this.showMessage(error.mensaje || "Error al crear la tarea", "error");
                }
            });
    }

    /**
     * Maneja la edición de una tarea
     */
    private handleEditTarea(tarea: Tarea): void {
        const dialogData: TareaDialogData = {
            tarea,
            mode: "edit"
        };

        const dialogRef = this.dialog.open(TareaDialogComponent, {
            width: "600px",
            maxWidth: "90vw",
            data: dialogData,
            disableClose: false,
            autoFocus: true,
            role: "dialog",
            ariaLabel: "Editar tarea"
        });

        dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: TareaDialogResult | undefined) => {
                if (result?.action === "save" && result.tarea) {
                    this.handleUpdateTarea(result.tarea);
                } else if (result?.action === "delete") {
                    this.handleDeleteTarea(tarea);
                }
            });
    }

    /**
     * Maneja la actualización de una tarea (con actualización optimista)
     */
    private handleUpdateTarea(tareaData: Partial<Tarea>): void {
        if (!tareaData.id || !tareaData.titulo || !tareaData.descripcion || !tareaData.estado) {
            this.showMessage("Datos de tarea inválidos", "error");
            return;
        }

        // Guardar estado anterior para rollback
        const index = this.tareas.findIndex((t) => t.id === tareaData.id);
        if (index === -1) {
            this.showMessage("Tarea no encontrada", "error");
            return;
        }

        const oldTarea = { ...this.tareas[index] };

        // Actualización optimista
        this.tareas[index] = {
            ...this.tareas[index],
            titulo: tareaData.titulo,
            descripcion: tareaData.descripcion,
            estado: tareaData.estado
        };
        this.tareas = [...this.tareas]; // Trigger change detection

        // Actualizar en backend
        this.tareasService.actualizarTarea({
            tareaId: tareaData.id,
            titulo: tareaData.titulo,
            descripcion: tareaData.descripcion,
            estado: tareaData.estado
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    if (response.exito) {
                        this.showMessage("Tarea actualizada exitosamente", "success");
                    } else {
                        // Revertir cambio optimista
                        this.tareas[index] = oldTarea;
                        this.tareas = [...this.tareas];
                        this.showMessage(response.mensaje || "Error al actualizar la tarea", "error");
                    }
                },
                error: (error) => {
                    // Revertir cambio optimista
                    this.tareas[index] = oldTarea;
                    this.tareas = [...this.tareas];
                    this.showMessage(error.mensaje || "Error al actualizar la tarea", "error");
                }
            });
    }

    /**
     * Maneja la eliminación de una tarea con confirmación
     */
    private handleDeleteTarea(tarea: Tarea): void {
        const confirmData: ConfirmDialogData = {
            title: "Eliminar Tarea",
            message:
            `¿Estás seguro de que deseas eliminar la tarea "${tarea.titulo}"? Esta acción no se puede deshacer.`,
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            type: "danger"
        };

        const confirmRef = this.dialog.open(ConfirmDialogComponent, {
            width: "400px",
            maxWidth: "90vw",
            data: confirmData,
            role: "alertdialog",
            ariaLabel: "Confirmar eliminación de tarea"
        });

        confirmRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((confirmed: boolean) => {
                if (confirmed && tarea.id) {
                    this.deleteTarea(tarea.id);
                }
            });
    }

    /**
     * Elimina una tarea (con actualización optimista)
     */
    private deleteTarea(tareaId: string): void {
        // Guardar tarea para rollback
        const index = this.tareas.findIndex((t) => t.id === tareaId);
        if (index === -1) {
            this.showMessage("Tarea no encontrada", "error");
            return;
        }

        const deletedTarea = { ...this.tareas[index] };

        // Actualización optimista: eliminar de la UI
        this.tareas = this.tareas.filter((t) => t.id !== tareaId);
        this.showMessage("Eliminando tarea...", "info");

        // Eliminar en backend
        this.tareasService.eliminarTarea(tareaId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    if (response.exito) {
                        this.showMessage("Tarea eliminada exitosamente", "success");
                    } else {
                        // Revertir cambio optimista
                        this.tareas = [...this.tareas, deletedTarea].sort((a, b) => {
                            // eslint-disable-next-line no-underscore-dangle
                            const aTime = a.fecha_de_creacion?._seconds || 0;
                            // eslint-disable-next-line no-underscore-dangle
                            const bTime = b.fecha_de_creacion?._seconds || 0;
                            return bTime - aTime;
                        });
                        this.showMessage(response.mensaje || "Error al eliminar la tarea", "error");
                    }
                },
                error: (error) => {
                    // Revertir cambio optimista
                    this.tareas = [...this.tareas, deletedTarea].sort((a, b) => {
                        // eslint-disable-next-line no-underscore-dangle
                        const aTime = a.fecha_de_creacion?._seconds || 0;
                        // eslint-disable-next-line no-underscore-dangle
                        const bTime = b.fecha_de_creacion?._seconds || 0;
                        return bTime - aTime;
                    });
                    this.showMessage(error.mensaje || "Error al eliminar la tarea", "error");
                }
            });
    }

    /**
     * Maneja el cambio de estado de una tarea (con actualización optimista)
     */
    private handleToggleEstado(tarea: Tarea): void {
        if (!tarea.id) {
            this.showMessage("ID de tarea inválido", "error");
            return;
        }

        const index = this.tareas.findIndex((t) => t.id === tarea.id);
        if (index === -1) {
            this.showMessage("Tarea no encontrada", "error");
            return;
        }

        const oldEstado = tarea.estado;
        const nuevoEstado: EstadoTarea = tarea.estado === "P" ? "C" : "P";

        // Actualización optimista
        this.tareas[index] = {
            ...this.tareas[index],
            estado: nuevoEstado
        };
        this.tareas = [...this.tareas]; // Trigger change detection

        // Actualizar en backend
        this.tareasService.actualizarTarea({
            tareaId: tarea.id,
            titulo: tarea.titulo,
            descripcion: tarea.descripcion,
            estado: nuevoEstado
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    if (response.exito) {
                        const mensaje = nuevoEstado === "C"
                            ? "Tarea marcada como completada"
                            : "Tarea marcada como pendiente";
                        this.showMessage(mensaje, "success");
                    } else {
                        // Revertir cambio optimista
                        this.tareas[index] = {
                            ...this.tareas[index],
                            estado: oldEstado
                        };
                        this.tareas = [...this.tareas];
                        this.showMessage(response.mensaje || "Error al actualizar el estado", "error");
                    }
                },
                error: (error) => {
                    // Revertir cambio optimista
                    this.tareas[index] = {
                        ...this.tareas[index],
                        estado: oldEstado
                    };
                    this.tareas = [...this.tareas];
                    this.showMessage(error.mensaje || "Error al actualizar el estado", "error");
                }
            });
    }

    /**
     * Muestra un mensaje usando SnackBar
     */
    private showMessage(message: string, type: "success" | "error" | "info"): void {
        let panelClass = "";
        switch (type) {
            case "success":
                panelClass = "snackbar-success";
                break;
            case "error":
                panelClass = "snackbar-error";
                break;
            default:
                panelClass = "snackbar-info";
                break;
        }
        this.snackBar.open(message, "Cerrar", {
            duration: 4000,
            horizontalPosition: "end",
            verticalPosition: "top",
            panelClass: [panelClass]
        });
    }

    /**
     * Retorna el número de tareas completadas
     */
    get tareasCompletadas(): number {
        return this.tareas.filter((t) => t.estado === "C").length;
    }

    /**
     * Retorna el número de tareas pendientes
     */
    get tareasPendientes(): number {
        return this.tareas.filter((t) => t.estado === "P").length;
    }

    /**
     * TrackBy function para optimizar el renderizado de la lista
     */
    // eslint-disable-next-line class-methods-use-this
    trackByTareaId(_index: number, tarea: Tarea): string | undefined {
        return tarea.id;
    }

    /**
     * Carga las tareas en background sin mostrar el loader bloqueante
     * Se usa después de actualizaciones optimistas para sincronizar con el backend
     * @private
     */
    private loadTareasInBackground(): void {
        this.tareasService.obtenerTareas()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    if (response.exito && response.datos) {
                        this.tareas = response.datos;
                    }
                },
                error: () => {
                    // Error silencioso - la UI ya muestra el estado optimista
                    // Si hay un error crítico, se mostrará en la próxima carga manual
                }
            });
    }
}
