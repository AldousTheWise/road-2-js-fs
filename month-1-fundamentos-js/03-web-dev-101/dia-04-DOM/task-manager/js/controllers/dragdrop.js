/* ===================================
    dragdrop.js
    Arrastrar y soltar tareas
   =================================== */

import { reorderTasks } from "../core/store.js";
import { renderTaskList } from "../ui/render.js";

export function initDragAndDrop() {
  let draggedId = null;

  /* Comienzo del arrastre */
  document.body.addEventListener("dragstart", (e) => {
    const task = e.target.closest(".task");
    if (!task) return;

    draggedId = task.dataset.id;
    task.classList.add("dragging");
  });

  /* Mientras se arrastra */
  document.body.addEventListener("dragover", (e) => {
    e.preventDefault(); // Muy importante: siempre habilitar el drop

    const task = e.target.closest(".task");
    if (!task) return;

    task.classList.add("drag-over");
  });

  /* Salir del área de drop */
  document.body.addEventListener("dragleave", (e) => {
    const task = e.target.closest(".task");
    if (!task) return;

    task.classList.remove("drag-over");
  });

  /* Soltar la tarea */
  document.body.addEventListener("drop", (e) => {
    e.preventDefault();

    const targetTask = e.target.closest(".task");
    if (!targetTask) return;

    const targetId = targetTask.dataset.id;

    if (draggedId !== targetId) {
      reorderTasks(draggedId, targetId);
    }

    cleanupClasses();
    renderTaskList();
  });

  /* Termina el arrastre */
  document.body.addEventListener("dragend", cleanupClasses);

  /* Quitar clases de todos los elementos */
  function cleanupClasses() {
    document
      .querySelectorAll(".task")
      .forEach((t) => t.classList.remove("dragging", "drag-over"));
  }
}
