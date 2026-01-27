// /js/admin.js

function toggleEdit(id) {
  const row = document.getElementById(`row-${id}`);
  if (!row) return;

  row.classList.toggle("is-editing");
  console.log(
    `Toggle edición para: ${id}. Estado: ${row.classList.contains("is-editing")}`,
  );
}

function toggleDetalleEdit() {
  const container = document.getElementById("producto-container");
  if (!container) return;

  container.classList.toggle("editing");

  console.log(
    `Edición de detalle: ${container.classList.contains("editing") ? "Activada" : "Desactivada"}`,
  );
}

function switchTab(event, tabId) {
  // 1. Ocultar todos los contenidos de pestañas
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // 2. Desactivar todos los botones de pestañas
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // 3. Activar la pestaña seleccionada
  document.getElementById(tabId).classList.add("active");
  event.currentTarget.classList.add("active");

  localStorage.setItem("activeAdminTab", tabId);
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  let tabToOpen = params.get("tab");

  if (tabToOpen === "usuarios") tabToOpen = "tab-usuarios";

  if (!tabToOpen) {
    tabToOpen = localStorage.getItem("activeAdminTab");
  }

  if (tabToOpen) {
    const targetButton = document.querySelector(`[onclick*="${tabToOpen}"]`);
    if (targetButton) {
      switchTab({ currentTarget: targetButton }, tabToOpen);
    }
  }
});
