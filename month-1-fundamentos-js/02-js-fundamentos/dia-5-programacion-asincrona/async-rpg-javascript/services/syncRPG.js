// Servicio principal de sincronización del RPG.
/**
 * Premisas del ejercicio:
 * - Comparar 3 enfoques: Callbacks, Promises, Async/Await
 * - Manejar múltiples APIs: monstruos, items, misiones, héroes
 * - Procesar datos y "guardar" localmente
 * - Aplicar retry y timeoutPromise()
 * - Logging detallado.
 */

import { obtenerMonstruos } from "../api/monstruos.js";
import { obtenerItems } from "../api/items.js";
import { obtenerMisiones } from "../api/misiones.js";
import { obtenerHeroes } from "../api/heroes.js";

import { retry } from "../utils/retry.js";
import { timeoutPromise } from "../utils/timeout.js";
import { logInfo, logSuccess, logError } from "../utils/logger.js";

/*----------------------------------------
         1. CALLBACK VERSION
-----------------------------------------*/
export function syncRPG_Callback(callback) {
  logInfo("Iniciando sincronización RPG (CALLBACKS)...");

  // Paso 1. Obtener monstruos:
  obtenerConCallback(obtenerMonstruos, "Monstruos", (err, monstruos) => {
    if (err) return callback(err);

    // Paso 2. Obtener items:
    obtenerConCallback(obtenerItems, "Items", (err, items) => {
      if (err) return callback(err);

      // Paso 3. Obtener misiones:
      obtenerConCallback(obtenerMisiones, "Misiones", (err, misiones) => {
        if (err) return callback(err);

        // Paso 4. Obtener héroes:
        obtenerConCallback(obtenerHeroes, "Héroes", (err, heroes) => {
          if (err) return callback(err);

          const world = { monstruos, items, misiones, heroes };
          logSuccess("Sincronización completa(CALLBACKS)");

          callback(null, world);
        });
      });
    });
  });
}

// Helper para callback-version
function obtenerConCallback(fn, nombre, cb) {
  try {
    fn()
      .then((res) => cb(null, res))
      .catch((err) => cb(err));
  } catch (error) {
    cb(error);
  }
}

/*----------------------------------------
         2. PROMISES VERSION
-----------------------------------------*/
export function syncRPG_Promises() {
  logInfo(`Iniciando sincronización RPG (PROMISES)...`);

  return Promise.all([
    retry(() => timeoutPromise(obtenerMonstruos(), 2000), 3, 300, "Monstruos"),
    retry(() => timeoutPromise(obtenerItems(), 2000), 3, 300, "Items"),
    retry(() => timeoutPromise(obtenerMisiones(), 2000), 3, 300, "Misiones"),
    retry(() => timeoutPromise(obtenerHeroes(), 2000), 3, 300, "Héroes"),
  ])
    .then(([monstruos, items, misiones, heroes]) => {
      const world = { monstruos, items, misiones, heroes };
      logSuccess("Sincronización completa (PROMISES)");
      return world;
    })
    .catch((err) => {
      logError("Error en sincronización (PROMISES) " + err.message);
      throw err;
    });
}

/*----------------------------------------
         2. ASYNC/AWAIT VERSION
-----------------------------------------*/
export async function syncRPG_Async() {
  try {
    logInfo("Iniciando sincronización RPG (ASYNC/AWAIT)");

    // Podemos hacer todo en paralelo
    const [monstruos, items, misiones, heroes] = await Promise.all([
      retry(() => timeoutPromise(obtenerMonstruos(), 2000), 3.3, "Monstruos"),
      retry(() => timeoutPromise(obtenerItems(), 2000), 3, 300, "Items"),
      retry(() => timeoutPromise(obtenerMisiones(), 2000), 3, 300, "Misiones"),
      retry(() => timeoutPromise(obtenerHeroes(), 2000), 3, 300, "Héroes"),
    ]);

    const world = { monstruos, items, misiones, heroes };
    logSuccess("Sincronización completa (ASYNC/AWAIT)");

    return world;
  } catch (error) {
    logError(`Error en sincronizacion (ASYNC/AWAIT): ${error.message}`);
    return null;
  }
}
