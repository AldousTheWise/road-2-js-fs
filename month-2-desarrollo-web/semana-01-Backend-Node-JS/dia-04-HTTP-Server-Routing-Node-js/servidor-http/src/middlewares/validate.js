module.exports = function validarTarea(data) {
  if (typeof data.titulo !== "string" || data.titulo.trim() === "") {
    return "El título es obligatorio";
  }

  if (data.prioridad && !["alta", "media", "baja"].includes(data.prioridad)) {
    return "Prioridad inválida";
  }

  return null;
};
