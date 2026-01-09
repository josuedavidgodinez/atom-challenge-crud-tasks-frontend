import { ApiResponse, Usuario } from "./api-response.interface";

/**
 * Request para crear un nuevo usuario
 */
export interface CrearUsuarioRequest {
    correo: string;
}

/**
 * Request para login de usuario
 */
export interface LoginUsuarioRequest {
    correo: string;
}

/**
 * Response del login con token y datos de usuario
 */
export interface LoginResponse extends ApiResponse {
    token: string;
    usuario: Usuario;
}
