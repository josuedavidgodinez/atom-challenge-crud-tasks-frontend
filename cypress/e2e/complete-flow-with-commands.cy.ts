/**
 * Test E2E: Flujo Completo usando Comandos Personalizados
 * 
 * Este test utiliza los comandos personalizados de Cypress
 * para una sintaxis más limpia y reutilizable.
 */

describe('Flujo Completo con Comandos Personalizados', () => {
  let testEmail: string;

  const tareaOriginal = {
    titulo: 'Tarea Original - Test Cypress',
    descripcion: 'Descripción original de la tarea creada por el test automatizado de Cypress.'
  };

  const tareaActualizada = {
    titulo: 'Tarea Modificada - Test Cypress',
    descripcion: 'Descripción modificada de la tarea actualizada por el test automatizado.'
  };

  before(() => {
    // Generar email único antes de todos los tests
    cy.generateUniqueEmail().then(email => {
      testEmail = email;
      cy.log(`📧 Email generado: ${testEmail}`);
    });
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Flujo completo: registro → logout → login → CRUD tareas', () => {
    // PASO 1: Crear usuario nuevo
    cy.log('📝 Creando nuevo usuario...');
    cy.login(testEmail, true);
    cy.get('.user-info').should('contain', testEmail);

    // PASO 2: Cerrar sesión
    cy.log('🚪 Cerrando sesión...');
    cy.waitForBackend(2000);
    cy.logout();

    // PASO 3: Volver a iniciar sesión
    cy.log('🔑 Iniciando sesión nuevamente...');
    cy.waitForBackend(2000);
    cy.login(testEmail, false);

    // PASO 4: Crear tarea
    cy.log('➕ Creando tarea...');
    cy.waitForBackend(2000);
    cy.createTarea(tareaOriginal.titulo, tareaOriginal.descripcion, false);

    // Verificar que la tarea se creó
    cy.get('app-tarea-card').should('have.length', 1);
    cy.get('.tarea-titulo, .tarea-title').should('contain', tareaOriginal.titulo);
    cy.get('.tarea-estado-badge').should('contain', 'Pendiente');

    // PASO 5: Editar tarea
    cy.log('✏️ Editando tarea...');
    cy.waitForBackend(2000);
    cy.editTarea(0, tareaActualizada.titulo, tareaActualizada.descripcion, true);

    // Verificar que la tarea se actualizó
    cy.get('.tarea-titulo, .tarea-title').should('contain', tareaActualizada.titulo);
    cy.get('.tarea-estado-badge').should('contain', 'Completada');
    cy.get('app-tarea-card .tarea-card').first().should('have.class', 'tarea-completada');

    // PASO 6: Eliminar tarea
    cy.log('🗑️ Eliminando tarea...');
    cy.waitForBackend(2000);
    cy.deleteTarea(0);

    // Verificar que la tarea se eliminó
    cy.get('app-tarea-card').should('not.exist');
    cy.get('.empty-state').should('be.visible');
    cy.get('.empty-title').should('contain', 'No tienes tareas');

    cy.log('🎉 Flujo completo exitoso!');
  });
});

