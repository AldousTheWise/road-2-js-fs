function tareasPorPrioridad(tareas) {
  return tareas.reduce((acc, t) => {
    acc[t.prioridad] = (acc[t.prioridad] || 0) + 1;
  }, {});
}

function completadaPorDia(tareas) {
  return tareas
    .filter((t) => t.completada && t.fechaCreacion)
    .reduce((acc, t) => {
      const dia = t.fechaCreacion.split("T")[0];
      acc[dia] = (acc[dia] || 0) + 1;
      return acc;
    }, {});
}

module.exports = {
  tareasPorPrioridad,
  completadaPorDia,
};
