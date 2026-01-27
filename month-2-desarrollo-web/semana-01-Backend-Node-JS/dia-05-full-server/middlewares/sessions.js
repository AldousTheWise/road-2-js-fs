// middlewares / sessions.js
const { Logger } = require("./logger.js");
const crypto = require("crypto");

class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.SESSION_DURATION = 24 * 60 * 60 * 1000;
  }

  generateSessionID() {
    return crypto.randomBytes(32).toString("hex");
  }

  createSession(user) {
    const sessionId = this.generateSessionID();
    const expiresAt = Date.now() + this.SESSION_DURATION;

    this.sessions.set(sessionId, {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      expiresAt,
    });

    Logger.info(
      `Sesión creada para: ${user.email} (${sessionId.substring(0, 8)}...)`,
    );
    return { sessionId, expiresAt };
  }

  getSession(sessionId) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    // Verificar expiración
    if (session.expiresAt < Date.now()) {
      this.sessions.delete(sessionId);
      Logger.info(`Sesión expirada: ${sessionId.substring(0, 8)}...`);
      return null;
    }

    // Actualizar tiempo de expiración
    session.expiresAt = Date.now() + this.SESSION_DURATION;

    return session;
  }

  destroySession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      Logger.info(`Sesión destruida para: ${session.email}`);
    }
    this.sessions.delete(sessionId);
  }

  cleanupExpiredSessions() {
    const now = Date.now();
    let count = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(sessionId);
        count++;
      }
    }

    if (count > 0) {
      Logger.info(`Limpieza de sesiones: ${count} expiradas eliminadas`);
    }
  }
}

// Singleton
const sessionManager = new SessionManager();

// Limpiar sesiones expiradas cada hora
setInterval(
  () => {
    sessionManager.cleanupExpiredSessions();
  },
  60 * 60 * 1000,
);

// Middleware de sesiones
function sessionMiddleware(context, next) {
  // Buscar cookie de sesión
  const cookieHeader = context.request.headers.cookie;
  let session = null;

  if (cookieHeader) {
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split("=");
      acc[name] = value;
      return acc;
    }, {});

    const sessionId = cookies.sessionId;
    if (sessionId) {
      session = sessionManager.getSession(sessionId);
    }
  }

  // Agregar sesión al contexto
  context.session = session;
  context.sessionManager = sessionManager;

  next();
}

module.exports = sessionMiddleware;
module.exports.sessionManager = sessionManager;
