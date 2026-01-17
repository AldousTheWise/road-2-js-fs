const { tareas, getNextId } = require("../data/tareas.js");
const validarTarea = require("../middlewares/validate.js");

function listar(res, query, enviarJSON) {
  let resultados = [...tareas];

  if (query.completada !== undefined) {
    const completada = query.completada === "true";
    resultados = resultados.filter((t) => t.completada === completada);
  }

  if (query.prioridad) {
    resultados = resultados.filter((t) => t.prioridad === query.prioridad);
  }

  if (query.q) {
    const q = query.q.toLowerCase();
    resultados = resultados.filter(
      (t) =>
        t.titulo.toLowerCase().includes(q) ||
        t.descripcion.toLowerCase().includes(q)
    );
  }

  enviarJSON(res, { total: resultados.length, tareas: resultados });
}

function obtenerPorId(res, id, enviarJSON) {
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return enviarJSON(res, { error: "Tarea no encontrada" }, 404);
  enviarJSON(res, tarea);
}

function crear(res, data, enviarJSON) {
  const error = validarTarea(data);
  if (error) {
    return enviarJSON(res, { error }, 400);
  }

  const nueva = {
    id: getNextId(),
    titulo: data.titulo,
    descripcion: data.descripcion || "",
    completada: false,
    prioridad: data.prioridad || "media",
    fechaCreacion: new Date().toISOString(),
  };

  tareas.push(nueva);
  enviarJSON(res, nueva, 201);
}

function eliminar(res, id, enviarJSON) {
  const index = tareas.findIndex((t) => t.id === id);
  if (index === -1)
    return enviarJSON(res, { error: "Tarea no encontrada" }, 404);

  const eliminada = tareas.splice(index, 1);
  enviarJSON(res, eliminada[0]);
}

module.exports = { listar, obtenerPorId, crear, eliminar };
