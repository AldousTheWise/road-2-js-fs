// middlewares/logger.js
const fs = require("fs").promises;
const path = require("path");

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, "..", "logs");
    this.accessLogPath = path.join(this.logDir, "access.log");
    this.errorLogPath = path.join(this.logDir, "error.log");
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
      console.log(`Directorio de logs creado en: ${this.logDir}`);
    } catch (error) {
      console.error("Error al crear logs:", error.message);
    }
  }

  async log(level, message, logToFile = true) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;

    console.log(logMessage.trim());

    // Escribir en archivo solo si se solicita
    if (logToFile) {
      try {
        const filePath =
          level === "ERROR" ? this.errorLogPath : this.accessLogPath;
        await fs.appendFile(filePath, logMessage + "\n");
      } catch (error) {
        console.error("Error al escribir log:", error.message);
      }
    }
  }

  info(message) {
    this.log("INFO", message);
  }

  error(message) {
    this.log("ERROR", message);
  }

  warn(message) {
    this.log("WARN", message);
  }

  request(method, url, statusCode, responseTime) {
    this.log("REQUEST", `${method} ${url} ${statusCode} ${responseTime}ms`);
  }
}

// Instancia global
const logger = new Logger();

// Middleware de logging SIMPLE (para empezar)
function requestLogger(context, next) {
  const startTime = Date.now();
  const { method, url } = context.request;

  logger.log("REQUEST", `Inicio: ${method} ${url}`, false);

  context.response.on("finish", () => {
    const responseTime = Date.now() - startTime;
    logger.request(method, url, context.response.statusCode, responseTime);
  });

  next();
}

module.exports = requestLogger;
module.exports.Logger = logger;
