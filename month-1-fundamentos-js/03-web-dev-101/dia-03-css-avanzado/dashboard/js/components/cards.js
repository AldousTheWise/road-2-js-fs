/* ===============================
   cards.js
   Componente para crear tarjetas
   =============================== */

/**
 * Crea una tarjeta reutilizable para el dashboard
 * @param {string} title - Título de la tarjeta
 * @param {string} content - Contenido HTML interno
 * @returns {string} HTML de la tarjeta
 */

export function createCard({ title, content = "" }) {
  return /*html*/ `
        <article class="card">
            <h3>${title}</h3>
            <div class="card-body">${content}</div>
        </article>
    `;
}
