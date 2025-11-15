// Sistema de logging para el RPG Sync System
/**
 * Premisas del ejercicio:
 * - Logging detallado de progreso
 * - Mensajes claros para debugging
 * - Estilo personalizable (tema RPG)
 * - Funciones reutilizables en todo el sistema
 */

// Estilos básicos:

const COLORS = {
  reset: "\x1b[0m",
  info: "\x1b[36m", // cyan
  warn: "\x1b[33m", // yellow
  error: "\x1b[31m", // red
  success: "\x1b[32m", // green
};

export function logInfo(mensaje) {
  console.log(`${COLORS.info}[INFO]${COLORS.reset} ${mensaje}`);
}

export function logWarn(mensaje) {
  console.warn(`${COLORS.warn}[ADVERTENCIA]${COLORS.reset} ${mensaje}`);
}

export function logError(mensaje) {
  console.error(`${COLORS.error}[ERROR]${COLORS.reset} ${mensaje}`);
}

export function logSuccess(mensaje) {
  console.log(`${COLORS.success}[ÉXITO]${COLORS.reset} ${mensaje}`);
}

export function logEvento(epico) {
  console.log(`${COLORS.success} Evento ${epico}${COLORS.reset}`);
}
