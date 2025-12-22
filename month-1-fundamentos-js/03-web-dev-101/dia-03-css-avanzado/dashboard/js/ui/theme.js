/* =================================
   theme.js
   Alterna tema claro/oscuro
  ================================== */

export function applyThemeToggle() {
  const app = document.getElementById("app");
  const toggle = document.getElementById("theme-toggle");

  toggle.addEventListener("click", () => {
    const current = app.dataset.theme;
    app.dataset.theme = current === "light" ? "dark" : "light";
  });
}
