/* ======================================
    templates.js
    Plantillas HTML (solo strings)
   ====================================== */

/* Header */
export function headerTemplate() {
  return /*html*/ `
        <div class="card row justify-between">
            <h1>Lista de Tareas</h1>
            <button id="toggle-theme" class="btn btn-ghost">Día/Noche</button>
        </div>
    `;
}

/* Formulario para agregar tareas */
export function formTemplate() {
  return /*html*/ `
        <div class="card">
            <form action="" id="form-add">
                <div class="row">
                    <input type="text" id="input-text" placeholder="Nueva tarea..." class="col">
                    <input type="text" id="input-category" placeholder="Categoría..." class="col">
                    <button class="btn btn-primary">Agregar</button>
                </div>
            </form>
        </div>
    `;
}

/* Filtros (Buscador + select categorías) */
export function filtersTemplate(categories = []) {
  return /*html*/ `
        <div class="card">
            <input type="text" id="search" placeholder="Buscar tareas...">
            <div class="filters-row mt-sm">
                <button data-filter="todas" class="btn btn-ghost btn-filter-active">Todas</button>
                <button data-filter="pendientes" class="btn btn-ghost">Pendientes</button>
                <button data-filter="completadas" class="btn btn-ghost">Completadas</button>
            </div>

            <select name="" id="category-filter" class="mt-sm">
                <option value="todas">Todas las categorías</option>
                ${categories
                  .map((cat) => `<option value="${cat}">${cat}</option>`)
                  .join("")}
            </select>
        </div>
    `;
}

/* Ítem de tarea individual */
export function taskItemTemplate(task) {
  return /*html*/ `
        <li class="task ${task.completed ? "completed" : ""}" 
        data-id="${task.id}" 
        draggable="true">
            <input type="checkbox" class="toggle" ${
              task.completed ? "checked" : ""
            }>
            <span class="text">${task.text}</span>

            <input type="text" class="edit-input" value="${task.text}" >
            <input type="text" class="edit-category" value="${
              task.category || ""
            }">

            ${
              task.category ? `<span class="badge">${task.category}</span>` : ""
            }

            <div class="actions">
                <button class="btn btn-sm btn-ghost edit">Editar</button>
                <button class="btn btn-sm btn-danger delete">X</button>
            </div>
        </li>
    `;
}

/* Lista completa */
export function taskListTemplate(tasks) {
  if (tasks.length === 0) {
    return /*html*/ `
            <div class="card p">
                <p class="text-muted">No hay tareas todavía</p>
            </div>
        `;
  }

  return /*html*/ `
        <div class="card">
            <ul class="tasks">
                ${tasks.map((task) => taskItemTemplate(task)).join("")}
            </ul>
        </div>
    `;
}
