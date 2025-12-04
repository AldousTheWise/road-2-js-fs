/* =====================================
    
    formatDate.js
    Formateo de fecha para las tareas
   ===================================== */

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
