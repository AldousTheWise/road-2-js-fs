/* =====================================
    
    stats.js
    Vista de estadísticas
   ===================================== */

export function StatsComponent(stats) {
  const {
    totalTasks = 0,
    completedTasks = 0,
    pomodorosToday = 0,
    focusMinutes = 0,
    currentMode = "work",
    pomodoroActive = false,
  } = stats;

  return /*html*/ `
            <h2 class="stats__title">Estadísticas</h2>

            <div class="stats__grid">
                <article class="card stat-card">
                    <h3 class="card__title stat-card__label">Tareas creadas</h3>
                    <p class="card__value stat-card__value">${totalTasks}</p>
                </article>

                <article class="card stat-card">
                    <h3 class="card__title stat-card__label">Tareas completadas</h3>
                    <p class="card__value stat-card__value">${completedTasks}</p>
                </article>

                <article class="card stat-card">
                    <h3 class="card__title stat-card__label">Pomodoros hoy</h3>
                    <p class="card__value stat-card__value">${pomodorosToday}</p>
                    ${
                      pomodoroActive
                        ? '<span class="pomodoro-active-badge">En curso...</span>'
                        : ""
                    }
                </article>

                <article class="card stat-card">
                    <h3 class="card__title stat-card__label">Minutos de foco</h3>
                    <p class="card__value stat-card__value">${focusMinutes}</p>
                    <p class="card__subtitle">Modo: ${
                      currentMode === "work" ? "Trabajo" : "Descanso"
                    }</p>
                </article>
            </div>
    `;
}
