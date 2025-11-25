/* ===================================
   sidebar.js
   sidebar navegable con animación en 
   móvil
  ==================================== */

export function renderSidebar() {
  const sidebar = document.getElementById("sidebar");

  sidebar.innerHTML = /*html*/ `
        <nav>
            <a href="#">Inicio</a>
            <a href="#">Reportes</a>
            <a href="#">Usuarios</a>
            <a href="#">Ajustes</a>
        </nav>
    `;

  // Botón para abrir/cerrar sidebar en móvil
  const menuBtn = document.getElementById("menu-btn");

  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}
