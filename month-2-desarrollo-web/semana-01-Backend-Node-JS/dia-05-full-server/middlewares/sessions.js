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
    const expiredAt = Date.now() + this.SESSION_DURATION;

    this.sessions.set(sessionId, {
      userId: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      expiresAt,
    });
  }
}
