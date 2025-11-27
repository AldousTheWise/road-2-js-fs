import { initStorage } from "./core/store.js";
import { renderApp } from "./ui/render.js";
import { initEvents } from "./controllers/dom.js";
import { initDragAndDrop } from "./controllers/dragdrop.js";
import { initTheme } from "./controllers/theme.js";

function init() {
  initStorage();
  renderApp();
  initEvents();
  initDragAndDrop();
  initTheme();
}

window.addEventListener("DOMContentLoaded", () => {
  init();
});
