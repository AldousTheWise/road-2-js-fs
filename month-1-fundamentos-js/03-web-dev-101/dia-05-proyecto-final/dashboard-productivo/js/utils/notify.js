/* =====================================
    
    notify.js
    Notificaciones tipo toast
   ===================================== */

export function notify(message, { type = "info", duration = 3000 } = {}) {
  if (!message) return;

  // Crear contenedor si no existe
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  // Crear toast
  const toast = document.createElement("div");
  toast.classList.add("toast", `toast--${type}`);
  toast.setAttribute("role", "status");

  toast.innerHTML = /*html*/ `
    <span class="toast__message">${message}</span>
    <button class="toast__close" aria-label="Cerrar">X</button>
  `;

  container.appendChild(toast);

  // Animación de Entrada
  setTimeout(() => toast.classList.add("toast--visible"), 10);

  // Cerrar
  const remove = () => {
    toast.classList.remove("toast--visible");
    setTimeout(() => {
      if (toast.parentNode === container) container.removeChild(toast);

      if (container.children.length === 0) container.remove();
    }, 200);
  };

  toast.querySelector(".toast__close").addEventListener("click", remove);

  if (duration > 0) setTimeout(remove, duration);

  return { dismiss: remove, element: toast };
}
