/* =================================
    theme.js    
    Control del Modo claro/oscuro
   ================================= */

const THEME_KEY = "todo_theme";

/* Aplicar tema según valor */
function applyTheme(theme) {
  const body = document.body;

  body.classList.remove("light", "dark");

  if (theme === "dark") {
    body.classList.add("dark");
  } else {
    body.classList.add("light");
  }
}

/* Alternar entre light/dark */
export function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || "light";
  const next = current === "light" ? "dark" : "light";

  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

/* Inicializar al arrancar */
export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);

  if (saved) {
    applyTheme(saved);
    return;
  }

  // fallback: usa el tema del sistema
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const defaultTheme = prefersDark ? "dark" : "light";

  localStorage.setItem(THEME_KEY, defaultTheme);
  applyTheme(defaultTheme);
}
