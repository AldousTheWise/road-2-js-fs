// Sistema de calificaciones con estructuras de control
console.log("=== SISTEMA DE CALIFICACIONES ===\n");

// Datos de estudiantes
let estudiantes = [
  { nombre: "Ana", calificacion: 85 },
  { nombre: "Carlos", calificacion: 92 },
  { nombre: "María", nombre: 78 },
  { nombre: "Pedro", calificacion: 88 },
  { nombre: "Laura", calificacion: 96 },
];

// Función para determinar letra de calificación.
function obtenerCalificacion(calificacion) {
  if (calificacion >= 90) {
    return "A";
  } else if (calificacion >= 80) {
    return "B";
  } else if (calificacion >= 70) {
    return "C";
  } else if (calificacion >= 60) {
    return "D";
  } else {
    return "F";
  }
}

// Función para procesar estudiantes
function procesarEstudiantes(estudiantes) {
  let estadisticas = {
    total: estudiantes.length,
    aprobados: 0,
    reprobados: 0,
    promedio: 0,
  };

  let sumaCalificaciones = 0;

  for (let estudiante of estudiantes) {
    try {
      if (!estudiante.nombre || typeof estudiante.calificacion !== "number") {
        throw new Error(
          `Datos inválidos para estudiante ${JSON.stringify(estudiante)}`
        );
      }

      let letra = obtenerCalificacion(estudiante.calificacion);
      let aprobado = estudiante.calificacion >= 70;

      console.log(
        `${estudiante.nombre}: ${estudiante.calificacion} (${letra}) - ${
          aprobado ? "APROBADO" : "REPROBADO"
        }`
      );

      if (aprobado) {
        estadisticas.aprobados++;
      } else {
        estadisticas.reprobados++;
      }

      sumaCalificaciones += estudiante.calificacion;
    } catch (error) {
      console.log(`Error procesando estudiante: ${error.message}`);
      continue;
    }
  }

  estadisticas.promedio = sumaCalificaciones / estadisticas.total;
  return estadisticas;
}

let estadisticas = procesarEstudiantes(estudiantes);

console.log("\n=== ESTADÍSTICAS ===");
console.log(`Total de estudiantes: ${estadisticas.total}`);
console.log(`Aprobados: ${estadisticas.aprobados}`);
console.log(`Reprobados: ${estadisticas.reprobados}`);
console.log(`Promedio general: ${estadisticas.promedio.toFixed(2)}`);

// Ejemplo de switch para categorizar estudiantes
function categorizarEstudiantes(calificacion) {
  switch (true) {
    case calificacion >= 95:
      return "Excelente";
    case calificacion >= 85:
      return "Muy Bueno";
    case calificacion >= 75:
      return "Bueno";
    case calificacion >= 65:
      return "Regular";
    default:
      return "Necesita mejorar";
  }
}

console.log("\n=== CATEGORIZACIÓN DETALLADA ===");
for (let estudiante of estudiantes) {
  let categoria = categorizarEstudiantes(estudiante.calificacion);
  console.log(`${estudiante.nombre}: ${categoria}`);
}

console.log("\n=== USO DE OPERADOR TERNARIO ===");
let calificacionPromedio = estadisticas.promedio;
let mensaje =
  calificacionPromedio >= 80
    ? "Excelente rendimiento del grupo!"
    : "El grupo necesita más práctica";

console.log(mensaje);
