/**
 * Configuración de entorno para PRODUCCIÓN
 */
export const environment = {
    production: true,
    apiEndpoints: {
        crearUsuario: "https://crearusuario-dpnddtqc3a-uc.a.run.app",
        loginUsuario: "https://loginusuario-dpnddtqc3a-uc.a.run.app",
        crearTarea: "https://creartarea-dpnddtqc3a-uc.a.run.app",
        obtenerTareas: "https://obtenertareasporusuario-dpnddtqc3a-uc.a.run.app",
        actualizarTarea: "https://actualizartarea-dpnddtqc3a-uc.a.run.app",
        eliminarTarea: "https://eliminartarea-dpnddtqc3a-uc.a.run.app"
    },
    firebase: {
        // Este valor se inyecta en tiempo de build desde GitHub Secrets
        apiKey: "${FIREBASE_API_KEY}",
        signInWithCustomTokenUrl: "https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken"
    }
};
