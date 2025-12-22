/* =================================
   charts.js
   Renderiza un gráfico de barras 
   dentro de <main>
   ================================== */

const DATA = [40, 75, 62, 90, 55, 33];

export function renderCharts() {
  const main = document.querySelector("main");

  main.innerHTML += /*html*/ `
      <section class="chart-section">
         <article class="card">
            <h3>Actividad Semanal</h3>

            <div class="chart">
               <div class="chart-bars">
                  ${DATA.map(
                    (value) => /*html*/ `
                   <div class="chart-bar" style="--h: ${value}%"></div>  
                   `
                  ).join("")}
               </div>
            </div>            
         </article>
      </section>
   `;
}
