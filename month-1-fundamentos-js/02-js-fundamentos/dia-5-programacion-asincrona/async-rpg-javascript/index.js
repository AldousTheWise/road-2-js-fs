//Punto de entrada del sistema de sincronización RPG
// Ejecuta las 3 versiones: Callbacks, Promises y Async/Await

import {
  syncRPG_Callback,
  syncRPG_Promises,
  syncRPG_Async,
} from "./services/syncRPG.js";
import { logInfo, logSuccess, logError } from "./utils/logger.js";

/* ----------------------------
     1. CALLBACK VERSION
------------------------------ */
function ejecutarCallbacks() {
  return new Promise((resolve) => {
    logInfo("=== Ejecuntando versión CALLBACKS ===");

    syncRPG_Callback((err, world) => {
      if (err) {
        logError("Error en CALLBACKS: " + err.message);
        resolve();
        return;
      }

      logSuccess("Mundo sincronizado con CALLBACKS:");
      console.dir(world, { depth: null });
      resolve();
    });
  });
}

/* ----------------------------
     1. PROMISES VERSION
------------------------------ */
function ejecutarPromises() {
  logInfo("=== Ejecutando versión PROMISES ===");

  return syncRPG_Promises()
    .then((world) => {
      logSuccess("Mundo sincronizado con PROMISES:");
      console.dir(world, { depth: null });
    })
    .catch((err) => {
      logError("Error en PROMISES: " + err.message);
    });
}

/* ----------------------------
     1. ASYNC/AWAIT VERSION
------------------------------ */
async function ejecutarAsync() {
  logInfo("=== Ejecutando versión ASYNC/AWAIT ===");

  try {
    const world = await syncRPG_Async();

    if (world) {
      logSuccess("Mundo sincronizado con ASYNC/AWAIT:");
      console.dir(world, { depth: null });
    }
  } catch (err) {
    logError("Error en ASYNC/AWAIT: " + err.message);
  }
}

/* ----------------------------
     FLUJO PRINCIPAL
------------------------------ */
async function main() {
  logInfo("Iniciando sistema de sincronización RPG...");

  await ejecutarCallbacks();
  await ejecutarPromises();
  await ejecutarAsync();

  logSuccess("Todos los métodos de sincronización completados.");
}

main();
