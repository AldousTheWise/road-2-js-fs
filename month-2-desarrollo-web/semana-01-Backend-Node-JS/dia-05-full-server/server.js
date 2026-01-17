// server.js
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const Router = require("./router.js");
const TemplateEngine = require("./templates.js");
const StaticServer = require("./static-server.js");
const { logger, cors, jsonParser } = require("./middleware.js");

let productos = [];
try {
  const productosPath = path.join(__dirname, "data", "productos.json");
  const data = fs.readFileSync(productosPath, "utf8");
  productos = JSON.parse(data);
  console.log(`Productos cargados: ${productos.length} productos`);
} catch (error) {
  console.error("Error al cargar productos.json:", error.message);
  productos = [];
}

const router = new Router();
const templates = new TemplateEngine();
const staticServer = new StaticServer();

router.use(logger);
router.use(cors);
router.use(jsonParser);

router.get("/", async (context) => {
  const { response } = context;

  const html = await templates.render("home", {
    titulo: "Bienvenido a Mi Tienda",
    productos: productos.slice(0, 3),
    fecha: new Date().toLocaleDateString("es-ES"),
  });

  response.writeHead(200, { "Content-Type": "text/html" });
  response.end(html);
});

router.get("/productos", async (context) => {
  const { response, query } = context;

  // Copiar todos los productos
  let productosFiltrados = [...productos];

  // Verificar si se aplicó algún filtro
  const filtroAplicado = query.categoria || query.maxPrecio || query.ordenar;

  // Aplicar filtros SOLO si existen
  if (query.categoria) {
    productosFiltrados = productosFiltrados.filter(
      (p) => p.categoria === query.categoria
    );
  }

  if (query.maxPrecio) {
    const maxPrecio = parseFloat(query.maxPrecio);
    productosFiltrados = productosFiltrados.filter(
      (p) => p.precio <= maxPrecio
    );
  }

  // Ordenar si se especifica
  if (query.ordenar === "precio_asc") {
    productosFiltrados.sort((a, b) => a.precio - b.precio);
  } else if (query.ordenar === "precio_desc") {
    productosFiltrados.sort((a, b) => b.precio - a.precio);
  }

  // Preparar datos para el template
  const templateData = {
    titulo: "Nuestros Productos",
    productos: productosFiltrados, // Array de productos
    productosCount: productosFiltrados.length, // Número como variable separada
    tieneProductos: productosFiltrados.length > 0,
    filtroAplicado: !!filtroAplicado, // Booleano: true si hay filtros
    query: query,
  };

  const html = await templates.render("productos", templateData);
  response.writeHead(200, { "Content-Type": "text/html" });
  response.end(html);
});

router.get("/productos/:id", async (context) => {
  const { response, params } = context;
  const id = parseInt(params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    const html = await templates.render("404", {
      titulo: "Producto no encontrado",
    });
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end(html);
    return;
  }

  const html = await templates.render("producto-detalle", {
    titulo: producto.nombre,
    producto: producto,
  });

  response.writeHead(200, { "Content-Type": "text/html" });
  response.end(html);
});

router.get("/about", async (context) => {
  const { response } = context;

  const html = await templates.render("about", {
    titulo: "Acerca de Nosotros",
    empresa: "Mi Tienda Online",
    descripcion:
      "Somos una empresa dedicada a ofrecer los mejores productos desde 2020.",
    fundacion: 2020,
  });

  response.writeHead(200, { "Content-Type": "text/html" });
  response.end(html);
});

router.get("/api/productos", (context) => {
  const { response, query } = context;

  let resultados = productos;

  if (query.categoria) {
    resultados = resultados.filter((p) => p.categoria === query.categoria);
  }

  if (query.minPrecio) {
    const minPrecio = parseFloat(query.minPrecio);
    resultados = resultados.filter((p) => p.precio >= minPrecio);
  }

  if (query.maxPrecio) {
    const maxPrecio = parseFloat(query.maxPrecio);
    resultados = resultados.filter((p) => p.precio <= maxPrecio);
  }

  if (query.ordenar === "precio_asc") {
    resultados.sort((a, b) => a.precio - b.precio);
  } else if (query.ordenar === "precio_desc") {
    resultados.sort((a, b) => b.precio - a.precio);
  }

  // Paginación
  const pagina = parseInt(query.pagina) || 1;
  const limite = parseInt(query.limite) || 10;
  const inicio = (pagina - 1) * limite;
  const paginados = resultados.slice(inicio, inicio + limite);

  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(
    JSON.stringify({
      total: resultados.length,
      pagina,
      limite,
      productos: paginados,
    })
  );
});

router.get("/api/productos/:id", (context) => {
  const { response, params } = context;
  const id = parseInt(params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Producto no encontrado." }));
    return;
  }

  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(producto));
});

const servidor = http.createServer(async (request, response) => {
  const { method } = request;
  const parsedUrl = url.parse(request.url, true);
  const { pathname } = parsedUrl;

  try {
    const archivoServido = await staticServer.serve(request, response);
    if (archivoServido) return;

    const routeInfo = router.findRoute(method, pathname);

    if (routeInfo) {
      await router.execute(request, response, routeInfo);
    } else {
      const html = await templates.render("404", {
        titulo: "Página no encontrada",
        mensaje: `La ruta ${pathname} no existe en este servidor.`,
      });
      response.writeHead(404, { "Content-Type": "text/html" });
      response.end(html);
    }
  } catch (error) {
    console.error("Error en el servidor:", error);

    const html = await templates.render("error", {
      titulo: "Error del servidor",
      mensaje:
        "Ha ocurrido un error interno. Por favor, inténtelo de nuevo más tarde.",
      error: process.env.NODE_ENV === "development" ? error.message : "",
    });

    response.writeHead(500, { "Content-Type": "text/html" });
    response.end(html);
  }
});

async function iniciarServidor() {
  try {
    await staticServer.preload(["static/css/styles.css", "static/js/app.js"]);

    const PUERTO = process.env.PORT || 3000;
    servidor.listen(PUERTO, () => {
      console.log(
        `Servidor web completo ejecutándose en http://localhost:${PUERTO}`
      );
      console.log(`Página principal: http://localhost:${PUERTO}`);
      console.log(`Productos: http://localhost:${PUERTO}/productos`);
      console.log(`API: http://localhost:${PUERTO}/api/productos`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  console.log("\nCerrando servidor...");
  servidor.close(() => {
    console.log("Servidor cerrado correctamente");
    process.exit(0);
  });
});

if (require.main === module) {
  iniciarServidor();
}
