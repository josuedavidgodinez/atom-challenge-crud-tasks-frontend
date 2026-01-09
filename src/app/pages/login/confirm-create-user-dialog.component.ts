import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

export interface ConfirmDialogData {
    correo: string;
}

/**
 * Componente de diálogo para confirmar la creación de usuario
 */
@Component({
    selector: "app-confirm-create-user-dialog",
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    template: `
        <div class="confirm-dialog">
            <h2 id="confirm-dialog-title" mat-dialog-title>
                Usuario no encontrado
            </h2>
            <mat-dialog-content>
                <p class="dialog-message">
                    El correo <strong>{{ data.correo }}</strong> no está registrado.
                </p>
                <p class="dialog-question">
                    ¿Deseas crear una nueva cuenta con este correo?
                </p>
            </mat-dialog-content>
            <mat-dialog-actions align="center" class="dialog-actions">
                <button
                    mat-button
                    (click)="onCancel()"
                    aria-label="Cancelar creación de usuario"
                    class="cancel-button"
                >
                    Cancelar
                </button>
                <button
                    mat-raised-button
                    color="primary"
                    (click)="onConfirm()"
                    aria-label="Confirmar creación de usuario"
                    class="confirm-button"
                    cdkFocusInitial
                >
                    Crear Cuenta
                </button>
            </mat-dialog-actions>
        </div>
    `,
    styles: [`
        .confirm-dialog {
            padding: 0;
        }

        .dialog-message {
            margin-bottom: 1rem;
            font-size: 1rem;
            color: var(--text-primary, #333);
        }

        .dialog-question {
            margin-bottom: 0;
            font-size: 1rem;
            font-weight: 500;
            color: var(--text-primary, #333);
        }

        .dialog-actions {
            margin-top: 1.5rem;
            padding: 0;
        }

        .cancel-button,
        .confirm-button {
            min-width: 100px;
        }

        strong {
            color: var(--primary-color, #007bff);
            font-weight: 600;
        }

        // Accessibility
        button:focus-visible {
            outline: 2px solid var(--primary-color, #007bff);
            outline-offset: 2px;
        }
    `]
})
export class ConfirmCreateUserDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmCreateUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
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
