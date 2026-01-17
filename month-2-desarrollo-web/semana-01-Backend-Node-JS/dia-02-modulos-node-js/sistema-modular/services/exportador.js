// services/exportador.js

const fs = require("fs").promises;
const path = require("path");

class Exportador {
  static async exportarJSON(datos, archivo) {
    const contenido = JSON.stringify(datos, null, 2);
    await fs.writeFile(archivo, contenido, "utf8");
  }

  static async exportarCSV(datos, archivo) {
    if (datos.length === 0) return;

    const headers = Object.keys(datos[0]).join(",");
    const filas = datos.map((obj) =>
      Object.values(obj)
        .map((v) => `"${v ?? ""}"`)
        .join(",")
    );

    const contenido = [headers, ...filas].join("\n");
    await fs.writeFile(archivo, contenido, "utf8");
  }
}

module.exports = Exportador;
