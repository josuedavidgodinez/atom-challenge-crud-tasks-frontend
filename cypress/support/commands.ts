// ***********************************************
// Comandos personalizados de Cypress para la aplicación de Tareas
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Genera un email único para testing
       * @example cy.generateUniqueEmail().then(email => { ... })
       */
      generateUniqueEmail(): Chainable<string>;

      /**
       * Realiza login con un email
       * @param email - Email del usuario
       * @param createIfNotExists - Si es true, crea el usuario si no existe
       * @example cy.login('test@test.com', true)
       */
      login(email: string, createIfNotExists?: boolean): Chainable<void>;

      /**
       * Cierra sesión del usuario actual
       * @example cy.logout()
       */
      logout(): Chainable<void>;

      /**
       * Crea una nueva tarea
       * @param titulo - Título de la tarea
       * @param descripcion - Descripción de la tarea
       * @param completada - Si la tarea está completada (default: false)
       * @example cy.createTarea('Mi tarea', 'Descripción de la tarea')
       */
      createTarea(titulo: string, descripcion: string, completada?: boolean): Chainable<void>;

      /**
       * Edita una tarea existente
       * @param index - Índice de la tarea a editar (0-based)
       * @param titulo - Nuevo título
       * @param descripcion - Nueva descripción
       * @param completada - Nuevo estado
       * @example cy.editTarea(0, 'Nuevo título', 'Nueva descripción', true)
       */
      editTarea(index: number, titulo?: string, descripcion?: string, completada?: boolean): Chainable<void>;

      /**
       * Elimina una tarea
       * @param index - Índice de la tarea a eliminar (0-based)
       * @example cy.deleteTarea(0)
       */
      deleteTarea(index: number): Chainable<void>;

      /**
       * Espera a que el backend responda (para operaciones lentas)
       * @param ms - Milisegundos a esperar
       * @example cy.waitForBackend(3000)
       */
      waitForBackend(ms?: number): Chainable<void>;
    }
  }
}

// Tiempos de espera configurables
const WAIT_TIMES = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};

// Comando: Generar email único
Cypress.Commands.add('generateUniqueEmail', () => {
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  return cy.wrap(`test_e2e_${uniqueId}@cypress-test.com`);
});

// Comando: Login
Cypress.Commands.add('login', (email: string, createIfNotExists = false) => {
  cy.visit('/login');
  
  cy.get('h1.login-title', { timeout: 10000 })
    .should('be.visible');
  
  cy.get('input[formControlName="correo"]')
    .should('be.visible')
    .clear()
    .type(email);
  
  cy.get('button[type="submit"]')
    .should('not.be.disabled')
    .click();
  
  // Esperar respuesta del backend
  cy.wait(WAIT_TIMES.MEDIUM);
  
  // Verificar si aparece el diálogo de crear usuario o si ya estamos en tareas
  cy.get('body').then($body => {
    // Si aparece el diálogo de confirmación y queremos crear el usuario
    if ($body.find('.confirm-dialog').length > 0 && createIfNotExists) {
      cy.get('.confirm-button')
        .should('be.visible')
        .click();
      
      // Esperar a que se cree el usuario y se haga login automático
      cy.wait(WAIT_TIMES.LONG);
    }
    // Si el usuario ya existe, el login fue exitoso y no hay diálogo
  });
  
  // Verificar que llegamos a la página de tareas
  cy.url({ timeout: 30000 }).should('eq', Cypress.config().baseUrl + '/');
  cy.get('.page-title', { timeout: 15000 }).should('contain', 'Mis Tareas');
});

// Comando: Logout
Cypress.Commands.add('logout', () => {
  cy.get('button[aria-label="Cerrar sesión"]')
    .should('be.visible')
    .click();
  
  cy.url({ timeout: 10000 }).should('include', '/login');
  cy.get('h1.login-title').should('be.visible');
});

// Comando: Crear tarea
Cypress.Commands.add('createTarea', (titulo: string, descripcion: string, completada = false) => {
  cy.get('button[aria-label="Crear nueva tarea"]')
    .should('be.visible')
    .click();
  
  cy.get('.tarea-dialog', { timeout: 10000 })
    .should('be.visible');
  
  cy.get('input[formControlName="titulo"]')
    .type(titulo);
  
  cy.get('textarea[formControlName="descripcion"]')
    .type(descripcion);
  
  if (completada) {
    cy.get('.estado-field mat-checkbox')
      .click();
  }
  
  cy.get('button[aria-label="Guardar tarea"]')
    .should('not.be.disabled')
    .click();
  
  cy.wait(WAIT_TIMES.LONG);
  
  // Verificar que se creó
  cy.get('.tarea-title', { timeout: 15000 })
    .should('contain', titulo);
});

// Comando: Editar tarea
Cypress.Commands.add('editTarea', (index: number, titulo?: string, descripcion?: string, completada?: boolean) => {
  cy.get('app-tarea-card .tarea-card')
    .eq(index)
    .click();
  
  cy.get('.tarea-dialog', { timeout: 10000 })
    .should('be.visible');
  
  if (titulo !== undefined) {
    cy.get('input[formControlName="titulo"]')
      .clear()
      .type(titulo);
  }
  
  if (descripcion !== undefined) {
    cy.get('textarea[formControlName="descripcion"]')
      .clear()
      .type(descripcion);
  }
  
  if (completada !== undefined) {
    cy.get('.estado-label').then($label => {
      const isCurrentlyCompleted = $label.text().includes('Completada');
      if (isCurrentlyCompleted !== completada) {
        cy.get('.estado-field mat-checkbox').click();
      }
    });
  }
  
  cy.get('button[aria-label="Guardar tarea"]')
    .should('not.be.disabled')
    .click();
  
  cy.wait(WAIT_TIMES.LONG);
});

// Comando: Eliminar tarea
Cypress.Commands.add('deleteTarea', (index: number) => {
  cy.get('app-tarea-card button[aria-label="Eliminar tarea"]')
    .eq(index)
    .click();
  
  cy.get('.confirm-dialog', { timeout: 10000 })
    .should('be.visible');
  
  cy.get('button[aria-label="Confirmar acción"]')
    .click();
  
  cy.wait(WAIT_TIMES.LONG);
});

// Comando: Esperar backend
Cypress.Commands.add('waitForBackend', (ms = WAIT_TIMES.MEDIUM) => {
  cy.wait(ms);
});

export {};
