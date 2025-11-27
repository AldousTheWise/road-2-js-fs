/* =================================================
    store.js
    - Maneja el estado de la aplicación
    - Guarda y carga el localStorage
    - Provee funciones CRUD
   ================================================= */

let tasks = []; // Estado interno

// Clave de almacenamiento en localStorage
const STORAGE_KEY = "todo_tasks_modular";

/* Inicializar estado */
export function initStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  tasks = saved ? JSON.parse(saved) : [];
}

/* Guardar cambios */
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* Obtener todas las tareas ordenadas por 'order' */
export function getTasks() {
  return [...tasks].sort((a, b) => a.order - b.order);
}

/* Crear nueva tarea */
export function addTask(text, category) {
  tasks.push({
    id: crypto.randomUUID(), // Esto crea un id único
    text,
    category,
    completed: false,
    order: tasks.length,
  });

  save();
}

/* Alternar estado completado */
export function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.completed = !task.completed;
    save();
  }
}

/* Editar texto de una tarea */
export function updateTask(id, newText) {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.text = newText.trim();
    save();
  }
}

/* Editar categoría */
export function updateTaskCategory(id, newCategory) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.category = newCategory.trim();
    save();
  }
}

/* Eliminar tarea */
export function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);

  // Reordenamiento de índices para consistencia
  tasks.forEach((task, i) => (task.order = i));
  save();
}

/* Reordenar tareas (drag&drop) */
export function reorderTasks(idA, idB) {
  const taskA = tasks.find((task) => task.id === idA);
  const taskB = tasks.find((task) => task.id === idB);

  if (taskA && taskB) {
    const temp = taskA.order;
    taskA.order = taskB.order;
    taskB.order = temp;
    save();
  }
}

/* Obtener categorías únicas */
export function getCategories() {
  const categories = tasks
    .map((t) => t.category)
    .filter((cat) => cat && cat.trim() !== "");

  return [...new Set(categories)];
}
