/* =====================================
    
    pomodoroService.js
    Lógica del temporizador Pomodoro
   ===================================== */

export class PomodoroService {
  constructor(storage) {
    this.storage = storage;
    this.state = {
      mode: "work", // work | short | long
      active: false,
      timeLeft: 25 * 60,
      interval: null,
      sessionsToday: storage.get("sessionsToday", 0),
      focusTime: storage.get("focusTime", 0),
    };

    // callback UI: (timeStr, mode, active) => void
    this.updateUI = null;
  }

  // registra callback para updates (UI)
  setUpdateUI(fn) {
    this.updateUI = fn;
    // emitir estado actual para sincronizar UI
    this._emitUI();
  }

  start() {
    if (this.state.active) return;
    this.state.active = true;
    // arrancamos tick loop; tick() emite updateUI cada segundo
    this.state.interval = setInterval(() => this.tick(), 1000);
    this._emitUI();
  }

  pause() {
    this.state.active = false;
    clearInterval(this.state.interval);
    this.state.interval = null;
    this._emitUI();
  }

  reset() {
    this.pause();
    this.state.timeLeft = this.state.mode === "work" ? 25 * 60 : 5 * 60;
    this._emitUI();
  }

  switchMode(mode) {
    if (!["work", "short", "long"].includes(mode)) return;
    this.state.mode = mode;
    switch (mode) {
      case "work":
        this.state.timeLeft = 25 * 60;
        break;
      case "short":
        this.state.timeLeft = 5 * 60;
        break;
      case "long":
        this.state.timeLeft = 15 * 60;
        break;
    }
    // dejamos pausado cuando se cambia modo
    this.pause();
    this._emitUI();
  }

  tick() {
    if (!this.state.active) return;

    this.state.timeLeft--;

    // construir string tiempo
    const minutes = Math.floor(this.state.timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (this.state.timeLeft % 60).toString().padStart(2, "0");
    const timeStr = `${minutes}:${seconds}`;

    // emitir UI con dos args (time, mode, active)
    this.updateUI?.(timeStr, this.state.mode, this.state.active);

    // fin de sesión
    if (this.state.timeLeft <= 0) {
      if (this.state.mode === "work") {
        this.state.sessionsToday++;
        this.state.focusTime += 25; // minutos
        this.storage.set("sessionsToday", this.state.sessionsToday);
        this.storage.set("focusTime", this.state.focusTime);
      }

      // alternar modos automáticamente
      if (this.state.mode === "work") this.switchMode("short");
      else this.switchMode("work");
    }
  }

  _emitUI() {
    // emite estado actual (útil para start/reset/switchMode)
    const minutes = Math.floor(this.state.timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (this.state.timeLeft % 60).toString().padStart(2, "0");
    const timeStr = `${minutes}:${seconds}`;
    this.updateUI?.(timeStr, this.state.mode, this.state.active);
  }

  getStats() {
    return {
      sessionsToday: this.state.sessionsToday,
      focusMinutes: this.state.focusTime,
      currentMode: this.state.mode,
      active: this.state.active,
    };
  }
}
