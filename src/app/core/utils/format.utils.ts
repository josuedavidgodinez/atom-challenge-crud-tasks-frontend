/**
 * Convierte un objeto a JSON formateado con indentación
 * @param obj - Objeto a convertir
 * @param spaces - Número de espacios para indentación (default: 2)
 * @returns String JSON formateado
 */
export function toJSON(obj: unknown, spaces: number = 2): string {
    try {
        return JSON.stringify(obj, null, spaces);
    } catch {
        return "Error al formatear JSON";
    }
}
