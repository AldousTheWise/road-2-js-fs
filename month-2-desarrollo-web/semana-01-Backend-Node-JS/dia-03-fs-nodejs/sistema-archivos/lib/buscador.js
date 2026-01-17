const fs = require("fs").promises;

class Buscador {
  constructor() {
    this.indice = new Map();
  }

  async indexarContenido(rutaArchivo, contenido) {
    if (typeof contenido !== "string") {
      throw new Error("Contenido inválido para indexación");
    }

    const palabras = contenido.toLowerCase().split(/\W+/).filter(Boolean);

    palabras.forEach((palabra) => {
      if (!this.indice.has(palabra)) {
        this.indice.set(palabra, new Set());
      }
      this.indice.get(palabra).add(rutaArchivo);
    });
  }

  buscar(palabra) {
    if (typeof palabra !== "string") {
      return [];
    }

    return Array.from(this.indice.get(palabra.toLowerCase()) || []);
  }
}

module.exports = Buscador;
