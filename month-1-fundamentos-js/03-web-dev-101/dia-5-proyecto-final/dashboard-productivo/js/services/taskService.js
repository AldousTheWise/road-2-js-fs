/* =====================================
    
    taskService.js
    Lógica de tareas (CRUD + filtros)
   ===================================== */

export class TaskService {
  constructor(storage) {
    this.storage = storage;
    this.tasks = storage.get("tasks", []);
  }

  add(task) {}

  remove(id) {}

  toogle(id) {}

  filter(type) {}

  getStats() {}

  save() {
    this.storage.set("tasks", this.tasks);
  }
}
