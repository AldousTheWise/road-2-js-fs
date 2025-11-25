/* =============================== 
  loading.js
  Quita los 'loading states' 
  luego de un tiempo.
  ================================ */

export function simulateLoading() {
  const cards = document.querySelectorAll(".card.loading");

  // Simula una carga de datos (1 segundo)
  setTimeout(() => {
    cards.forEach((c) => c.classList.remove("loading"));
  }, 1000);
}
