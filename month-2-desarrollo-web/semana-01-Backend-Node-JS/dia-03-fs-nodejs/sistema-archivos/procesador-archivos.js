const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const { Transform } = require("stream");

const Backup = require("./lib/backup.js");
const Buscador = require("./lib/buscador.js");

class ProcesadorArchivos {
  constructor(directorioBase = "./archivos") {
    this.directorioBase = directorioBase;
    this.backup = new Backup(path.join(directorioBase, "backups"));
    this.buscador = new Buscador();
  }

  async inicializar() {
    try {
      await fs.mkdir(this.directorioBase, { recursive: true });
      await fs.mkdir(path.join(this.directorioBase, "procesados"), {
        recursive: true,
      });
      await fs.mkdir(path.join(this.directorioBase, "errores"), {
        recursive: true,
      });
      await this.backup.inicializar();

      console.log("Estructura de directorios creada");
    } catch (error) {
      console.error("Error creando estructura:", error.message);
    }
  }

  async procesarArchivoTexto(rutaArchivo) {
    try {
      await this.backup.crearBackup(rutaArchivo);
      const contenido = await fs.readFile(rutaArchivo, "utf8");
      await this.buscador.indexarContenido(rutaArchivo, contenido);

      const estadisticas = {
        palabras: contenido.split(/\s+/).filter((p) => p.length > 0).length,
        caracteres: contenido.length,
        lineas: contenido.split("\n").length,
        ruta: rutaArchivo,
      };

      const nombreBase = path.basename(rutaArchivo, path.extname(rutaArchivo));
      const rutaEstadisticas = path.join(
        this.directorioBase,
        "procesados",
        `${nombreBase}-stats.json`
      );
      await fs.writeFile(
        rutaEstadisticas,
        JSON.stringify(estadisticas, null, 2)
      );

      console.log(
        `Archivo ${nombreBase} procesado: ${estadisticas.palabras} palabras`
      );
      return estadisticas;
    } catch (error) {
      await this.moverAErrores(rutaArchivo, error.message);
      throw error;
    }
  }

  convertirAMayusculas(rutaEntrada, rutaSalida) {
    return new Promise((resolve, reject) => {
      const transformStream = new Transform({
        transform(chunk, encoding, callback) {
          const mayusculas = chunk.toString().toUpperCase();
          this.push(mayusculas);
          callback();
        },
      });

      const readable = fsSync.createReadStream(rutaEntrada, {
        encoding: "utf8",
      });
      const writable = fsSync.createWriteStream(rutaSalida);

      readable.pipe(transformStream).pipe(writable);

      writable.on("finish", () => {
        console.log(`Archivo convertido a mayúsculas: ${rutaSalida}`);
        resolve(rutaSalida);
      });

      writable.on("error", reject);
      readable.on("error", reject);
    });
  }

  // Copiar archivo usando streams
  copiarArchivoStreams(rutaOrigen, rutaDestino) {
    return new Promise((resolve, reject) => {
      const readable = fsSync.createReadStream(rutaOrigen);
      const writable = fsSync.createWriteStream(rutaDestino);

      readable.pipe(writable);

      writable.on("finish", () => {
        console.log(`Archivo copiado: ${rutaDestino}`);
        resolve(rutaDestino);
      });

      writable.on("error", reject);
      readable.on("error", reject);
    });
  }

  buscarPalabra(palabra) {
    const resultados = this.buscador.buscar(palabra);
    console.log(`"${palabra}" encontrada en:`, resultados);
    return resultados;
  }

  // Mover archivo a carpeta de errores
  async moverAErrores(rutaArchivo, mensajeError) {
    try {
      const nombreArchivo = path.basename(rutaArchivo);
      const rutaError = path.join(
        this.directorioBase,
        "errores",
        nombreArchivo
      );

      await fs.rename(rutaArchivo, rutaError);

      const rutaLogError = path.join(
        this.directorioBase,
        "errores",
        `${nombreArchivo}.error.log`
      );

      await fs.writeFile(
        rutaLogError,
        `Error: ${mensajeError}\nFecha: ${new Date().toISOString()}`
      );
      console.log(`Archivo movido a errores: ${nombreArchivo}`);
    } catch (error) {
      console.error("Error moviendo el archivo a errores:", error.message);
    }
  }

  // Procesar directorio completo
  async procesarDirectorio(rutaDirectorio) {
    try {
      const archivos = await fs.readdir(rutaDirectorio);
      const archivosTxt = archivos.filter(
        (archivo) => archivo.endsWith(".txt") || archivo.endsWith("md")
      );

      console.log(`Procesando ${archivosTxt.length} archivos de texto...`);

      const resultados = [];
      for (const archivo of archivosTxt) {
        const rutaCompleta = path.join(rutaDirectorio, archivo);
        try {
          const resultado = await this.procesarArchivoTexto(rutaCompleta);
          resultados.push(resultado);
        } catch (error) {
          console.error(`Error procesando ${archivo}:`, error.message);
        }
      }

      return resultados;
    } catch (error) {
      console.error(`Error procesando directorio:`, error.message);
      throw error;
    }
  }

  // Generar reporte consolidado
  async generarReporte(resultados) {
    const reporte = {
      fechaGeneracion: new Date().toISOString(),
      totalArchivos: resultados.length,
      estadisticasGlobales: {
        totalPalabras: resultados.reduce((sum, r) => sum + r.palabras, 0),
        totalCaracteres: resultados.reduce((sum, r) => sum + r.caracteres, 0),
        promedioPalabras: Math.round(
          resultados.reduce((sum, r) => sum + r.palabras, 0) / resultados.length
        ),
        archivosProcesados: resultados.length,
      },
      detalleArchivos: resultados,
    };

    const rutaReporte = path.join(
      this.directorioBase,
      "reporte-procesamiento.json"
    );
    await fs.writeFile(rutaReporte, JSON.stringify(reporte, null, 2));

    console.log("Reporte generado:", rutaReporte);
    return reporte;
  }
}

module.exports = ProcesadorArchivos;
