import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

import { ConfirmCreateUserDialogData } from "./confirm-create-user-dialog.interface";

/**
 * Componente de diálogo para confirmar la creación de usuario
 *
 */
@Component({
    selector: "app-confirm-create-user-dialog",
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    templateUrl: "./confirm-create-user-dialog.component.html",
    styleUrl: "./confirm-create-user-dialog.component.scss"
})
export class ConfirmCreateUserDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmCreateUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmCreateUserDialogData
    ) {}

    /**
     * Maneja la confirmación del usuario
     */
    onConfirm(): void {
        this.dialogRef.close(true);
    }

    /**
     * Maneja la cancelación del usuario
     */
    onCancel(): void {
        this.dialogRef.close(false);
    }
}
