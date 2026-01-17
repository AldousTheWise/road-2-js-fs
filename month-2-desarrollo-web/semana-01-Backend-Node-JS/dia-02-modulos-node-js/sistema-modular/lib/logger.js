// lib/logger.js

const fs = require("fs").promises;
const path = require("path");

class Logger {
  constructor(archivo = "operaciones.log") {
    this.archivo = path.join(__dirname, "..", "data", archivo);
  }

  async log(mensaje) {
    const linea = `[${new Date.toISOString()}] ${mensaje}\n`;
    await fs.mkdir(path.dirname(this.archivo), { recursive: true });
    await fs.appendFile(this.archivo, linea, "utf8");
  }
}

module.exports = Logger;
