/**
 * Datos para el diálogo de confirmación
 */
export interface ConfirmDialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "warn" | "danger" | "info";
}
