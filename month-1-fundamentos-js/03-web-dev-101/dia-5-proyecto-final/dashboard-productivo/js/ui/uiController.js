/* ======================================
    
    uiController.js
   ====================================== */

import { StatsComponent } from "./components/stats.js";
import { PomodoroComponent } from "./components/pomodoro.js";
import { ModalComponent } from "./components/modal.js";
import { TaskItemComponent } from "./components/taskItem.js";

export class UIController {
  constructor(services) {
    this.services = services;
    this.app = document.getElementById("app");

    // referencias cacheadas
    this.pomodoroTimeEl = null;
    this.pomodoroModeEl = null;
    this.pomodoroModeButtons = null;
    this.pomodoroStartBtn = null;
    this.pomodoroPauseBtn = null;
    this.pomodoroResetBtn = null;

    // Para edición de tareas
    this.editingTaskId = null;
  }

  init() {
    // 1. Renderizar layout
    this.renderLayout();

    // 2. Esperar un tick para que el DOM se renderice
    setTimeout(() => {
      // 3. Cachear elementos del pomodoro
      this.cachePomodoroElements();

      // 4. Bindear eventos
      this.bindEvents();

      // 5. Registrar callback del pomodoro
      if (this.services.pomodoro?.setUpdateUI) {
        this.services.pomodoro.setUpdateUI((timeStr, mode, active) => {
          this.updatePomodoroUI(timeStr, mode, active);
        });
      }

      // 6. Inicializar UI del pomodoro
      this.updatePomodoroUI("25:00", "work", false);

      // 7. Actualizar todo
      this.updateAll();
    }, 0);
  }

  /* Render del Layout */
  renderLayout() {
    this.app.innerHTML = `
      ${this.renderHeader()}
      <main class="contenido-principal">
        ${this.renderStatsSection()}
        ${this.renderMainGrid()}
        ${this.renderWeeklySection()}
      </main>
      ${ModalComponent()}
    `;
  }

  renderHeader() {
    return /*html*/ `
      <header class="header-principal" id="header-principal">
        <div class="header__container">
          <h1 class="header__title">Dashboard de Productividad</h1>
          <button id="theme-toggle" class="btn btn--icon" aria-label="Alternar modo oscuro">🌙</button>
        </div>
      </header>
    `;
  }

  renderStatsSection() {
    return /*html*/ `<section class="stats" id="stats-section"></section>`;
  }

  renderMainGrid() {
    return /*html*/ `
      <div class="layout__main grid-principal">
        ${this.renderTasksSection()}
        <div class="pomodoro-container" id="pomodoro-container">
          ${PomodoroComponent(this.services.pomodoro.state)}
        </div>
      </div>
    `;
  }

  renderTasksSection() {
    return /*html*/ `
      <section class="tasks" id="tasks-section">
        <header class="tasks__header">
          <h2 class="tasks__title">Lista de Tareas</h2>
          <button class="btn btn--primary" id="task-new-btn" type="button">Agregar</button>
        </header>

        <div class="tasks__filters">
          <button class="btn--secondary tasks__filter filter--active" data-filter="all">Todas</button>
          <button class="btn--secondary tasks__filter" data-filter="pending">Pendientes</button>
          <button class="btn--secondary tasks__filter" data-filter="completed">Completadas</button>
        </div>

        <ul class="tasks__list" id="task-list" aria-live="polite">
          <li class="task__empty">No hay tareas aun</li>
        </ul>
      </section>
    `;
  }

  renderWeeklySection() {
    return /*html*/ `
      <section class="weekly">
        <h2 class="weekly__title">Progreso semanal</h2>
        <div class="stats__chart" id="weekly-chart"></div>
      </section>
    `;
  }

