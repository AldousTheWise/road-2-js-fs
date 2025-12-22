/* =================================
  kpi.js
  Renderiza KPIs
  ================================= */

import { createCard } from "./cards.js";
import { KPIs } from "../data/mock-data.js";

export function renderKPIs() {
  const main = document.querySelector("main");

  main.innerHTML += /*html*/ `
        <section class="kpi-grid">
            ${KPIs.map((kpi) =>
              createCard({
                title: kpi.title,
                content: `<p class="kpi-value">${kpi.value}</p>`,
              })
            ).join(" ")}
        </section>       
    `;
}
