/* ===============================
   main.js
   script principal de entrada.
   =============================== */

import { renderTopbar } from "./ui/topbar.js";
import { renderSidebar } from "./ui/sidebar.js";
import { applyThemeToggle } from "./ui/theme.js";
import { renderKPIs } from "./components/kpi.js";
import { renderCharts } from "./components/charts.js";
import { simulateLoading } from "./ui/loading.js";

// Renderización dinámica de header y sidebar
renderTopbar();
renderSidebar();

// Renderización de los KPIs dentro del <main>
renderKPIs();

// Renderización de los gráficos dentro del <main>
renderCharts();

// Activación de switch claro/oscuro
applyThemeToggle();

// Simulación de la carga de las cards de un segundo
simulateLoading();
