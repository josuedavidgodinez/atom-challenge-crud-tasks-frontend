import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";

import { ConfirmDialogData } from "./confirm-dialog.interface";

/**
 * Componente Modal: Diálogo de Confirmación
 */
@Component({
    selector: "app-confirm-dialog",
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: "./confirm-dialog.component.html",
    styleUrl: "./confirm-dialog.component.scss"
})
export class ConfirmDialogComponent {
    constructor(
        private readonly dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) {
        // Valores por defecto
        this.data.confirmText = this.data.confirmText || "Confirmar";
        this.data.cancelText = this.data.cancelText || "Cancelar";
        this.data.type = this.data.type || "warn";
    }

    /**
     * Maneja la confirmación
     */
    onConfirm(): void {
        this.dialogRef.close(true);
    }

    /**
     * Maneja la cancelación
     */
    onCancel(): void {
        this.dialogRef.close(false);
    }

    /**
     * Retorna el ícono según el tipo
     */
    get icon(): string {
        switch (this.data.type) {
            case "danger":
                return "error";
            case "warn":
                return "warning";
            case "info":
                return "info";
            default:
                return "help";
        }
    }

    /**
     * Retorna el color del botón según el tipo
     */
    get buttonColor(): "warn" | "primary" {
        return this.data.type === "danger" || this.data.type === "warn" ? "warn" : "primary";
    }
}
