const { tareas } = require("../data/tareas.js");

function obtenerStats(res, enviarJSON) {
  const total = tareas.length;

  const porPrioridad = {
    alta: 0,
    media: 0,
    baja: 0,
  };

  let completadas = 0;

  tareas.forEach((t) => {
    // Contar por prioridad
    if (porPrioridad[t.prioridad] !== undefined) {
      porPrioridad[t.prioridad]++;
    }

    // Contar completadas
    if (t.completada) {
      completadas++;
    }
  });

  enviarJSON(res, {
    total,
    porPrioridad,
    completadas,
  });
}

module.exports = { obtenerStats };
