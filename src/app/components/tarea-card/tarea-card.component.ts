import { CommonModule } from "@angular/common";
import {
    Component,
    EventEmitter,
    Input,
    Output
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

import { Tarea } from "../../core/interfaces/tarea.interface";
import { TareaCardConfig, TareaCardEvent } from "./tarea-card.interface";

/**
 * Componente Presentacional: Tarjeta de Tarea
 */
@Component({
    selector: "app-tarea-card",
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatTooltipModule
    ],
    templateUrl: "./tarea-card.component.html",
    styleUrl: "./tarea-card.component.scss"
})
export class TareaCardComponent {
    @Input({ required: true }) tarea!: Tarea;
    @Input() config: TareaCardConfig = {
        showEditButton: true,
        showDeleteButton: true,
        showEstadoCheckbox: true,
        clickable: true
    };

    @Output() readonly tareaEvent = new EventEmitter<TareaCardEvent>();

    /**
     * Emite evento cuando se hace click en la tarjeta
     */
    onCardClick(): void {
        if (this.config.clickable) {
            this.tareaEvent.emit({
                tarea: this.tarea,
                action: "click"
            });
        }
    }

    /**
     * Emite evento cuando se hace click en editar
     * @param event - Evento del DOM para prevenir propagación
     */
    onEdit(event: Event): void {
        event.stopPropagation();
        this.tareaEvent.emit({
            tarea: this.tarea,
            action: "edit"
        });
    }

    /**
     * Emite evento cuando se hace click en eliminar
     * @param event - Evento del DOM para prevenir propagación
     */
    onDelete(event: Event): void {
        event.stopPropagation();
        this.tareaEvent.emit({
            tarea: this.tarea,
            action: "delete"
        });
    }

    /**
     * Emite evento cuando cambia el estado del checkbox
     * @param event - Evento del DOM para prevenir propagación
     */
    onToggleEstado(event: Event): void {
        event.stopPropagation();
        this.tareaEvent.emit({
            tarea: this.tarea,
            action: "toggleEstado"
        });
    }

    /**
     * Retorna true si la tarea está completada
     */
    get isCompletada(): boolean {
        return this.tarea.estado === "C";
    }

    /**
     * Formatea la fecha de creación para mostrar
     */
    get fechaFormateada(): string {
        if (!this.tarea.fecha_de_creacion) {
            return "Sin fecha";
        }

        // eslint-disable-next-line no-underscore-dangle
        const fecha = new Date(this.tarea.fecha_de_creacion._seconds * 1000);
        return fecha.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }
}
