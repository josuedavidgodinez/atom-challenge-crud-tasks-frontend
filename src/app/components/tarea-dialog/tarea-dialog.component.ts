import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

import { EstadoTarea } from "../../core/interfaces/tarea.interface";
import { TareaDialogData, TareaDialogResult } from "./tarea-dialog.interface";

/**
 * Componente Modal: Diálogo de Tarea
 *
 */
@Component({
    selector: "app-tarea-dialog",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule
    ],
    templateUrl: "./tarea-dialog.component.html",
    styleUrl: "./tarea-dialog.component.scss"
})
export class TareaDialogComponent implements OnInit {
    tareaForm!: FormGroup;
    isEditMode = false;
    formChanged = false;

    constructor(
        private readonly fb: FormBuilder,
        private readonly dialogRef: MatDialogRef<TareaDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TareaDialogData
    ) {}

    ngOnInit(): void {
        this.isEditMode = this.data.mode === "edit";
        this.initForm();
        this.setupFormChangeDetection();
    }

    /**
     * Inicializa el formulario con los datos de la tarea o valores por defecto
     */
    private initForm(): void {
        const { tarea } = this.data;

        this.tareaForm = this.fb.group({
            titulo: [
                tarea?.titulo || "",
                [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
            ],
            descripcion: [
                tarea?.descripcion || "",
                [Validators.required, Validators.minLength(5), Validators.maxLength(500)]
            ],
            estado: [tarea?.estado || "P"]
        });
    }

    /**
     * Configura la detección de cambios en el formulario
     */
    private setupFormChangeDetection(): void {
        this.tareaForm.valueChanges.subscribe(() => {
            this.formChanged = this.tareaForm.dirty;
        });
    }

    /**
     * Maneja el guardado de la tarea
     */
    onSave(): void {
        if (this.tareaForm.invalid) {
            this.tareaForm.markAllAsTouched();
            return;
        }

        const result: TareaDialogResult = {
            action: "save",
            tarea: {
                ...this.data.tarea,
                ...this.tareaForm.value
            }
        };

        this.dialogRef.close(result);
    }

    /**
     * Maneja la eliminación de la tarea
     */
    onDelete(): void {
        const result: TareaDialogResult = {
            action: "delete",
            tarea: this.data.tarea
        };

        this.dialogRef.close(result);
    }

    /**
     * Maneja la cancelación del diálogo
     */
    onCancel(): void {
        const result: TareaDialogResult = {
            action: "cancel"
        };

        this.dialogRef.close(result);
    }

    /**
     * Toggle del estado de la tarea
     */
    onToggleEstado(): void {
        const currentEstado = this.tareaForm.get("estado")?.value as EstadoTarea;
        const newEstado: EstadoTarea = currentEstado === "P" ? "C" : "P";
        this.tareaForm.patchValue({ estado: newEstado });
    }

    /**
     * Retorna true si el campo tiene errores y ha sido tocado
     */
    hasError(field: string, error: string): boolean {
        const control = this.tareaForm.get(field);
        return !!(control?.hasError(error) && control?.touched);
    }

    /**
     * Retorna el mensaje de error para un campo
     */
    getErrorMessage(field: string): string {
        const control = this.tareaForm.get(field);

        if (control?.hasError("required")) {
            return "Este campo es requerido";
        }

        if (control?.hasError("minlength")) {
            const minLength = control.errors?.["minlength"].requiredLength;
            return `Mínimo ${minLength} caracteres`;
        }

        if (control?.hasError("maxlength")) {
            const maxLength = control.errors?.["maxlength"].requiredLength;
            return `Máximo ${maxLength} caracteres`;
        }

        return "";
    }

    /**
     * Retorna true si la tarea está completada
     */
    get isCompletada(): boolean {
        return this.tareaForm.get("estado")?.value === "C";
    }

    /**
     * Retorna el título del diálogo según el modo
     */
    get dialogTitle(): string {
        return this.isEditMode ? "Editar Tarea" : "Nueva Tarea";
    }

    /**
     * Retorna true si se puede guardar (formulario válido y cambiado o modo creación)
     */
    get canSave(): boolean {
        return this.tareaForm.valid && (this.formChanged || !this.isEditMode);
    }
}
