/* =====================================
    
    taskService.js
    Lógica de tareas (CRUD + filtros)
   ===================================== */

export class TaskService {
  constructor(storage) {
    this.storage = storage;
    this.tasks = storage.get("tasks", []);

    this.repairAllTasks();
  }

  add(task) {
    const taskId = crypto.randomUUID();
    const newTask = {
      id: taskId,
      ...task,
      completed: false,
      createAt: new Date().toISOString(),
      completedAt: null,
    };

    this.tasks.push(newTask);
    this.save();
    return newTask;
  }

  remove(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.save();
  }

  toggle(id) {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      console.error("Tarea no encontrada con ID:", id);
      return null;
    }

    // Cambiar estado
    const wasCompleted = task.completed;
    task.completed = !task.completed;

    if (task.completed && !wasCompleted) {
      task.completedAt = new Date().toISOString();
    } else if (!task.completed && wasCompleted) {
      // Desmarcar - limpiar fecha
      task.completedAt = null;
    }

    // Guardar siempre updatedAt
    task.updatedAt = new Date().toISOString();

    // Guardar en localStorage
    this.save();

    return task;
  }

  // Agrega este método a la clase TaskService
  repairAllTasks() {
    let repairedCount = 0;

    this.tasks = this.tasks.map((task) => {
      // Caso 1: Tarea completada sin completedAt
      if (task.completed && !task.completedAt) {
        repairedCount++;
        return {
          ...task,
          completedAt: task.createdAt || new Date().toISOString(),
        };
      }

      // Caso 2: Tarea sin ID
      if (!task.id || task.id === "undefined") {
        repairedCount++;
        return {
          ...task,
          id: crypto.randomUUID(),
        };
      }

      return task;
    });

    if (repairedCount > 0) this.save();

    return this.tasks;
  }

  filter(type) {
    if (type === "all") return this.tasks;
    if (type === "completed")
      return this.tasks.filter((task) => task.completed);
    if (type === "pending") return this.tasks.filter((task) => !task.completed);
    return this.tasks;
  }

  getStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((task) => task.completed).length;
    return {
      total,
      completed,
      pending: total - completed,
    };
  }

  getWeeklyData() {
    const labels = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];
    const days = labels.map((label) => ({ label, value: 0 }));

    const completedTasks = this.tasks.filter(
      (task) => task.completed && task.completedAt
    );
    completedTasks.forEach((task) => {
      try {
        const completedDate = new Date(task.completedAt);
        let dayIndex = completedDate.getDay() - 1;
        if (dayIndex === -1) dayIndex = 6;

        if (dayIndex >= 0 && dayIndex < 7) {
          days[dayIndex].value++;
        }
      } catch (e) {
        console.error("Error procesando fecha: ", task.completedAt, e);
      }
    });

    return days;
  }

  save() {
    this.storage.set("tasks", this.tasks);
  }

  update(id, updates) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
      this.save();
      return this.tasks[taskIndex];
    }
    return null;
  }
}
