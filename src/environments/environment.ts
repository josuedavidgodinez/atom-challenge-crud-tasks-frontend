/**
 * Configuración de entorno para DESARROLLO
 */
export const environment = {
    production: false,
    apiEndpoints: {
        crearUsuario: "https://crearusuario-dpnddtqc3a-uc.a.run.app",
        loginUsuario: "https://loginusuario-dpnddtqc3a-uc.a.run.app",
        crearTarea: "https://creartarea-dpnddtqc3a-uc.a.run.app",
        obtenerTareas: "https://obtenertareasporusuario-dpnddtqc3a-uc.a.run.app",
        actualizarTarea: "https://actualizartarea-dpnddtqc3a-uc.a.run.app",
        eliminarTarea: "https://eliminartarea-dpnddtqc3a-uc.a.run.app"
    },
    firebase: {
        apiKey: "YOUR_FIREBASE_API_KEY_HERE",
        signInWithCustomTokenUrl: "https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken"
    }
};
