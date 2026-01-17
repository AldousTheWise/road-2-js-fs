// lib/validador-tarea.js

class ValidadorTarea {
  static validarCreacion({ titulo, prioridad }) {
    if (!titulo || typeof titulo !== "string") {
      throw new Error("El título de la tarea es obligatorio");
    }

    const prioridadesValidas = ["baja", "media", "alto"];
    if (!prioridadesValidas.includes(prioridad)) {
      throw new Error(
        `Prioridad inválida. Use: ${prioridadesValidas.join(", ")}`
      );
    }
  }

  static validarActualizacion(datos) {
    if (datos.titulo !== undefined && datos.titulo.trim() === "") {
      throw new Error("El titulo no puede estar vacío");
    }
  }
}

module.exports = ValidadorTarea;