describe('Tests Individuales de Funcionalidades', () => {
  let testEmail: string;

  before(() => {
    cy.generateUniqueEmail().then(email => {
      testEmail = email;
    });
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Autenticación', () => {
    it('Debería mostrar la página de login correctamente', () => {
      cy.visit('/login');
      
      cy.get('h1.login-title')
        .should('be.visible')
        .and('contain', 'Iniciar Sesión');
      
      cy.get('input[formControlName="correo"]')
        .should('be.visible');
      
      cy.get('button[type="submit"]')
        .should('be.visible')
        .and('contain', 'Iniciar Sesión');
    });

    it('Debería validar el formato del email', () => {
      cy.visit('/login');
      
      // Ingresar email inválido
      cy.get('input[formControlName="correo"]')
        .type('email-invalido');
      
      cy.get('button[type="submit"]').click();
      
      // Debería mostrar error de validación
      cy.get('mat-error').should('be.visible');
    });

    it('Debería mostrar diálogo de confirmación para usuario nuevo', () => {
      cy.visit('/login');
      
      const uniqueEmail = `new_user_${Date.now()}@test.com`;
      
      cy.get('input[formControlName="correo"]')
        .type(uniqueEmail);
      
      cy.get('button[type="submit"]').click();
      
      // Esperar y verificar diálogo
      cy.get('.confirm-dialog', { timeout: 15000 })
        .should('be.visible');
      
      cy.get('.confirm-dialog h2')
        .should('contain', 'Usuario no encontrado');
      
      // Cancelar para no crear el usuario
      cy.get('.cancel-button').click();
      
      // Verificar que seguimos en login
      cy.url().should('include', '/login');
    });
  });

  describe('Gestión de Tareas', () => {
    beforeEach(() => {
      // Login antes de cada test de tareas
      cy.login(testEmail, true);
    });

    it('Debería mostrar estado vacío cuando no hay tareas', () => {
      // Si ya hay tareas, las eliminamos
      cy.get('body').then($body => {
        if ($body.find('app-tarea-card').length > 0) {
          // Eliminar todas las tareas
          cy.get('app-tarea-card').each(() => {
            cy.waitForBackend(1000);
            cy.deleteTarea(0);
          });
        }
      });

      cy.get('.empty-state', { timeout: 15000 })
        .should('be.visible');
      
      cy.get('.empty-title')
        .should('contain', 'No tienes tareas');
    });

    it('Debería abrir el diálogo de nueva tarea', () => {
      cy.get('button[aria-label="Crear nueva tarea"]')
        .click();
      
      cy.get('.tarea-dialog')
        .should('be.visible');
      
      cy.get('.dialog-title')
        .should('contain', 'Nueva Tarea');
      
      // Verificar campos del formulario
      cy.get('input[formControlName="titulo"]')
        .should('be.visible');
      
      cy.get('textarea[formControlName="descripcion"]')
        .should('be.visible');
      
      cy.get('.estado-field mat-checkbox')
        .should('be.visible');
      
      // Cancelar
      cy.get('button[aria-label="Cancelar"]').click();
      
      cy.get('.tarea-dialog').should('not.exist');
    });

    it('Debería validar campos requeridos al crear tarea', () => {
      cy.get('button[aria-label="Crear nueva tarea"]')
        .click();
      
      cy.get('.tarea-dialog')
        .should('be.visible');
      
      // Intentar guardar sin llenar campos
      cy.get('button[aria-label="Guardar tarea"]')
        .should('be.disabled');
      
      // Llenar solo título (muy corto)
      cy.get('input[formControlName="titulo"]')
        .type('AB');
      
      cy.get('button[aria-label="Guardar tarea"]')
        .should('be.disabled');
      
      // Cancelar
      cy.get('button[aria-label="Cancelar"]').click();
    });

    it('Debería crear una tarea correctamente', () => {
      const titulo = `Test Task ${Date.now()}`;
      const descripcion = 'Esta es una descripción de prueba para el test de creación de tarea.';
      
      cy.createTarea(titulo, descripcion, false);
      
      cy.get('app-tarea-card').should('exist');
      cy.get('.tarea-title').should('contain', titulo);
      cy.get('.tarea-descripcion').should('contain', descripcion);
      cy.get('.tarea-estado-badge').should('contain', 'Pendiente');
    });

    it('Debería editar una tarea existente', () => {
      // Primero crear una tarea si no existe
      cy.get('body').then($body => {
        if ($body.find('app-tarea-card').length === 0) {
          cy.createTarea('Tarea para editar', 'Descripción para editar');
        }
      });

      cy.waitForBackend(2000);

      const nuevoTitulo = `Editada ${Date.now()}`;
      
      cy.editTarea(0, nuevoTitulo, undefined, true);
      
      cy.get('.tarea-title').first().should('contain', nuevoTitulo);
      cy.get('.tarea-estado-badge').first().should('contain', 'Completada');
    });

    it('Debería eliminar una tarea', () => {
      // Asegurar que existe al menos una tarea
      cy.get('body').then($body => {
        if ($body.find('app-tarea-card').length === 0) {
          cy.createTarea('Tarea para eliminar', 'Descripción de tarea a eliminar');
        }
      });

      cy.waitForBackend(2000);

      // Contar tareas antes
      cy.get('app-tarea-card').then($cards => {
        const countBefore = $cards.length;
        
        cy.deleteTarea(0);
        
        if (countBefore === 1) {
          cy.get('app-tarea-card').should('not.exist');
        } else {
          cy.get('app-tarea-card').should('have.length', countBefore - 1);
        }
      });
    });

    it('Debería cambiar el estado de una tarea usando el checkbox', () => {
      // Asegurar que existe una tarea
      cy.get('body').then($body => {
        if ($body.find('app-tarea-card').length === 0) {
          cy.createTarea('Tarea para toggle', 'Descripción de tarea para cambiar estado');
        }
      });

      cy.waitForBackend(2000);

      // Click en el checkbox de la primera tarea
      cy.get('app-tarea-card .tarea-checkbox mat-checkbox')
        .first()
        .click();
      
      cy.waitForBackend(3000);
      
      // Verificar que el estado cambió
      cy.get('app-tarea-card .tarea-card')
        .first()
        .should('have.class', 'tarea-completada');
    });
  });

  describe('Navegación y Guards', () => {
    it('Debería redirigir a login si no está autenticado', () => {
      cy.visit('/');
      
      // Debería redirigir a login
      cy.url({ timeout: 10000 }).should('include', '/login');
    });

    it('Debería redirigir a home si ya está autenticado', () => {
      // Primero login
      cy.login(testEmail, true);
      
      // Intentar ir a login
      cy.visit('/login');
      
      // Debería redirigir a home
      cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');
    });
  });
});
