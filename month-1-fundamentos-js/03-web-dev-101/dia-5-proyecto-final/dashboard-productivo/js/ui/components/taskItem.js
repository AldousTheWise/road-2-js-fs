/* =====================================
    
    taskItem.js
    Componente que genera el markup de
    una tarea
   ===================================== */

import { formatDate } from "../../utils/formatDate.js";

export function TaskItemComponent(task) {
  return /*html*/ `
        <li class="task-item ${
          task.completed ? "task-item--completed" : ""
        }" data-id="${task.id}">

        <div class="task-item__content">
            <input type="checkbox" class="task-item__checkbox" ${
              task.completed ? "checked" : ""
            }>

            <div class="task-item__card">
                <p class="task-item__title">${task.text}</p>
                ${
                  task.description
                    ? `<p class="task-item__description">${task.description}</p>`
                    : ""
                }
                <span class="task-item__meta">
                    ${
                      task.priority
                        ? `<span class="task-item__priority task-item__priority--${task.priority}">${task.priority}</span>`
                        : ""
                    }
                </span>
                <span class="task__date">${
                  task.date ? formatDate(task.date) : "Sin Fecha"
                }</span>
              </div>
            </div>
            <div class="task-item__actions">
                <button class="task-item__edit btn btn--secondary btn--edit" aria-label="Editar Tarea">Editar</button>
                <button class="task-item__delete btn btn--secondary btn--delete" aria-label="Eliminar Tarea">&times;</button>
            </div>            
        </li>
    `;
}
