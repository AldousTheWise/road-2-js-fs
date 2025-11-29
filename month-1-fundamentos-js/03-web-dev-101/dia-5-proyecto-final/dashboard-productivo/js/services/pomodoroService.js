/* =====================================
    
    pomodoroService.js
    Lógica del temporizador Pomodoro
   ===================================== */

export class PomodoroService {
    constructor(storage) {
        this.storage = storage;
        this.state = {
            mode: "work",
            active: false,
            timeLeft: 25 * 60,
            interval: null,
            sessionToday: storage.get("sessionsToday", 0);
            focusTime: storage.get("focusTime", 0)
        };
    }

    start() {}
    pause() {}
    reset() {}
    switchMode(mode) {}
    tick() {}
}