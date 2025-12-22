/* =============================================
    app.js
    Clase coordinadora general de la aplicación
   ============================================= */

import { storageService } from "./services/storageService.js";
import { TaskService } from "./services/taskService.js";
import { PomodoroService } from "./services/pomodoroService.js";
import { ThemeService } from "./services/themeService.js";

import { UIController } from "./ui/uiController.js";

export default class App {
  constructor() {
    this.services = {
      storage: storageService,
      tasks: new TaskService(storageService),
      pomodoro: new PomodoroService(storageService),
      theme: new ThemeService(storageService),
    };

    this.ui = new UIController(this.services);
  }

  init() {
    this.ui.init();
  }
}
