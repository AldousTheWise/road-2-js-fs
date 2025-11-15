// Utilidad para manejar timeouts en promesas
/**
 * Premisas del ejercicio:
 * - Manejo de timeouts
 * - Rechazar operaciones que demoren demasiado
 * - Logging claro del timeout
 */

import { logWarn, logError } from "./logger.js";

/**
 * Envuelve una promesa y la rechaza si excede el tiempo límite.
 * @param {Promise} promesa - Promesa original a ejecutar.
 * @param {number} ms - Tiempo máximo permitido en milisegundos.
 * @param {string} nombreOperacion - nombre descriptivo para logs.
 */
export function timeoutPromise(promesa, ms, nombreOperacion = "operación") {
  return new Promise((resolve, reject) => {
    let finalizada = false;

    //Timer para forzar timeout
    const timer = setTimeout(() => {
      if (!finalizada) {
        logWarn(`[${nombreOperacion}] Timeout tras ${ms}ms`);
        finalizada = true;
        reject(new Error(`Timeout de ${ms}ms en ${nombreOperacion}`));
      }
    }, ms);

    // Ejecutamos la promesa original
    promesa
      .then((resultado) => {
        if (!finalizada) {
          clearTimeout(timer);
          finalizada = true;
          resolve(resultado);
        }
      })
      .catch((error) => {
        if (!finalizada) {
          clearTimeout(timer);
          finalizada = true;
          logError(`[${nombreOperacion}] Error: ${error.message}`);
          reject(error);
        }
      });
  });
}
