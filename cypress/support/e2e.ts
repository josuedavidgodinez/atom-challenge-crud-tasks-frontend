// ***********************************************************
// This file is processed and loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import './commands';

// Configuración global para manejar excepciones no capturadas
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retornar false previene que Cypress falle el test
  // cuando hay errores no capturados en la aplicación
  console.log('Uncaught exception:', err.message);
  return false;
});

// Configuración de tiempos de espera por defecto
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('requestTimeout', 15000);
Cypress.config('responseTimeout', 30000);
