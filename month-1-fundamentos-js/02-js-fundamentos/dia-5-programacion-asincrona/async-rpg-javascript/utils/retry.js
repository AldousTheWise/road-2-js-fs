// Utilidad de rententos genéricos para cualquier llamada asíncrona
/**
 * Premisas de ejercicio:
 * - Reintentos automáticos
 * - Manejo de errores
 * - Logging (se delega a logger.js)
 * - Backoff opcional
 * - Soporta funciones que retornen promesas
 */

import { logInfo, logWarn, logError } from "./logger.js";

/**
 * Ejecuta una función asíncrona con reintentos.
 * @param {Function} fn - Función que retorna una Promesa.
 * @param {number} intentos - Número máximo de reintentos.
 * @param {number} backoffMs - tiempo de espera incremental (opcional).
 * @param {string} nombreOperacion - Nombre descriptivo para logging.
 */

export async function retry(
  fn,
  intentos = 3,
  backoffMs = 0,
  nombreOperacion = "operación"
) {
  let intentoActual = 1;

  while (intentoActual <= intentos) {
    try {
      logInfo(`[${nombreOperacion}] Intento ${intentoActual}/${intentos}...`);

      const resultado = await fn();

      logInfo(`[${nombreOperacion}] Éxito en intento ${intentoActual}`);
      return resultado;
    } catch (error) {
      logWarn(
        `[${nombreOperacion}] Error en intento ${intentoActual}: ${error.message}`
      );

      if (intentoActual === intentos) {
        logError(`[${nombreOperacion}] Falló despues de ${intentos} intentos`);
        throw error;
      }

      if (backoffMs > 0) {
        const wait = backoffMs * intentoActual;
        logInfo(
          `[${nombreOperacion}] Esperando ${wait}ms antes de reintentar...`
        );
        await new Promise((res) => setTimeout(res, wait));
      }

      intentoActual++;
    }
  }
}
