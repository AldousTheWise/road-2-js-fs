/* ===================================
    utils.js
    Funciones auxiliares simples
   =================================== */

/* Obtener el ID de la tarea desde un elemento del DOM */
export function getTaskIdFromElement(element) {
  return element.closest(".task")?.dataset.id || null;
}

/* Convertir texto a minúsculas y limpiar espacios */
export function normalize(text) {
  return text.trim().toLowerCase();
}
