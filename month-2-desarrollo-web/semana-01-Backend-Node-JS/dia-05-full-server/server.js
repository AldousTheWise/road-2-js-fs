// server.js - VERSIÓN COMPLETA Y CORREGIDA
const http = require("http");
const fs = require("fs");
const path = require("path");
const Router = require("./router.js");
const TemplateEngine = require("./templates.js");
const StaticServer = require("./static-server.js");
const middlewares = require("./middlewares");

// Cargar productos
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

// Middlewares globales
router.use(middlewares.logger);
router.use(middlewares.cors);
router.use(middlewares.jsonParser);
router.use(middlewares.formParser);
router.use(middlewares.staticFiles);
router.use(middlewares.sessions);

// Helper para datos de autenticación
function getAuthData(context) {
  const session = context.session;
  const rol = session ? session.rol : null;

  return {
    session: session,
    esAdmin: rol === "admin",
    esUsuario: rol === "usuario",
    noAuth: !session,
    haySesion: !!session,
  };
}

// Helper para construir datos de template
function buildTemplateData(context, extraData = {}) {
  return {
    ...getAuthData(context),
    ...extraData,
  };
}

// ==================== RUTAS PÚBLICAS ====================

// Página principal
router.get("/", async (context) => {
  const templateData = buildTemplateData(context, {
    titulo: "Bienvenido a Mi Tienda",
    productos: productos.slice(0, 3),
    fecha: new Date().toLocaleDateString("es-ES"),
  });

  const html = await templates.render("home", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// Lista de productos
router.get("/productos", async (context) => {
  const { query } = context;

  let productosFiltrados = [...productos];
  const filtroAplicado = query.categoria || query.maxPrecio || query.ordenar;

  if (query.categoria) {
    productosFiltrados = productosFiltrados.filter(
      (p) => p.categoria === query.categoria,
    );
  }

  if (query.maxPrecio) {
    const maxPrecio = parseFloat(query.maxPrecio);
    productosFiltrados = productosFiltrados.filter(
      (p) => p.precio <= maxPrecio,
    );
  }

  if (query.ordenar === "precio_asc") {
    productosFiltrados.sort((a, b) => a.precio - b.precio);
  } else if (query.ordenar === "precio_desc") {
    productosFiltrados.sort((a, b) => b.precio - a.precio);
  }

  const templateData = buildTemplateData(context, {
    titulo: "Nuestros Productos",
    productos: productosFiltrados,
    productosCount: productosFiltrados.length,
    tieneProductos: productosFiltrados.length > 0,
    filtroAplicado: !!filtroAplicado,
    query: query,
  });

  const html = await templates.render("productos", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// Detalle de producto
router.get("/productos/:id", async (context) => {
  const { params } = context;
  const id = parseInt(params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    const templateData = buildTemplateData(context, {
      titulo: "Producto no encontrado",
    });
    const html = await templates.render("404", templateData);
    context.response.writeHead(404, { "Content-Type": "text/html" });
    context.response.end(html);
    return;
  }

  const templateData = buildTemplateData(context, {
    titulo: producto.nombre,
    producto: producto,
  });

  const html = await templates.render("producto-detalle", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// Acerca de
router.get("/about", async (context) => {
  const templateData = buildTemplateData(context, {
    titulo: "Acerca de Nosotros",
    empresa: "Mi Tienda Online",
    descripcion:
      "Somos una empresa dedicada a ofrecer los mejores productos desde 2020.",
    fundacion: 2020,
  });

  const html = await templates.render("about", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// ==================== API PÚBLICA ====================

router.get("/api/productos", (context) => {
  const { query } = context;
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

  const pagina = parseInt(query.pagina) || 1;
  const limite = parseInt(query.limite) || 10;
  const inicio = (pagina - 1) * limite;
  const paginados = resultados.slice(inicio, inicio + limite);

  context.response.writeHead(200, { "Content-Type": "application/json" });
  context.response.end(
    JSON.stringify({
      total: resultados.length,
      pagina,
      limite,
      productos: paginados,
    }),
  );
});

router.get("/api/productos/:id", (context) => {
  const { params } = context;
  const id = parseInt(params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    context.response.writeHead(404, { "Content-Type": "application/json" });
    context.response.end(JSON.stringify({ error: "Producto no encontrado." }));
    return;
  }

  context.response.writeHead(200, { "Content-Type": "application/json" });
  context.response.end(JSON.stringify(producto));
});

// ==================== AUTENTICACIÓN ====================

// Login - GET
router.get("/login", async (context) => {
  if (context.session) {
    context.response.writeHead(302, { Location: "/" });
    context.response.end();
    return;
  }

  const templateData = buildTemplateData(context, {
    titulo: "Iniciar sesión",
  });

  const html = await templates.render("login", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// Login - POST
router.post("/login", async (context) => {
  if (context.session) {
    context.response.writeHead(302, { Location: "/" });
    context.response.end();
    return;
  }

  const { email, password } = context.body;

  try {
    const user = await middlewares.authService.authenticate(email, password);

    if (!user) {
      const templateData = buildTemplateData(context, {
        titulo: "Iniciar Sesión",
        error: "Email o contraseña incorrectos",
      });

      const html = await templates.render("login", templateData);
      context.response.writeHead(401, { "Content-Type": "text/html" });
      context.response.end(html);
      return;
    }

    const { sessionId } = context.sessionManager.createSession(user);
    const cookie = `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`;

    context.response.writeHead(302, {
      Location: "/",
      "Set-Cookie": cookie,
    });
    context.response.end();
  } catch (error) {
    console.error("Error en login:", error);
    const templateData = buildTemplateData(context, {
      titulo: "Iniciar Sesión",
      error: "Error al iniciar sesión",
    });

    const html = await templates.render("login", templateData);
    context.response.writeHead(500, { "Content-Type": "text/html" });
    context.response.end(html);
  }
});

// Logout
router.get("/logout", async (context) => {
  const cookieHeader = context.request.headers.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split("=");
      acc[name] = value;
      return acc;
    }, {});

    const sessionId = cookies.sessionId;
    if (sessionId && context.sessionManager) {
      context.sessionManager.destroySession(sessionId);
    }
  }

  const cookie = `sessionId=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;

  context.response.writeHead(302, {
    Location: "/",
    "Set-Cookie": cookie,
  });
  context.response.end();
});

// Perfil
router.get("/perfil", async (context) => {
  if (!context.session) {
    context.response.writeHead(302, { Location: "/login" });
    context.response.end();
    return;
  }

  const nombre = context.session.nombre || "Usuario";
  const templateData = buildTemplateData(context, {
    titulo: "Mi Perfil",
    inicialNombre: nombre.charAt(0).toUpperCase(),
    fechaActual: new Date().toLocaleDateString("es-ES"),
  });

  const html = await templates.render("profile", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// Registro - GET
router.get("/register", async (context) => {
  if (context.session) {
    context.response.writeHead(302, { Location: "/" });
    context.response.end();
    return;
  }

  const templateData = buildTemplateData(context, {
    titulo: "Crear Cuenta",
    formData: {},
  });

  const html = await templates.render("register", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// Registro - POST
router.post("/register", async (context) => {
  const { nombre, email, password, confirmPassword } = context.body;

  try {
    if (password !== confirmPassword) {
      throw new Error("Las contraseñas no coinciden");
    }

    await middlewares.authService.registerUser({
      nombre,
      email,
      password,
    });

    context.response.writeHead(302, { Location: "/login?registered=true" });
    context.response.end();
  } catch (error) {
    const templateData = buildTemplateData(context, {
      titulo: "Crear Cuenta",
      error: error.message,
      formData: { nombre, email },
    });

    const html = await templates.render("register", templateData);
    context.response.writeHead(400, { "Content-Type": "text/html" });
    context.response.end(html);
  }
});

// Admin
router.get("/admin", async (context) => {
  const auth = getAuthData(context);

  // 1. Verificación de sesión
  if (auth.noAuth) {
    context.response.writeHead(302, { Location: "/login" });
    context.response.end();
    return;
  }

  // 2. Verificación de Rol (Usando el helper)
  if (!auth.esAdmin) {
    // Es más coherente renderizar una página de error con tu layout
    const templateData = buildTemplateData(context, {
      titulo: "Acceso Denegado",
      mensaje:
        "No tienes permisos suficientes para entrar al panel de administración.",
    });

    const html = await templates.render("404", templateData); // O una vista de 'error' si tienes
    context.response.writeHead(403, { "Content-Type": "text/html" });
    context.response.end(html);
    return;
  }

  const templateData = buildTemplateData(context, {
    titulo: "Panel de Administración",
    totalProductos: productos.length,
    ultimosProductos: productos.slice(-5).reverse(),
    nombreAdmin: context.session.nombre,
    fecha: new Date().toLocaleDateString("es-ES"),
  });

  const html = await templates.render("admin", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// ==================== SERVER HANDLER ====================

const servidor = http.createServer(async (request, response) => {
  const { method } = request;

  try {
    const baseUrl = `http://${request.headers.host || "localhost"}`;
    const urlObj = new URL(request.url, baseUrl);
    const pathname = urlObj.pathname;

    const query = {};
    urlObj.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    const context = {
      request,
      response,
      query,
      params: {},
      body: {},
      user: null,
    };

    const archivoServido = await staticServer.serve(request, response);
    if (archivoServido) return;

    const routeInfo = router.findRoute(method, pathname);

    if (routeInfo) {
      await router.execute(context, routeInfo);
    } else {
      const templateData = buildTemplateData(context, {
        titulo: "Página no encontrada",
        mensaje: `La ruta ${pathname} no existe.`,
      });

      const html = await templates.render("404", templateData);
      response.writeHead(404, { "Content-Type": "text/html" });
      response.end(html);
    }
  } catch (error) {
    console.error("Error en el servidor:", error);

    const html = await templates.render("error", {
      titulo: "Error del servidor",
      mensaje: "Ha ocurrido un error interno.",
      error: process.env.NODE_ENV === "development" ? error.message : "",
      session: null,
      esAdmin: false,
      noSesion: true,
      haySesion: false,
    });

    response.writeHead(500, { "Content-Type": "text/html" });
    response.end(html);
  }
});

// ==================== INICIAR SERVIDOR ====================

async function iniciarServidor() {
  try {
    await staticServer.preload(["static/css/styles.css", "static/js/app.js"]);

    const PUERTO = process.env.PORT || 3000;
    servidor.listen(PUERTO, async () => {
      console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
      console.log(`Home: http://localhost:${PUERTO}`);
      console.log(`Productos: http://localhost:${PUERTO}/productos`);
      console.log(`Login: http://localhost:${PUERTO}/login`);
      console.log(`Perfil: http://localhost:${PUERTO}/perfil`);
      console.log(`Admin: http://localhost:${PUERTO}/admin`);
      console.log(`API: http://localhost:${PUERTO}/api/productos`);
      console.log(`=======================================`);
      console.log(`Credenciales de prueba:`);
      console.log(`admin@tienda.com / admin123`);
      console.log(`usuario@tienda.com / usuario123`);
      console.log(`=======================================`);
    });
  } catch (error) {
    console.error("Error al iniciar:", error);
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
