/* ====================================
    render.js
    Inserta UI en el DOM
   ==================================== */

import { getTasks, getCategories } from "../core/store.js";
import { applyFilters } from "../controllers/filters.js";

import {
  headerTemplate,
  formTemplate,
  filtersTemplate,
  taskListTemplate,
} from "./templates.js";

/* Render inicial de la app */
export function renderApp() {
  renderHeader();
  renderForm();
  renderFilters();
  renderTaskList();
}

/* Header */
export function renderHeader() {
  document.getElementById("header").innerHTML = headerTemplate();
}

/* Formulario */
export function renderForm() {
  document.getElementById("task-form").innerHTML = formTemplate();
}

/* Filtros (status + categoría + búsqueda) */
export function renderFilters() {
  const categories = getCategories(); // ← ahora viene del store
  document.getElementById("filters").innerHTML = filtersTemplate(categories);
}

/* Lista de tareas filtradas */
export function renderTaskList() {
  const filteredTasks = applyFilters(getTasks());
  document.getElementById("task-list").innerHTML =
    taskListTemplate(filteredTasks);
}
