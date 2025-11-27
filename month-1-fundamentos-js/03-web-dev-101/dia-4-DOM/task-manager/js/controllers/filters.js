/* ===============================================
    filters.js
    - Maneja el filtrado de tareas
    - Combinación de estado, categoría y búsqueda
   =============================================== */

import { normalize } from "../core/utils.js";

/* Estado interno de filtros */
export const filterState = {
  status: "todas", // todas | pendientes | completadas
  category: "todas", // string o "todas"
  search: "", // texto normalizado
};

/* Cambiar filtro de estado */
export function setStatusFilter(status) {
  filterState.status = status;
}

/* Cambiar filtros de categoría (category) */
export function setCategoryFilter(category) {
  filterState.category = category;
}

/* Cambiar búsqueda */
export function setSearchFilter(text) {
  filterState.search = normalize(text);
}

/* Aplicar todos los filtros a una lista */
export function applyFilters(tasks) {
  let result = tasks;

  /* FILTRO POR ESTADO */
  if (filterState.status === "pendientes") {
    result = result.filter((t) => !t.completed);
  }

  if (filterState.status === "completadas") {
    result = result.filter((t) => t.completed);
  }

  /* FILTRO POR CATEGORÍA */
  if (filterState.category !== "todas") {
    result = result.filter((t) => t.category === filterState.category);
  }

  /* FILTRO POR BÚSQUEDA */
  if (filterState.search !== "") {
    result = result.filter((t) =>
      normalize(t.text).includes(filterState.search)
    );
  }

  return result;
}
