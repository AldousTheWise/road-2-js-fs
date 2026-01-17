const fs = require("fs").promises;
const path = require("path");

class Backup {
  constructor(directorioBackup) {
    this.directorioBackup = directorioBackup;
  }

  async inicializar() {
    await fs.mkdir(this.directorioBackup, { recursive: true });
  }

  async crearBackup(rutaArchivo) {
    const nombre = path.basename(rutaArchivo);
    const timestamp = Date.now();
    const destino = path.join(this.directorioBackup, `${timestamp}-${nombre}`);

    await fs.copyFile(rutaArchivo, destino);
    console.log(`Backup creado: ${destino}`);
  }
}

module.exports = Backup;
