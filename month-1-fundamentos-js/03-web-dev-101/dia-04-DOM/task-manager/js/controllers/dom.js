/* =================================================
    dom.js
    Manejo de eventos (event delegation)
   =================================================  */

import {
  addTask,
  toggleTask,
  deleteTask,
  updateTask,
  updateTaskCategory,
} from "../core/store.js";
import { getTaskIdFromElement } from "../core/utils.js";
import { renderTaskList, renderFilters } from "../ui/render.js";
import { toggleTheme } from "../controllers/theme.js";
import {
  setStatusFilter,
  setCategoryFilter,
  setSearchFilter,
} from "./filters.js";

/* ===============================
    Inicializar eventos globales 
   =============================== */

export function initEvents() {
  // SUBMIT -> agregar tarea
  document.body.addEventListener("submit", (e) => {
    if (e.target.id === "form-add") {
      e.preventDefault();

      const text = document.getElementById("input-text").value.trim();
      const category = document.getElementById("input-category").value.trim();

      if (text !== "") {
        addTask(text, category);
        renderTaskList();
        renderFilters();
      }

      e.target.reset();
    }
  });

  // CLICK -> delegación general
  document.body.addEventListener("click", (e) => {
    /* Toggle completado */
    if (e.target.classList.contains("toggle")) {
      const id = getTaskIdFromElement(e.target);
      toggleTask(id);
      renderTaskList();
      renderFilters();
      return;
    }

    /* Eliminar tarea */
    if (e.target.classList.contains("delete")) {
      const id = getTaskIdFromElement(e.target);
      deleteTask(id);
      renderTaskList();
      renderFilters();
      return;
    }

    /* Botón Editar/Guardar */
    if (e.target.classList.contains("edit")) {
      handleEditClick(e.target);
      return;
    }

    /* Filtros por estado (todas / pendientes / completadas) */
    if (e.target.dataset.filter) {
      handleStatusFilter(e.target);
      return;
    }
  });

  // INPUT -> búsqueda y filtrado
  document.body.addEventListener("input", (e) => {
    /* Búsqueda en tiempo real */
    if (e.target.id === "search") {
      setSearchFilter(e.target.value);
      renderTaskList();
      return;
    }

    /* Filtro por categoría */
    if (e.target.id === "category-filter") {
      setCategoryFilter(e.target.value);
      renderTaskList();
      return;
    }
  });

  // KEYDOWN -> edición (ENTER/ESC)
  document.body.addEventListener("keydown", (e) => {
    if (!e.target.classList.contains("edit-input")) return;

    const input = e.target;
    const taskEl = input.closest(".task");
    const id = taskEl.dataset.id;
    const originalText = taskEl.querySelector(".text").textContent;

    /* Enter = Guardar */
    if (e.key === "Enter") {
      const newText = input.value.trim();
      if (newText) {
        updateTask(id, newText);
        renderTaskList();
      }
    }

    /* ESC = Cancelar */
    if (e.key === "Escape") {
      input.value = originalText;
      exitEditMode(taskEl);
    }
  });
}

/* ================================================
    Función: manejar click en botón Editar/Guardar
   ================================================ */

function handleEditClick(button) {
  const taskEl = button.closest(".task");
  const input = taskEl.querySelector(".edit-input");
  const categoryInput = taskEl.querySelector(".edit-category");
  const id = taskEl.dataset.id;

  /* Entrar en modo edición */
  if (!taskEl.classList.contains("editing")) {
    taskEl.classList.add("editing");
    input.focus();
    input.select();
    button.textContent = "Guardar";
    return;
  }

  /* Guardar cambios */
  const newText = input.value.trim();
  const newCategory = categoryInput ? categoryInput.value.trim() : "";

  if (newText !== "") {
    updateTask(id, newText);
    updateTaskCategory(id, newCategory);

    exitEditMode(taskEl);

    renderTaskList();
    renderFilters();
  }
}

/* ===================================
    Función: salir de modo edición.
   =================================== */
function exitEditMode(taskEl) {
  taskEl.classList.remove("editing");
  taskEl.querySelector(".edit").textContent = "Editar";
}

/* ======================================
    Función: aplicar filtros de estado.
   ====================================== */
function handleStatusFilter(button) {
  const selected = button.dataset.filter;
  setStatusFilter(selected);

  document
    .querySelectorAll("[data-filter]")
    .forEach((btn) => btn.classList.remove("btn-filter-active"));

  button.classList.add("btn-filter-active");
  renderTaskList();
}

/* ======================================
    Función: cambiar tema oscuro/claro.
   ====================================== */

document.body.addEventListener("click", (e) => {
  if (e.target.id === "toggle-theme") {
    toggleTheme();
  }
});
