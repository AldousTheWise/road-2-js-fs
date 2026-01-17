const ProcesadorArchivos = require("../procesador-archivos.js");

// Demostración del sistema completo.
async function demostrarSistemaArchivos() {
  console.log("DEMOSTRACIÓN: SISTEMA DE PROCESAMIENTO DE ARCHIVOS\n");

  const procesador = new ProcesadorArchivos("./demo-archivos");

  // 1. Inicializar estructura
  console.log("Iniciando estructura...");
  await procesador.inicializar();

  // 2. Crear archivos de ejemplo
  console.log("\nCreando archivos de ejemplo...");
  const archivosEjemplo = [
    {
      nombre: "documento1.txt",
      contenido:
        "Este es un documento de ejemplo con varias palabras para procesar.",
    },
    {
      nombre: "documento2.txt",
      contenido:
        "Otro documento de ejemplo más largo con más palabras y más contenido para el análisis.",
    },
    {
      nombre: "notas.md",
      contenido:
        "# Notas Importantes\n\n- Aprender Node.js\n- Practicar streams\n- Dominar el sistema de archivos",
    },
  ];

  for (const archivo of archivosEjemplo) {
    const ruta = path.join("./demo-archivos", archivo.nombre);
    await fs.writeFile(ruta, archivo.contenido);
    console.log(`Creado: ${archivo.nombre}`);
  }

  // 3. Procesar archivos
  console.log("\nProcesando archivos...");
  const resultados = await procesador.procesarDirectorio("./demo-archivos");

  // 4. Convertir archivos a mayúsculas
  console.log("\nConvirtiendo archivos a mayúsculas...");
  await procesador.convertirAMayusculas(
    "./demo-archivos/documento1.txt",
    "./demo-archivos/documento1-mayusculas.txt"
  );

  // 5. Copiar archivos usando streams
  console.log("\nCopiando archivo con streams...");
  await procesador.copiarArchivoStreams(
    "./demo-archivos/notas.md",
    "./demo-archivos/copia-notas.md"
  );

  // 6. Generar reporte
  console.log("\nGenerando reporte...");
  const reporte = await procesador.generarReporte(resultados);
  procesador.buscarPalabra("node");

  console.log("\nESTADISTICAS FINALES:");
  console.log(
    `- Archivos procesados: ${reporte.estadisticasGlobales.archivosProcesados}`
  );
  console.log(
    `- Total palabras: ${reporte.estadisticasGlobales.totalPalabras}`
  );
  console.log(
    `- Promedio palabras: ${reporte.estadisticasGlobales.promedioPalabras}`
  );

  console.log("\nSistema de archivos completado exitosamente!");
}

// Ejecutar demostración
demostrarSistemaArchivos().catch((error) => {
  console.error("Error en la demostración:", error.message);
});
