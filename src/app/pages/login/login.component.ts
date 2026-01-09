import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

import { ConfirmCreateUserDialogComponent }
    from "../../components/confirm-create-user-dialog/confirm-create-user-dialog.component";
import { AuthService } from "../../core/services/auth.service";

/**
 * Componente de Login
 */
@Component({
    selector: "app-login",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDialogModule
    ],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss"
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm!: FormGroup;
    loading = false;
    errorMessage = "";
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly fb: FormBuilder,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Inicializa el formulario con validaciones
     */
    private initForm(): void {
        this.loginForm = this.fb.group({
            correo: ["", [Validators.required, Validators.email]]
        });
    }

    /**
     * Maneja el envío del formulario
     */
    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.markFormAsTouched();
            return;
        }

        const { correo } = this.loginForm.value;
        this.attemptLogin(correo);
    }

    /**
     * Intenta hacer login con el correo
     * @param correo - Email del usuario
     */
    private attemptLogin(correo: string): void {
        this.loading = true;
        this.errorMessage = "";

        this.authService.login(correo)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.loading = false;
                    if (response.exito) {
                        // Usuario existe, navegar a principal
                        this.navigateToPrincipal();
                    }
                },
                error: (error) => {
                    this.loading = false;
                    // Usuario no existe, mostrar modal de confirmación
                    if (error.mensaje?.toLowerCase().includes("no encontrado")) {
                        this.showCreateUserConfirmation(correo);
                    } else {
                        this.errorMessage = error.mensaje || "Error al iniciar sesión";
                    }
                }
            });
    }

    /**
     * Muestra el modal de confirmación para crear usuario
     * @param correo - Email del usuario
     */
    private showCreateUserConfirmation(correo: string): void {
        const dialogRef = this.dialog.open(ConfirmCreateUserDialogComponent, {
            width: "400px",
            data: { correo },
            disableClose: true,
            role: "dialog",
            ariaLabelledBy: "confirm-dialog-title"
        });

        dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.createUser(correo);
                }
            });
    }

    /**
     * Crea un nuevo usuario
     * @param correo - Email del usuario
     */
    private createUser(correo: string): void {
        this.loading = true;
        this.errorMessage = "";

        this.authService.crearUsuario(correo)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    if (response.exito) {
                        // Usuario creado, hacer login automático
                        this.attemptLogin(correo);
                    } else {
                        this.loading = false;
                        this.errorMessage = response.mensaje;
                    }
                },
                error: (error) => {
                    this.loading = false;
                    this.errorMessage = error.mensaje || "Error al crear usuario";
                }
            });
    }

    /**
     * Navega a la página principal
     */
    private navigateToPrincipal(): void {
        this.router.navigate(["/"]).catch(() => {
            this.errorMessage = "Error al navegar a la página principal";
        });
    }

    /**
     * Marca todos los campos del formulario como touched
     */
    private markFormAsTouched(): void {
        Object.keys(this.loginForm.controls).forEach((key) => {
            this.loginForm.get(key)?.markAsTouched();
        });
    }

    /**
     * Verifica si un campo tiene errores y ha sido tocado
     * @param fieldName - Nombre del campo
     */
    hasError(fieldName: string): boolean {
        const field = this.loginForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    /**
     * Obtiene el mensaje de error de un campo
     * @param fieldName - Nombre del campo
     */
    getErrorMessage(fieldName: string): string {
        const field = this.loginForm.get(fieldName);
        if (!field) {
            return "";
        }

        if (field.hasError("required")) {
            return "El correo electrónico es requerido";
        }
        if (field.hasError("email")) {
            return "Ingresa un correo electrónico válido";
        }

        return "";
    }
}
