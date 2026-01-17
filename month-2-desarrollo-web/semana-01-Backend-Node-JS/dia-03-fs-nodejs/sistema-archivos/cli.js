const ProcesadorArchivos = require("./procesador-archivos.js");
const path = require("path");

async function main() {
  const [, , comando, argumento] = process.argv;

  const DIRECTORIO_BASE = "./demo-archivos";

  const procesador = new ProcesadorArchivos(DIRECTORIO_BASE);
  await procesador.inicializar();

  switch (comando) {
    case "procesar": {
      const directorio = argumento ? path.resolve(argumento) : DIRECTORIO_BASE;

      console.log(`Procesando directorio: ${directorio}`);
      await procesador.procesarDirectorio(directorio);
      break;
    }

    case "buscar": {
      const palabra = argumento;

      if (!palabra) {
        console.log("Uso: node cli.js buscar <palabra>");
        return;
      }

      const resultados = procesador.buscador.buscar(palabra);

      console.log(`Resultados para "${palabra}"`);
      if (resultados.length === 0) {
        console.log("- No se encontraron coincidencias");
      } else {
        resultados.forEach((ruta) => {
          console.log(` - ${ruta}`);
        });
      }
      break;
    }

    case "help":
    case "--help":
    case "-h":
    default:
      console.log(`
        CLI - SISTEMA DE PROCESAMIENTO DE ARCHIVOS:

        Uso:
          node cli.js procesar [directorio]
          node cli.js buscar <palabra>

        Comandos:
          procesar [dir]   Procesa e indexa archivos
                           del directorio (por defecto: 
                           ./demo-archivos)
          
          buscar <palabra> Busca una palabra en los puntos
                           indexados

        Ejemplos:
          node cli.js procesar
          node cli.js procesar ./mis-archivos
          node cli.js buscar node
        `);
  }
}

main().catch((error) => {
  console.error("Error durante el procesamiento:");
  console.error(error.message);
});
