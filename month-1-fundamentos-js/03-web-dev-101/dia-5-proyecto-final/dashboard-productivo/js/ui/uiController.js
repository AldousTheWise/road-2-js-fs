/* ======================================
    
    uiController.js
    Controlador principal de la interfaz
    Se encarga de renderizar el layout
    y conectar los componentes
   ====================================== */

import { StatsComponent } from "./components/stats.js";
import { PomodoroComponent } from "./components/pomodoro.js";
import { ModalComponent } from "./components/modal.js";

import { TaskItemComponent } from "./components/taskItem.js";

export class UIController {
  constructor(services) {
    this.services = services;
    this.app = document.getElementById("app");
  }

  // Inicialización de la UI
  init() {
    this.renderLayout();
    this.bindEvents();
    this.updateAll();
  }

  /* 1) Render del Layout Base */

  renderLayout() {
    this.app.innerHTML = `
      ${this.renderHeader()}
      ${this.renderSection()}
      ${this.renderMainGrid()}
      ${this.renderWeeklySection()}
      ${ModalComponent()}
    `;
  }

  // Header
  renderHeader() {
    return /*html*/ `
      <header id="header-principal">
        <div class="header__container">
          <h1 class="header__title">Dashboard de Productividad</h1>
          <button id="theme-toggle" class="btn btn--icon" aria-label="Alternar modo oscuro">
            🌙
          </button>
        </div>
      </header>
    `;
  }

  // Estadísticas
  renderStatsSection() {
    return /*html*/ `
    <section class="stats" id="stats-section">
      ${StatsComponent()}
    </section>
  `;
  }

  // Grid Principal (Tareas + Pomodoro)
  renderMainGrid() {
    return /*html*/ `
    <div class="layout__main">
      ${this.renderTasksSection()}
      ${PomodoroComponent()}
    </div>
  `;
  }

  // Tareas
  renderTasksSection() {
    return /*html*/ `
    <section class="tasks" id="tasks-section">
      <header class="tasks__header">
        <h2 class="tasks__title">Lista de Tareas</h2>
        <button class="btn btn--primary" id="task-new-btn">Agregar</button>
      </header>

      <div class="tasks__filters">
        <button class="tasks__filter filter--active" data-filter="all">Todas</button>
        <button class="task__filter" data-filter="pending">Pendientes</button>
        <button class="task__filter" data-filter="completed">Completadas</button>
      </div>
      
      <div class="tasks__list" id="task-list">
        <p class="task__empty">No hay tareas aun</p>
      </div>
    </section>
  `;
  }

  // Progreso semanal
  renderWeeklySection() {
    return /*html*/ `
      <section class="weekly">
        <h2 class="weekly__title">Progreso semanal</h2>
        <div class="stats__chart" id="weekly-chart"></div>
      </section>
    `;
  }

  /* 2) Eventos generales */

  bindEvents() {
    // Tema claro/oscuro
    document.getElementById("theme-toggle").addEventListener("click", () => {
      this.services.theme.toggle();
      this.updateThemeUI();
    });

    // Botón nueva tarea
    document.getElementById("task-new-btn").addEventListener("click", () => {
      document.getElementById("task-modal").showModal();
    });

    // Filtros
    document.querySelectorAll(".tasks__filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".tasks__filter")
          .forEach((b) => b.classList.remove("filter--active"));

        btn.classList.add("filter--active");
        this.updateTaskList(btn.dataset.filter);
      });
    });
  }

  /* 3) Actualización Global */

  updateAll() {
    this.updateTaskList("all");
    this.updateStats();
    this.updateWeeklyChart();
    this.updatePomodoro();
    this.updateThemeUI();
  }

  // Lista de tareas
  updateTaskList(filter) {
    const tasks = this.services.tasks.filter(filter);
    const container = document.getElementById("task-list");

    if (tasks.length === 0) {
      container.innerHTML = /*html*/ `
        <p class="class__empty">No hay tareas en esta categoría</p>
      `;
      return;
    }

    container.innerHTML = tasks.map((t) => TaskItemComponent(t)).join("");
  }

  // Estadísticas
  updateStats() {
    const stats = this.services.tasks.getStats();
    document.getElementById("stats-completed").textContent = stats.completed;
    document.getElementById("stats-focus").textContent = stats.focusTime + "m";
    document.getElementById("stats-streak").textContent = stats.streak;
  }

  // Gráfico semanal
  updateWeeklyChart() {}

  // Pomodoro
  updatePomodoro() {}

  // Tema
  updateThemeUI() {
    if (this.services.theme.isDark) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }
}
