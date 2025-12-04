/* =====================================
    
    pomodoro.js
    Vista del temporizador Pomodoro
   ===================================== */

export function PomodoroComponent(state = { mode: "work", timeLeft: 25 * 60 }) {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return /*html*/ `
    <section class="pomodoro" role="region" aria-label="Temporizador Pomodoro">
      <div class="pomodoro__modes" role="tablist" aria-label="Modos Pomodoro">
        <button class="btn pomodoro__mode ${
          state.mode === "work" ? "pomodoro__mode--active" : ""
        }" data-mode="work" role="tab">Trabajo</button>
        <button class="btn pomodoro__mode ${
          state.mode === "short" ? "pomodoro__mode--active" : ""
        }" data-mode="short" role="tab">Descanso Corto</button>
        <button class="btn pomodoro__mode ${
          state.mode === "long" ? "pomodoro__mode--active" : ""
        }" data-mode="long" role="tab">Descanso Largo</button>
      </div>

      <div class="pomodoro__mode-label" id="pomodoro-mode" aria-live="polite">${
        state.mode
      }</div>

      <div class="pomodoro__circle" id="pomodoro-circle" aria-hidden="false">
        <span id="pomodoro-time" aria-live="polite">${formatTime(
          state.timeLeft
        )}</span>
      </div>

      <div class="pomodoro__controls" role="group" aria-label="Controles Pomodoro">
        <button class="btn btn--primary" id="pomodoro-start">Iniciar</button>
        <button class="btn btn--secondary" id="pomodoro-pause">Pausar</button>
        <button class="btn btn--secondary" id="pomodoro-reset">Reset</button>
      </div>
    </section>
  `;
}
