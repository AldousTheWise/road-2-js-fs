/* =================================
   topbar.js
   Generación dinámica del header
   ================================= */

export function renderTopbar() {
  const topbar = document.getElementById("topbar");

  // Inyección de HTML en el div
  topbar.innerHTML = /*html*/ `
        <button id="menu-btn" class="hamburger">
            <span></span>
        </button>

        <h1 class="logo">Dashboard</h1>

        <button id="theme-toggle" class="btn">
           🌓 
        </button>
    `;
}