  /* Eventos */
  bindEvents() {
    // Tema claro/oscuro
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        this.services.theme.toggle();
        this.updateThemeUI();
      });
    }

    // ========== MODAL ==========
    const modal = document.getElementById("task-modal");
    const form = document.getElementById("task-form");

    // Botón "Agregar Tarea"
    const taskNewBtn = document.getElementById("task-new-btn");
    if (taskNewBtn) {
      taskNewBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.editingTaskId = null;

        if (form) form.reset();

        // Actualizar UI del modal
        const modalTitle = document.getElementById("modal-title");
        const submitBtn = document.querySelector(
          "#task-form button[type='submit']"
        );

        if (modalTitle) modalTitle.textContent = "Nueva Tarea";

        if (submitBtn) submitBtn.textContent = "Agregar";

        // Abrir modal
        if (modal && typeof modal.showModal === "function") {
          modal.showModal();
        } else if (modal) {
          modal.style.display = "block";
          modal.style.position = "fixed";
          modal.style.top = "50%";
          modal.style.left = "50%";
          modal.style.transform = "translate(-50%, -50%)";
        }
      });
    } else {
      console.error("ERROR: Botón task-new-btn no encontrado");
    }

    // Botones de cerrar
    document.getElementById("modal-close")?.addEventListener("click", () => {
      modal?.close();
    });

    document.getElementById("modal-cancel")?.addEventListener("click", () => {
      modal?.close();
    });

    // Formulario submit
    if (form) {
      form.addEventListener("submit", (ev) => {
        ev.preventDefault();

        const title = form.elements["title"].value.trim();
        const description = form.elements["description"].value.trim();
        const priority = form.elements["priority"].value;

        if (!title) {
          alert("El título es requerido");
          return;
        }

        if (this.editingTaskId) {
          this.services.tasks.update(this.editingTaskId, {
            text: title,
            description,
            priority,
          });
        } else {
          this.services.tasks.add({
            text: title,
            description,
            priority,
            date: new Date().toISOString(),
          });
        }

        modal?.close();

        // Actualizar UI
        const activeFilter =
          document.querySelector(".tasks__filter.filter--active")?.dataset
            .filter || "all";
        this.updateTaskList(activeFilter);
        this.updateStats();
        this.updateWeeklyChart();

        // Notificación
        if (window.notify) {
          window.notify(
            this.editingTaskId ? "Tarea actualizada" : "Tarea creada",
            {
              type: "success",
            }
          );
        }

        this.editingTaskId = null;
      });
    }

    // Filtros
    document.querySelectorAll(".tasks__filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tasks__filter").forEach((b) => {
          b.classList.remove("filter--active");
        });
        btn.classList.add("filter--active");
        this.updateTaskList(btn.dataset.filter);
      });
    });

    // ========== DELEGACIÓN TAREAS  ==========
    const taskListEl = document.getElementById("task-list");
    if (taskListEl) {
      taskListEl.addEventListener("click", (e) => {
        // IMPORTANTE: Buscar por .task-item (no .task)
        const taskItem = e.target.closest(".task-item");
        if (!taskItem) {
          return;
        }

        const taskId = taskItem.dataset.id;

        const task = this.services.tasks.tasks.find((t) => t.id === taskId);
        if (!task) {
          return;
        }

        // Checkbox toggle
        if (e.target.matches(".task-item__checkbox")) {
          if (typeof this.services.tasks.toggle === "function") {
            // Ejecutar toggle
            const updatedTask = this.services.tasks.toggle(taskId);

            // Actualizar UI
            const activeFilter =
              document.querySelector(".tasks__filter.filter--active")?.dataset
                .filter || "all";

            this.updateTaskList(activeFilter);
            this.updateStats();

            this.updateWeeklyChart();
          } else {
            console.error("❌ toggle() NO disponible en this.services.tasks");
          }
        }

        // Delete button
        if (e.target.closest(".task-item__delete")) {
          if (confirm("¿Eliminar esta tarea?")) {
            this.services.tasks.remove(taskId);
            const activeFilter =
              document.querySelector(".tasks__filter.filter--active")?.dataset
                .filter || "all";
            this.updateTaskList(activeFilter);
            this.updateStats();
            this.updateWeeklyChart();

            if (window.notify) {
              window.notify("Tarea eliminada", { type: "info" });
            }
          }
        }

        // Edit button
        if (e.target.closest(".task-item__edit")) {
          this.editingTaskId = task.id;

          if (form) {
            form.elements["title"].value = task.text || "";
            form.elements["description"].value = task.description || "";
            form.elements["priority"].value = task.priority || "media";

            // Actualizar UI del modal
            const modalTitle = document.getElementById("modal-title");
            const submitBtn = document.querySelector(
              "#task-form button[type='submit']"
            );

            if (modalTitle) modalTitle.textContent = "Editar Tarea";
            if (submitBtn) submitBtn.textContent = "Actualizar";
          }

          // Abrir modal
          if (modal && typeof modal.showModal === "function") {
            modal.showModal();
          }
        }
      });
    }

    // ========== POMODORO ==========
    const pomodoroContainer = document.getElementById("pomodoro-container");
    if (pomodoroContainer) {
      pomodoroContainer.addEventListener("click", (e) => {
        if (e.target.matches("#pomodoro-start")) {
          this.services.pomodoro.start();
        }

        if (e.target.matches("#pomodoro-pause")) {
          this.services.pomodoro.pause();
        }

        if (e.target.matches("#pomodoro-reset")) {
          this.services.pomodoro.reset();
          this.cachePomodoroElements();
        }

        if (e.target.matches(".pomodoro__mode")) {
          const newMode = e.target.dataset.mode;
          this.services.pomodoro.switchMode(newMode);
        }
      });
    }
  }

  /* Actualizaciones (estos métodos están bien) */
  updateAll() {
    this.updateTaskList("all");
    this.updateStats();
    this.updateWeeklyChart();
    this.updateThemeUI();
  }

  updateTaskList(filter) {
    const tasks = this.services.tasks.filter(filter);
    const container = document.getElementById("task-list");
    if (!container) return;

    if (!tasks || tasks.length === 0) {
      container.innerHTML = `<li class="task__empty">No hay tareas en esta categoría</li>`;
      return;
    }

    container.innerHTML = tasks.map((t) => TaskItemComponent(t)).join("");
  }

  updateStats() {
    const t = this.services.tasks.getStats();
    const p = this.services.pomodoro.getStats();

    const stats = {
      totalTasks: t.total,
      completedTasks: t.completed,
      pomodorosToday: p.sessionsToday,
      focusMinutes: p.focusMinutes,
      currentMode: p.currentMode,
      pomodoroActive: p.active,
    };

    const container = document.getElementById("stats-section");
    if (container) container.innerHTML = StatsComponent(stats);
  }

  updateWeeklyChart() {
    const container = document.getElementById("weekly-chart");
    if (!container) return;

    const data = this.services.tasks.getWeeklyData?.() || [];

    // Calcular máximo SOLO de los valores reales
    const values = data.map((d) => d.value);
    const maxValue = values.length > 0 ? Math.max(...values) : 1;

    // Si todos son 0, mostrar gráfico vacío pero con altura mínima
    const allZeros = values.every((v) => v === 0);

    if (allZeros) {
      container.innerHTML = data
        .map((day, index) => {
          // Altura base de 10px para barras vacías
          const height = 10;
          const isToday = index === new Date().getDay() - 1;

          return /*html*/ `
          <div class="stats__column">
            <div class="stats__bar ${isToday ? "stats__bar--today" : ""}" 
                 style="height:${height}px"
                 title="${day.label}: ${day.value}">
            </div>
            <p class="stats__day">${day.label}</p>
            <p class="stats__count">${day.value}</p>
          </div>
        `;
        })
        .join("");
    } else {
      // Hay datos, calcular proporciones normales
      container.innerHTML = data
        .map((day, index) => {
          // Calcular altura proporcional (mínimo 10px para que sea visible)
          const proportionalHeight = (day.value / maxValue) * 100;
          const height = Math.max(10, proportionalHeight);

          const isToday = index === new Date().getDay() - 1;

          return /*html*/ `
          <div class="stats__column">
            <div class="stats__bar ${isToday ? "stats__bar--today" : ""}" 
                 style="height:${height}px"
                 title="${day.label}: ${day.value} tarea${
            day.value !== 1 ? "s" : ""
          }">
            </div>
            <p class="stats__day">${day.label}</p>
            <p class="stats__count">${day.value}</p>
          </div>
        `;
        })
        .join("");
    }
  }

  cachePomodoroElements() {
    this.pomodoroTimeEl = document.getElementById("pomodoro-time");
    this.pomodoroModeEl = document.getElementById("pomodoro-mode");
    this.pomodoroModeButtons = Array.from(
      document.querySelectorAll(".pomodoro__mode")
    );
    this.pomodoroStartBtn = document.getElementById("pomodoro-start");
    this.pomodoroPauseBtn = document.getElementById("pomodoro-pause");
    this.pomodoroResetBtn = document.getElementById("pomodoro-reset");
  }

  updatePomodoroUI(timeStr, mode, active) {
    // Asegurar elementos cacheados
    if (!this.pomodoroTimeEl || !this.pomodoroModeEl) {
      this.cachePomodoroElements();
    }

    if (this.pomodoroTimeEl && timeStr) {
      this.pomodoroTimeEl.textContent = timeStr;
    }

    if (this.pomodoroModeEl && mode) {
      this.pomodoroModeEl.textContent =
        mode === "work"
          ? "Trabajo"
          : mode === "short"
          ? "Descanso Corto"
          : "Descanso Largo";
    }

    this.pomodoroModeButtons?.forEach((btn) => {
      btn.classList.toggle("pomodoro__mode--active", btn.dataset.mode === mode);
    });

    if (this.pomodoroStartBtn) this.pomodoroStartBtn.disabled = active;
    if (this.pomodoroPauseBtn) this.pomodoroPauseBtn.disabled = !active;
  }

  updateThemeUI() {
    if (this.services.theme.isDark) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }
}
