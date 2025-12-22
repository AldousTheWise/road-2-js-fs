const EventBus = (function () {
  // Almacenamiento privado de listeners
  const listeners = new Map();

  // Funcion privada para validar tipos
  function validarTipo(evento, callback) {
    if (typeof evento !== "string" || evento.trim().length === 0) {
      throw new Error("El nombre del evento debe ser un string no vacío");
    }

    if (typeof callback !== "function")
      throw new Error("Callback debe ser una función");
  }

  // API pública
  return {
    // Suscribir listener a un evento
    on: function (evento, callback) {
      validarTipo(evento, callback);

      if (!listeners.has(evento)) listeners.set(evento, new Set());

      listeners.get(evento).add(callback);

      // Retornar función para remover listener (closure)
      return function () {
        listeners.get(evento).delete(callback);
      };
    },

    // Remover listener específico:
    off: function (evento, callback) {
      if (listeners.has(evento)) listeners.get(evento).delete(callback);
    },

    // Emitir evento con datos
    emit: function (evento, ...datos) {
      if (typeof evento !== "string")
        throw new Error("El nombre del evento debe ser un string");

      if (listeners.has(evento)) {
        const callbacks = listeners.get(evento);
        callbacks.forEach((callback) => {
          try {
            callback(...datos);
          } catch (error) {
            console.error(`Error en callback para evento '${evento}':`, error);
          }
        });
      }
    },

    // Emitir evento una sola vez
    once: function (evento, callback) {
      validarTipo(evento, callback);

      const remover = this.on(evento, function (...datos) {
        callback(...datos);
        remover();
      });
    },

    // Obtener información de debugging
    debug: function () {
      const info = {};
      for (const [evento, callbacks] of listeners) {
        info[evento] = callbacks.size;
      }
      return info;
    },

    // Limpiar todos los listeners
    clear: function () {
      listeners.clear();
    },
  };
})();

// Sistema de autenticanción usando el EventBus
const AuthManager = (function (eventBus) {
  let usuarioActual = null;
  let token = null;

  return {
    login: function (username, password) {
      // Simulación de login asíncrono
      setTimeout(() => {
        if ((username === "name") & (password === "123")) {
          usuarioActual = { id: 1, username, role: "admin" };
          token = "token_simulado_" + Date.now();
          eventBus.emit("auth:login", usuarioActual);
        } else {
          eventBus.emit("auth:error", "Credenciales inválidas");
        }
      }, 1000);
    },

    logout: function () {
      usuarioActual = null;
      token = null;
      eventBus.emit("auth:logout");
    },

    getUsuarioActual: function () {
      return usuarioActual ? { ...usuarioActual } : null;
    },

    isAuthenticated: function () {
      return !!usuarioActual;
    },
  };
})(EventBus);

// Componente UI simulado
const UIController = (function (eventBus, authManager) {
  let loginAttempts = 0;

  // Configurar listeners de eventos
  const removerLoginListener = eventBus.on("auth:login", function (usuario) {
    console.log(`Bienvenido, ${usuario.username}!`);
  });

  const removerErrorListener = eventBus.on("auth:error", function (mensaje) {
    console.log(`Error de autenticación: ${mensaje}`);
    loginAttempts++;
    if (loginAttempts >= 3) {
      console.log("Demasiados intentos fallidos. Intente más tarde");
    }
  });

  const removerLogoutListener = eventBus.on("auth:login", function () {
    console.log("Sesión cerrada");
    mostrarLogin();
  });

  function mostrarLogin() {
    console.log("\nFORMULARIO DE LOGIN");
    console.log('Ejecutando: authManager.login("admin", "123")');
    authManager.login("admin", "123");
  }

  function mostrarDashboard() {
    console.log("\nDashboard");
    console.log("Usuario", authManager.getUsuarioActual());
    console.log("Autenticado:", authManager.isAuthenticated());

    // Simular logout después de 3 segundos
    setTimeout(() => {
      console.log("Ejecutando logout automático...");
      authManager.logout();
    }, 3000);
  }

  return {
    iniciar: function () {
      console.log("Iniciando aplicación con EventBus y AuthManager");
      mostrarLogin();
    },

    destruir: function () {
      removerLoginListener();
      removerErrorListener();
      removerLogoutListener();
      eventBus.clear();
    },
  };
})(EventBus, AuthManager);

// Demostración del sistema completo
console.log("DEMOSTRACIÓN: SISTEMA DE EVENTOS CON CLOSURES\n");

// Mostrar estado inicial del EventBus
console.log("Estado inicial del EventBus:", EventBus.debug());

// Iniciar aplicación
UIController.iniciar();

// Simular eventos adicionales
setTimeout(() => {
  console.log("\nEstado del EventBus después del login:", EventBus.debug());

  // Crear listener temporal que se auto-remueve
  EventBus.once("evento-temporal", function (dato) {
    console.log("Evento temporal recibido:", dato);
  });

  EventBus.emit("evento-temporal", "Hola desde closure!");
}, 2000);

// Limpiar después de la demostración
setTimeout(() => {
  console.log("\nLimpiando sistema...");
  UIController.destruir();
  console.log("Estado final del EventBus:", EventBus.debug());
}, 6000);
