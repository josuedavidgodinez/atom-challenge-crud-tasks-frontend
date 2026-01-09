import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // La baseUrl se puede sobrescribir con la variable de entorno CYPRESS_BASE_URL
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:4200',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true, // Habilitado para CI - útil para debugging
    screenshotOnRunFailure: true,
    // Configuración para evitar problemas de CORS y estabilidad en CI
    chromeWebSecurity: false, // Deshabilita seguridad web para evitar CORS
    experimentalModifyObstructiveThirdPartyCode: true,
    // Tiempos de espera más largos para CI (redes más lentas)
    defaultCommandTimeout: 15000,
    requestTimeout: 20000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    // Reintentos automáticos en caso de fallo (útil para CI)
    retries: {
      runMode: 2, // Reintentos en modo headless (CI)
      openMode: 0  // Sin reintentos en modo interactivo
    },
    setupNodeEvents(on, config) {
      // Configurar baseUrl desde variable de entorno si existe
      const baseUrl = process.env.CYPRESS_BASE_URL;
      if (baseUrl) {
        config.baseUrl = baseUrl;
      }
      return config;
    },
  },
  env: {
    apiEndpoints: {
      crearUsuario: "https://crearusuario-dpnddtqc3a-uc.a.run.app",
      loginUsuario: "https://loginusuario-dpnddtqc3a-uc.a.run.app",
      crearTarea: "https://creartarea-dpnddtqc3a-uc.a.run.app",
      obtenerTareas: "https://obtenertareasporusuario-dpnddtqc3a-uc.a.run.app",
      actualizarTarea: "https://actualizartarea-dpnddtqc3a-uc.a.run.app",
      eliminarTarea: "https://eliminartarea-dpnddtqc3a-uc.a.run.app"
    }
  }
});
