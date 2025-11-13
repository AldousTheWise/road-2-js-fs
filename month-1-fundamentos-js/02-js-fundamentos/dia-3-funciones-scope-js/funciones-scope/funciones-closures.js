console.log("=== SISTEMA DE GESTIÓN DE TAREAS CON CLOSURES ===\n");
// Ejecuta: node funciones-closures.js

/**
 * Funcion principal que crea un gestor de tareas (TODO list).
 * Usa un closure para mantener el estado privado. (encapsulamiento)
 */

function crearGestorTareas() {
  // Estado privado: las tareas existen solo dentro de este closure.
  let tareas = [];
  let contador = 0; // Contador interno (id incremental)

  // Retornamos un objeto con funciones que acceden/modifican ese estado.
  return {
    /**
     * Agrega una nueva tarea.
     * @param {string} descripcion - texto descriptivo de la tarea.
     * @param {string} [categoria="general"] - Categoría opcional
     */

    agregarTarea: (descripcion, categoria = "general") => {
      const nueva = {
        id: ++contador, // Identificador único
        descripcion,
        categoria,
        completada: false,
        creada: new Date().toLocaleString(),
      };

      tareas.push(nueva);
      console.log(`Tarea agregada: "${descripcion}" [${categoria}]`);
    },

    /**
     * Marca una tarea como completada
     * @param {number} id - ID de la tarea a marcar
     */

    completarTarea: (id) => {
      const tarea = tareas.find((t) => t.id === id);

      if (tarea) {
        tarea.completada = true;
        console.log(`Tarea completada: "${tarea.descripcion}"`);
      } else {
        console.log("No se encontró la tarea con ese ID");
      }
    },

    /**
     * Mostrar todas las tareas (imprimiendolas)
     */
    obtenerTareas: () => {
      if (tareas.length === 0) {
        console.log("No hay tareas registradas.");
        return;
      }

      console.log("\n=== LISTA DE TAREAS ===");
      tareas.forEach((t) => {
        const estado = t.estado ? "Completada" : "Pendiente";
        console.log(`#${t.id} | ${t.descripcion} [${t.categoria}] - ${estado}`);
      });
    },

    /**
     * Filtra tareas por estado ("todas", "completadas", "pendientes")
     * @param {string} [estado="todas"]
     * @returns {array} Lista filtrada
     */

    filtrar: (estado = "todas") => {
      let lista = [];
      switch (estado) {
        case "completadas":
          lista = tareas.filter((t) => t.completada);
          break;
        case "pendientes":
          lista = tareas.filter((t) => !t.completada);
          break;
        default:
          lista = tareas;
      }

      if (lista.length === 0) {
        console.log(`No hay tareas ${estado}`);
        return;
      }

      console.log(`\n=== TAREAS ${estado.toUpperCase()} ===`);
      lista.forEach((t) => {
        const estadoTxt = t.completada ? "✅ Completada" : "🕓 Pendiente";
        console.log(
          `#${t.id} | ${t.descripcion} [${t.categoria}] - ${estadoTxt}`
        );
      });
    },

    /**
     * Muestra estadísticas del sistema
     */

    obtenerEstadisticas: () => {
      const total = tareas.length;
      const completadas = tareas.filter((t) => t.completada).length;
      const pendientes = total - completadas;

      console.log("\nEstadísticas:");
      console.log(`Total: ${total}`);
      console.log(`Completadas: ${completadas}`);
      console.log(`Pendientes: ${pendientes}`);
      console.log(
        `Progreso: ${
          total ? ((completadas / total) * 100).toFixed(2) + "%" : "0%"
        }`
      );
    },
  };
}

// Uso del gestor
const gestor = crearGestorTareas();

gestor.agregarTarea("Aprender closures en JS", "estudio");
gestor.agregarTarea("Cocinar la cena", "doméstico");
gestor.agregarTarea("Revisar correos", "trabajo");

// Obtenemos todas las tareas:
gestor.obtenerTareas();

// Marcamos una tarea como completada (usamos el id de la primera tarea)
gestor.completarTarea(1);

// Filtramos por estado
gestor.filtrar("completadas");
gestor.filtrar("pendientes");

// Mostramos estadisticas:
gestor.obtenerEstadisticas();

// Interfaz de consola

import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Mostrar comandos disponibles
const mostrarMenu = () => {
  console.log(`
      \n=== MENU DE GESTION DE TAREAS ===
        1. Agregar tarea
        2. Completar tarea
        3. Listar todas
        4. Listar completadas
        5. Listar pendientes
        6. Ver estadísticas
        0. Salir
        `);
};

const esperarEnter = (callback) => {
  rl.question("\nPresiona ENTER para continuar...", () => {
    callback();
  });
};

// Bucle interactivo
const ejecutarMenu = () => {
  mostrarMenu();
  rl.question("Selecciona una opción: ", (opcion) => {
    switch (opcion.trim()) {
      case "1":
        rl.question("Descripción de la tarea: ", (desc) => {
          rl.question("Categoría (opcional): ", (cat) => {
            gestor.agregarTarea(desc, cat || "general");
            ejecutarMenu();
          });
        });
        break;

      case "2":
        gestor.filtrar("pendientes");
        rl.question("ID de la tarea a completar: ", (id) => {
          gestor.completarTarea(Number(id));
          esperarEnter(ejecutarMenu);
        });
        break;

      case "3":
        gestor.obtenerTareas();
        esperarEnter(ejecutarMenu);
        break;

      case "4":
        gestor.filtrar("completadas");
        esperarEnter(ejecutarMenu);
        break;

      case "5":
        gestor.filtrar("pendientes");
        esperarEnter(ejecutarMenu);
        break;

      case "6":
        gestor.obtenerEstadisticas();
        esperarEnter(ejecutarMenu);
        break;

      case "0":
        console.log("¡Hasta Luego!");
        rl.close();
        break;

      default:
        console.log("Opción no válida.");
        ejecutarMenu();
    }
  });
};

// Iniciar programa
ejecutarMenu();
