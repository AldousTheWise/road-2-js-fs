// middlewares/auth.js
const { Logger } = require("./logger");
const bcrypt = require("bcryptjs");
const fs = require("fs").promises;
const path = require("path");

class AuthService {
  constructor() {
    this.users = [];
    this.usersPath = path.join(__dirname, "..", "data", "users.json");
    this.loadUsers();
  }

  async loadUsers() {
    try {
      const data = await fs.readFile(this.usersPath, "utf8");
      this.users = JSON.parse(data);
      Logger.info(`Usuarios cargados: ${this.users.length}`);
    } catch (error) {
      Logger.error(`Error cargando usuarios: ${error.message}`);
      this.users = [];
    }
  }

  async saveUsers() {
    try {
      await fs.writeFile(this.usersPath, JSON.stringify(this.users, null, 2));
    } catch (error) {
      Logger.error(`Error guardando usuarios: ${error.message}`);
    }
  }

  async findUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    return this.users.find(
      (user) => user.email.trim().toLowerCase() === cleanEmail,
    );
  }

  async findUserById(id) {
    return this.users.find((user) => user.id === id);
  }

  async validatePassword(plainPassword, hashedPassword) {
    if (!plainPassword || !hashedPassword) return false;
    return await bcrypt.compare(
      String(plainPassword).trim(),
      String(hashedPassword).trim(),
    );
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password.trim(), salt);
  }

  async registerUser(userData) {
    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    const hashedPassword = await this.hashPassword(userData.password);
    const newUser = {
      id:
        this.users.length > 0
          ? Math.max(...this.users.map((u) => u.id)) + 1
          : 1,
      email: userData.email.trim().toLowerCase(),
      password: hashedPassword,
      nombre: userData.nombre || "",
      rol: "usuario", // Cambiado de 'user' a 'usuario' para ser consistente
      fechaRegistro: new Date().toISOString(),
    };

    this.users.push(newUser);
    await this.saveUsers();

    Logger.info(`Usuario registrado: ${newUser.email}`);
    return newUser;
  }

  async authenticate(email, password) {
    console.log("--- AUTH SERVICE CHECK ---");
    const user = await this.findUserByEmail(email);

    if (!user) {
      console.log(
        `Fallo: No se encontró ningún usuario con el email: ${email}`,
      );
      return null;
    }

    console.log(`Usuario encontrado: ${user.nombre}. Validando contraseña...`);

    // El await aquí es crucial
    const isValid = await this.validatePassword(password, user.password);

    if (!isValid) {
      console.log("Fallo: La contraseña no coincide con el Hash de Bcrypt.");
      return null;
    }

    console.log("Éxito: Usuario autenticado.");
    return user;
  }
}

// Singleton
const authService = new AuthService();

// Middlewares
function requireAuth(allowedRoles = []) {
  return async (context, next) => {
    if (!context.session) {
      context.response.writeHead(302, { Location: "/login" });
      context.response.end();
      return;
    }

    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(context.session.rol)
    ) {
      const html = "<h1>403 - No tienes permiso</h1>";
      context.response.writeHead(403, { "Content-Type": "text/html" });
      context.response.end(html);
      return;
    }

    if (next) await next();
  };
}

function redirectIfAuthenticated(redirectPath = "/") {
  return async (context, next) => {
    if (context.session) {
      context.response.writeHead(302, { Location: redirectPath });
      context.response.end();
      return;
    }
    if (next) await next();
  };
}

module.exports = {
  requireAuth,
  redirectIfAuthenticated,
  authService,
};
