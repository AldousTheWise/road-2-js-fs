/* =====================================
    
    shortcuts.js
    Atajos de teclado globales
   ===================================== */

export function registerShortcuts(callbacks) {
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
      if (e.key === "n") callbacks.onNewTask?.();
      if (e.key === "d") callbacks.onToggleTheme?.();
    }
  });
}
